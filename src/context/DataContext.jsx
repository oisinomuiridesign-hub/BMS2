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

    const newPortal = {
      id: newPortalId,
      entityType: 'CLIENT',
      entityId: newClientId,
      stage: 'ACTIVE',
      locationManualId: leadPortal?.locationManualId || null,
      agreementId: leadPortal?.agreementId || null,
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
    <DataContext.Provider value={{ leads, clients, portals, agreements, convertLeadToClient }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
