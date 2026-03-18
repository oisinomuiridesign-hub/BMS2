import { createContext, useContext, useState } from 'react';
import { findPortalByCredentials, findPortalById } from '../data/portal/portals';

// ─── Role derivation ──────────────────────────────────────────────────────────
function deriveRole(portal) {
  if (!portal) return null;
  switch (portal.entityType) {
    case 'LEAD':     return 'lead';
    case 'CLIENT':   return 'client';
    case 'EMPLOYEE': return 'employee';
    default:         return null;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────
const PortalAuthContext = createContext(null);

export function PortalAuthProvider({ children }) {
  // portalUser shape: { email, role, portalId, entityType, entityId, companyName, contactPerson }
  const [portalUser, setPortalUser] = useState(null);
  // When management opens portal via BMS "Open Portal" button (?mgmt=true), no login is needed
  const [isManagementView, setIsManagementView] = useState(false);

  /**
   * Attempt login. Returns the matched portal object on success, null on failure.
   * Callers can use the returned portal to navigate to the correct URL.
   */
  function login(email, password) {
    const portal = findPortalByCredentials(email, password);
    if (!portal) return null;

    setPortalUser({
      email: portal.loginEmail,
      role: deriveRole(portal),
      portalId: portal.id,
      entityType: portal.entityType,
      entityId: portal.entityId,
      companyName: portal.companyName,
      contactPerson: portal.contactPerson,
    });
    setIsManagementView(false);
    return portal;
  }

  /**
   * Enter management view for a specific portal without login.
   * Called when a BMS user hits "Open Portal" with ?mgmt=true.
   */
  function enterManagementView(portalId) {
    const portal = findPortalById(portalId);
    if (!portal) return false;

    setPortalUser({
      email: 'management@btc.nl',
      role: 'management',
      portalId: portal.id,
      entityType: portal.entityType,
      entityId: portal.entityId,
      companyName: portal.companyName,
      contactPerson: portal.contactPerson,
    });
    setIsManagementView(true);
    return true;
  }

  function logout() {
    setPortalUser(null);
    setIsManagementView(false);
  }

  return (
    <PortalAuthContext.Provider
      value={{
        portalUser,
        login,
        logout,
        enterManagementView,
        isManagementView,
      }}
    >
      {children}
    </PortalAuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) {
    throw new Error('usePortalAuth must be used inside <PortalAuthProvider>');
  }
  return ctx;
}
