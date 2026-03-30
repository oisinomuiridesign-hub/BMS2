import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const BMSAuthContext = createContext(null);

const MOCK_USERS = {
  owner: {
    name: 'Martijn de Vries',
    role: 'owner',
    email: 'martijn@basiqtruck.nl',
  },
  planner: {
    name: 'Sophie Janssen',
    role: 'planner',
    email: 'sophie@basiqtruck.nl',
  },
};

export function BMSAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = useCallback((role) => {
    const mock = MOCK_USERS[role];
    if (!mock) return;
    setUser(mock);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return (
    <BMSAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </BMSAuthContext.Provider>
  );
}

export function useBMSAuth() {
  return useContext(BMSAuthContext);
}
