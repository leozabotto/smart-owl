import { useState } from 'react';
import { Fade, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

export default function useSnack() {
  const [snack, setSnack] = useState({
    message: '',
    type: '',
    open: false,
  });

  const [severity, setSeverity] = useState(snack.type)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnack({ message: '', type: severity, open: false });
  };

  const ConfigSnack = () => {
    return (
      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        disableWindowBlurListener
      >
        <Alert variant="filled" severity={snack.type} >
          {snack.message}
        </Alert>
      </Snackbar>

    )

  }

  return { snack, setSnack, setSeverity, handleClose, ConfigSnack };
}