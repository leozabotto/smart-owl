import React, { createContext } from 'react';

import useAuth from './hooks/useAuth';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const {
    user, userId, loading, role, permissions, handleLogin, handleLogout
  } = useAuth();

  return (
    <AuthContext.Provider value={{ signed: !!user, user, userId, loading, role, permissions, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };