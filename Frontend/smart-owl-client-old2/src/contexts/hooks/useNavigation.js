import { useState } from 'react';

export default function useNavigation() {
  const [register, setRegister] = useState(false);
  const [cashFlow, setCashFlow] = useState(false);

  const handleRegister = () => {
    setRegister(!register);
  };

  const handleCashFlow = () => {
    setCashFlow(!cashFlow);
  };

  return { 
    register, 
    handleRegister,
    cashFlow,
    handleCashFlow
  };
}