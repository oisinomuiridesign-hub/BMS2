import { createContext, useContext, useState, useMemo } from 'react';
import { notifications as initialData, NOTIFICATION_CATEGORIES } from '../data/bms/notifications';
import { useChangeRequests } from './ChangeRequestsContext';
import { useBMSAuth } from './BMSAuthContext';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [items, setItems] = useState(initialData);
  const { approveRequest, rejectRequest } = useChangeRequests();
  const { user } = useBMSAuth();

  // ── Actions ─────────────────────────────────────────────────────────────────

  function markAsRead(id) {
    setItems((prev) =>
      prev.map((n) =>
        n.id === id && n.status === 'UNREAD' ? { ...n, status: 'READ' } : n
      )
    );
  }

  function approveNotification(id) {
    setItems((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        // Sync with ChangeRequestsContext
        if (n.changeRequestId) approveRequest(n.changeRequestId);
        return {
          ...n,
          status: 'APPROVED',
          resolvedBy: 'Martijn de Vries',
          resolvedAt: new Date().toISOString(),
        };
      })
    );
  }

  function rejectNotification(id, notes = '') {
    setItems((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        // Sync with ChangeRequestsContext
        if (n.changeRequestId) rejectRequest(n.changeRequestId);
        return {
          ...n,
          status: 'REJECTED',
          resolvedBy: 'Martijn de Vries',
          resolvedAt: new Date().toISOString(),
          resolvedNotes: notes || null,
        };
      })
    );
  }

  // ── Role-filtered list ──────────────────────────────────────────────────────

  const roleLabel = user?.role === 'owner' ? 'Owner' : user?.role === 'planner' ? 'Planner' : null;

  const filtered = useMemo(
    () => (roleLabel ? items.filter((n) => n.roles?.includes(roleLabel)) : items),
    [items, roleLabel]
  );

  // ── Computed values ─────────────────────────────────────────────────────────

  const unreadCount = useMemo(
    () => filtered.filter((n) => n.status === 'UNREAD' || n.status === 'PENDING').length,
    [filtered]
  );

  const pendingActionCount = useMemo(
    () => filtered.filter((n) => n.actionable && n.status === 'PENDING').length,
    [filtered]
  );

  const countsByCategory = useMemo(() => {
    const counts = { ALL: filtered.length };
    for (const key of Object.keys(NOTIFICATION_CATEGORIES)) {
      counts[key] = filtered.filter((n) => n.category === key).length;
    }
    return counts;
  }, [filtered]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications: filtered,
        markAsRead,
        approveNotification,
        rejectNotification,
        unreadCount,
        pendingActionCount,
        countsByCategory,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
