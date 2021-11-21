import React, { 
  useContext, 
  useState,  
 } from 'react';

import {
  CircularProgress,
} from '@material-ui/core';

import PrimaryButton from '../Button';
import Modal from '../Modal';

import { SnackContext } from '../../contexts/SnackContext';

import './index.css';
import api from '../../services/api';


const ModalSolicitacaoMatricula = (props) => {

  const { setSnack } = useContext(SnackContext);

  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {  

    try {     
      setLoading(true);
      setTimeout(() => {
        setSnack({
          message: 'Solicitação recebida! Em breve entraremos em contato com você. 😉',
          type: 'success',
          open: true,
        });
        setLoading(false);
        props.handleClose();
      }, 2000);
                                         
    } catch (err) {   
      setSnack({ 
        message: 'Ocorreu um erro ao tentar fazer a solicitação. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });
           
      setLoading(false);
    }
  }

  return (
    <Modal
      open={props.modalOpen}
      onClose={props.handleClose}
      title={`Você confirma a solicitação de matrícula?`}
      actions={
        <>   
          {loading ? '' : <>     
          <PrimaryButton onClick={props.handleClose}>CANCELAR</PrimaryButton>
          <PrimaryButton onClick={() => handleSubmit()}>SIM</PrimaryButton></>}
        </>
      }
      >
        {
          loading
          ?
          <div style=
          {{ 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              alignContent: 'center',
              alignItems: 'center',
          }}>
            <CircularProgress />
          </div>    
          :        
          ''
        }
    </Modal>     
  );
};

export default ModalSolicitacaoMatricula;