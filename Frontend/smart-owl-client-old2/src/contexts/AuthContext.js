import React, { createContext } from 'react';

import useAuth from './hooks/useAuth';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const {
    user, userId, loading, role, handleLogin, handleLogout
  } = useAuth();

  return (
    <AuthContext.Provider value={{ signed: !!user, user, userId, loading, role, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };