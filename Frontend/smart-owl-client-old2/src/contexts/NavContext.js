import { createContext } from 'react';

import useNavigation from './hooks/useNavigation';

const NavContext = createContext();

function NavProvider({ children }) {
  const {
    register, 
    handleRegister,
    cashFlow,
    handleCashFlow,
  } = useNavigation();

  return (
    <NavContext.Provider value={{ 
      register, 
      handleRegister, 
      cashFlow,
      handleCashFlow,
    }}>
      {children}
    </NavContext.Provider>
  );
}

export { NavContext, NavProvider };