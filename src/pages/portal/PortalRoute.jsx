import { useEffect } from 'react';
import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { useData } from '../../context/DataContext';
import PortalShell from '../../components/portal/PortalShell';

/**
 * PortalRoute — auth guard wrapper for all /portal/:portalId routes.
 *
 * Handles three cases:
 * 1. ?mgmt=true in URL  → enters management view (no login required)
 * 2. Already authenticated for this portal  → renders PortalShell
 * 3. Not authenticated  → redirects to /portal/login?portalId=:portalId
 */
export default function PortalRoute() {
  const { portalId } = useParams();
  const [searchParams] = useSearchParams();
  const { portalUser, enterManagementView, isManagementView } = usePortalAuth();
  const { portals } = useData();

  const isMgmt = searchParams.get('mgmt') === 'true';

  // Look up the portal data from live state — this includes portals created at
  // runtime when a lead is converted to a client, not just the static fixtures.
  const portal = portals.find((p) => p.id === portalId) || null;

  // If management view is requested via URL param, enter it (idempotent). Pass the
  // resolved portal object so runtime-created portals work, then portalUser is set
  // and management view persists across in-portal navigation (which drops ?mgmt).
  useEffect(() => {
    if (isMgmt && portal) {
      enterManagementView(portal);
    }
  }, [isMgmt, portal?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!portal) {
    // Unknown portal ID — bounce back to login
    return <Navigate to="/portal/login" replace />;
  }

  // Management view bypass: allow rendering immediately (effect sets context async)
  if (isMgmt) {
    return <PortalShell portal={portal} />;
  }

  // Standard auth check: user must be logged in AND matched to this portal
  if (!portalUser || portalUser.portalId !== portalId) {
    return <Navigate to={`/portal/login?portalId=${portalId}`} replace />;
  }

  return <PortalShell portal={portal} />;
}
