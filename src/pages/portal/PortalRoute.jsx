import { useEffect } from 'react';
import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { findPortalById } from '../../data/portal/portals';
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

  const isMgmt = searchParams.get('mgmt') === 'true';

  // If management view is requested via URL param, enter it (idempotent)
  useEffect(() => {
    if (isMgmt) {
      enterManagementView(portalId);
    }
  }, [isMgmt, portalId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Look up the portal data
  const portal = findPortalById(portalId);

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
