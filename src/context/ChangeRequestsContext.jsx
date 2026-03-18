import { createContext, useContext, useState } from 'react';
import { changeRequests as initialData } from '../data/bms/changeRequests';

const ChangeRequestsContext = createContext(null);

export function ChangeRequestsProvider({ children }) {
  const [requests, setRequests] = useState(initialData);

  function addRequests(newEntries) {
    setRequests((prev) => [...newEntries, ...prev]);
  }

  function approveRequest(id) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'APPROVED', reviewedBy: 'Martijn de Vries', reviewedAt: new Date().toISOString() }
          : r
      )
    );
  }

  function rejectRequest(id) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'REJECTED', reviewedBy: 'Martijn de Vries', reviewedAt: new Date().toISOString() }
          : r
      )
    );
  }

  function getPendingForClient(clientId) {
    return requests.filter((r) => r.clientId === clientId && r.status === 'PENDING');
  }

  return (
    <ChangeRequestsContext.Provider value={{ requests, addRequests, approveRequest, rejectRequest, getPendingForClient }}>
      {children}
    </ChangeRequestsContext.Provider>
  );
}

export function useChangeRequests() {
  return useContext(ChangeRequestsContext);
}
