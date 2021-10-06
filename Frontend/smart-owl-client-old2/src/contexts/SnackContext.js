import React, { createContext } from 'react';


import useSnack from './hooks/useSnack';

const SnackContext = createContext();

function SnackProvider({ children }) {
  const {
    snack, setSnack, handleClose, ConfigSnack
  } = useSnack();

  return (
    <SnackContext.Provider value={{ snack, setSnack, handleClose, ConfigSnack }}>
      <ConfigSnack/>
        {children}
    </SnackContext.Provider>
  );
}

export { SnackContext, SnackProvider };