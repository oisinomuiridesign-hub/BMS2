import { createContext, useContext, useState } from 'react';
import { leads as initialLeads } from '../data/leads/leads';
import { clients as initialClients } from '../data/bms/clients';
import { portals as initialPortals } from '../data/portal/portals';
import { agreements as initialAgreements } from '../data/portal/agreements';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [leads, setLeads] = useState(initialLeads);
  const [clients, setClients] = useState(initialClients);
  const [portals, setPortals] = useState(initialPortals);
  const [agreements, setAgreements] = useState(initialAgreements);

  // ── Stage 1: approve / disapprove the captured lead ─────────────────────────
  function approveLead(leadId, plannerName = 'BMS Planner') {
    const now = new Date().toISOString();
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId && l.status === 'CAPTURED'
          ? {
              ...l,
              status: 'APPROVED',
              plannerApprovedAt: now,
              plannerApprovedBy: plannerName,
              updatedAt: now,
              lastActivity: now,
            }
          : l
      )
    );
  }

  function disapproveLead(leadId, reason = 'Disapproved by planner.') {
    const now = new Date().toISOString();
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, status: 'LOST', lostReason: reason, updatedAt: now, lastActivity: now }
          : l
      )
    );
  }

  // ── Stage 2: the Service Detail Form (Form 2) ───────────────────────────────
  // A form ID like "SDF-2026-0007" is assigned the moment the form is generated —
  // whether the planner emails it to the lead or fills it on the call. The ID is
  // embedded in the form URL, so the form page resolves its lead and stays tied
  // to the BMS listing. The lead is already APPROVED by this point, so generating
  // the form does not change the stage; only submission does.
  function nextServiceFormId(currentLeads) {
    const year = new Date().getFullYear();
    const seq = currentLeads.filter((l) => l.serviceFormId).length + 1;
    return `SDF-${year}-${String(seq).padStart(4, '0')}`;
  }

  function generateServiceForm(leadId, mode = 'planner') {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return null;

    const now = new Date().toISOString();
    const assignedId = lead.serviceFormId || nextServiceFormId(leads);

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== leadId) return l;
        const base = { ...l, serviceFormId: assignedId, updatedAt: now, lastActivity: now };
        return mode === 'email' ? { ...base, form2SentAt: now } : base;
      })
    );

    return assignedId;
  }

  // ── Proposal (agreement) drafting from the submitted form ───────────────────
  function nextMoneybirdRef(currentAgreements) {
    const year = new Date().getFullYear();
    const seq = currentAgreements.length + 1;
    return `MB-${year}-${String(seq).padStart(4, '0')}`;
  }

  // Derive a DRAFT proposal (agreement) from a lead's submitted service details.
  // Represents the AI agent's backend draft, made visible in BMS at Under Review.
  function deriveProposal(lead) {
    const sdf = lead.serviceDetailsForm || {};
    const rows = sdf.vehicleTable || [];
    const freqCounts = {};
    rows.forEach((r) => {
      freqCounts[r.frequencyWeeks] = (freqCounts[r.frequencyWeeks] || 0) + 1;
    });
    const topFreq = Object.keys(freqCounts).sort((a, b) => freqCounts[b] - freqCounts[a])[0];
    const freqLabel =
      topFreq === '1' ? 'Weekly'
      : topFreq === '2' ? 'Bi-weekly'
      : topFreq === '4' ? 'Monthly'
      : 'Mixed schedule';
    const pricePerWash = rows.reduce((s, r) => s + (Number(r.pricePerVehicle) || 0), 0);
    const start = new Date(Date.now() + 14 * 86400000);
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + 1);

    return {
      id: `agreement-${lead.id}`,
      leadId: lead.id,
      portalId: null,
      status: 'DRAFT',
      vehicleCount: rows.length,
      washFrequency: freqLabel,
      serviceType: sdf.serviceType || 'Standard service',
      pricePerWash,
      currency: 'EUR',
      contractDuration: '12 months',
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      paymentTerms: sdf.discount
        ? `Net 30 days, monthly invoice — ${sdf.discountPercent}% discount applied`
        : 'Net 30 days, monthly invoice',
      discountPercent: sdf.discount ? sdf.discountPercent : null,
      sentAt: null,
      acceptedAt: null,
      acceptedBy: null,
      moneybirdQuoteRef: null,
      version: 1,
      // proposal line items default to the submitted vehicle table; editable later
      lineItems: rows.map((r) => ({ ...r })),
      amendments: [],
    };
  }

  // Submit the service form — used by both the planner-fill and lead self-serve
  // paths. Captures the details, advances the lead straight to UNDER_REVIEW, and
  // auto-drafts the proposal so it's ready to preview. Resolves the lead by form
  // ID first; falls back to fallbackLeadId so the form still works in a fresh tab.
  function submitServiceDetailsForm(formId, formData, fallbackLeadId = null) {
    const lead =
      leads.find((l) => l.serviceFormId === formId) ||
      leads.find((l) => l.id === fallbackLeadId);
    if (!lead) return null;

    const now = new Date().toISOString();
    const updatedLead = {
      ...lead,
      serviceFormId: lead.serviceFormId || formId,
      status: 'UNDER_REVIEW',
      serviceDetailsForm: { ...formData, form2SubmittedAt: now },
      updatedAt: now,
      lastActivity: now,
    };

    setLeads((prev) => prev.map((l) => (l.id === lead.id ? updatedLead : l)));
    setAgreements((prev) =>
      prev.some((a) => a.leadId === lead.id) ? prev : [...prev, deriveProposal(updatedLead)]
    );

    return lead.id;
  }

  // ── Stage 3+: proposal lifecycle ────────────────────────────────────────────
  // Edit the draft/sent proposal terms (used for the customize-and-resend loop).
  function updateProposal(leadId, patch) {
    const now = new Date().toISOString();
    setAgreements((prev) =>
      prev.map((a) => (a.leadId === leadId ? { ...a, ...patch } : a))
    );
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, updatedAt: now, lastActivity: now } : l))
    );
  }

  // Send (or resend) the proposal: agreement → AWAITING_ACCEPTANCE, lead →
  // PROPOSAL_SENT. A resend (already sent before) bumps the version.
  function sendProposal(leadId) {
    const now = new Date().toISOString();
    setAgreements((prev) =>
      prev.map((a) => {
        if (a.leadId !== leadId) return a;
        const isResend = Boolean(a.sentAt);
        return {
          ...a,
          status: 'AWAITING_ACCEPTANCE',
          sentAt: now,
          moneybirdQuoteRef: a.moneybirdQuoteRef || nextMoneybirdRef(prev),
          version: isResend ? (a.version || 1) + 1 : a.version || 1,
        };
      })
    );
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, status: 'PROPOSAL_SENT', updatedAt: now, lastActivity: now } : l
      )
    );
  }

  // Proposal Sent → Awaiting Acceptance (after the planner's follow-up).
  function markAwaitingAcceptance(leadId) {
    const now = new Date().toISOString();
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId && l.status === 'PROPOSAL_SENT'
          ? { ...l, status: 'AWAITING_ACCEPTANCE', updatedAt: now, lastActivity: now }
          : l
      )
    );
  }

  // Lead signs → agreement ACCEPTED, lead → READY_TO_CONVERT.
  function acceptProposal(leadId, signerName) {
    const now = new Date().toISOString();
    const lead = leads.find((l) => l.id === leadId);
    const signer = signerName || lead?.contactPerson || 'Lead';
    setAgreements((prev) =>
      prev.map((a) =>
        a.leadId === leadId
          ? { ...a, status: 'ACCEPTED', acceptedAt: now, acceptedBy: signer }
          : a
      )
    );
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, status: 'READY_TO_CONVERT', updatedAt: now, lastActivity: now }
          : l
      )
    );
  }

  function convertLeadToClient(leadId) {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === 'CONVERTED') return null;

    const now = new Date().toISOString();
    const newClientId = Math.max(...clients.map((c) => c.id)) + 1;
    const newPortalId = `portal-client-${String(newClientId).padStart(3, '0')}`;

    // Build address from serviceDetailsForm or fall back to lead.location
    const sdf = lead.serviceDetailsForm;
    const address = sdf
      ? `${sdf.street} ${sdf.houseNumber}, ${sdf.postalCode} ${sdf.city}`
      : (lead.location || '');
    const city = sdf?.city || (lead.location?.split(',').pop()?.trim() || '');

    // Build contacts array
    const contacts = [];
    if (lead.contactPerson) {
      contacts.push({
        id: newClientId * 100 + 1,
        role: 'Owner',
        name: lead.contactPerson,
        phone: lead.contactPhone || '',
        email: lead.contactEmail || '',
        starred: true,
      });
    }
    if (
      sdf?.contactFullName &&
      sdf.contactFullName !== lead.contactPerson
    ) {
      contacts.push({
        id: newClientId * 100 + 2,
        role: sdf.contactDepartment || 'Contact',
        name: sdf.contactFullName,
        phone: sdf.contactTelephone || '',
        email: sdf.contactEmail || '',
        starred: false,
      });
    }

    const newClient = {
      id: newClientId,
      name: lead.companyName,
      companyName: lead.companyName,
      avatarInitials: lead.avatarInitials,
      avatarColor: lead.avatarColor,
      address,
      city,
      phone: lead.contactPhone || '',
      email: lead.contactEmail || '',
      departments: [],
      status: 'active',
      createdDate: now.split('T')[0],
      moneybirdCN: '',
      vatNumber: sdf?.vatNumber || '',
      kvkNumber: sdf?.kvkNumber || '',
      portalId: newPortalId,
      contacts,
    };

    // Find the lead's existing portal record to carry over manual/agreement links
    const leadPortal = portals.find(
      (p) => p.entityId === leadId && p.entityType === 'LEAD'
    );

    // A just-converted client has a signed agreement but no vehicles assigned yet,
    // so the portal opens at the Vehicle Assignment onboarding stage.
    const leadAgreement = agreements.find((a) => a.leadId === leadId);
    const newPortal = {
      id: newPortalId,
      entityType: 'CLIENT',
      entityId: newClientId,
      stage: 'VEHICLE_ASSIGNMENT',
      locationManualId: leadPortal?.locationManualId || null,
      agreementId: leadAgreement?.id || leadPortal?.agreementId || null,
      companyName: lead.companyName,
      contactPerson: lead.contactPerson,
      loginEmail: lead.contactEmail,
      loginPassword: 'btc2026',
      portalUrl: `/portal/${newPortalId}`,
      createdAt: now,
      lastActivity: now,
    };

    setClients((prev) => [...prev, newClient]);
    setPortals((prev) => [...prev, newPortal]);

    // Link existing agreement to new client portal
    setAgreements((prev) =>
      prev.map((a) =>
        a.leadId === leadId ? { ...a, portalId: newPortalId } : a
      )
    );

    // Mark lead as CONVERTED
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, status: 'CONVERTED', convertedAt: now, convertedTo: newClientId }
          : l
      )
    );

    return newClientId;
  }

  return (
    <DataContext.Provider
      value={{
        leads,
        clients,
        portals,
        agreements,
        convertLeadToClient,
        approveLead,
        disapproveLead,
        generateServiceForm,
        submitServiceDetailsForm,
        updateProposal,
        sendProposal,
        markAwaitingAcceptance,
        acceptProposal,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
