import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import './index.css'

const Modal = ({ ...props }) => {
  return (
    <div>
      <Dialog
        {...props}
        disableBackdropClick
        fullWidth
      >
        <div className="modal">
          <DialogTitle>{props.title}</DialogTitle>
          <DialogContent >
            <DialogContentText>
              {props.children}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {props.actions}
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}

export default Modal;