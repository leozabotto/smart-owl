import { useState } from 'react';

export default function useNavigation() {
  const [register, setRegister] = useState(false);
  const [cashFlow, setCashFlow] = useState(false);
  const [selectiveProcess, setSelectiveProcess] = useState(false);

  const handleRegister = () => {
    setRegister(!register);
  };

  const handleCashFlow = () => {
    setCashFlow(!cashFlow);
  };

  const handleSelectiveProcess = () => {
    setSelectiveProcess(!selectiveProcess);
  };

  return { 
    register, 
    handleRegister,
    cashFlow,
    handleCashFlow,
    selectiveProcess,
    handleSelectiveProcess
  };
}