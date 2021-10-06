import React, { useState } from 'react';

const useSnack = () => {

  const [snack, setSnack] = useState({
    message: '',
    type: '',
    open: false
  });

  const [severity, setSeverity] = useState(snack.type);

  const handleClose = (e, reason => {
    if (reason === 'clickaway') {
      return;
    }

    setSnack({
      message: '',
      type: severity,
      open: false
    });
  });

  const ConfigSnack = () => 
}

export default useSnack;