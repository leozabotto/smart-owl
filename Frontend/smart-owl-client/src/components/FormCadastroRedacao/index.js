import React, { 
  useContext, 
  useState, 
  useReducer,
 } from 'react';

import { 
  TextField, 
  CircularProgress,
} from '@material-ui/core';

import { FormControlLabel, Switch } from '@material-ui/core';

import PrimaryButton from '../Button';
import Modal from '../Modal';

import { HeaderSubtitle } from '../HeaderTitle';
import { SnackContext } from '../../contexts/SnackContext';

import './index.css';
import api from '../../services/api';


const FormCadastroRedacao = (props) => {

  const { setSnack } = useContext(SnackContext);

  const [loading, setLoading] = useState(false);

  const [unidade, setUnidade] = useState(null);
  const [curso, setCurso] = useState(null);

  const handleUnidadeChange = (value) => {
    setUnidade(value);
  }

  const handleCursoChange = (value) => {
    setCurso(value);
  }
  
  const initialState = {   
   titulo: "",
   enunciado: "",
  }

  const reducer = (state, action) => {
    switch(action.type) {            
      case 'cgTitulo': 
        return {
          ...state,
          titulo: action.value,
        }
      case 'cgEnunciado': 
        return {
          ...state,
          enunciado: action.value,
        }   
      case 'resetForm':       
        return {
          ...initialState,          
        }
      default:
        return { ...state }
    }
  }
  
  const [form, dispatch] = useReducer(reducer, initialState);
 
  const handleSubmit = async () => {  

   if (form.lockedSubmit) {
      setSnack({
        message: 'Aguarde o cadastro!',
        type: 'error',
        open: true
      });
      return;
    }

    if (curso === null) {
      setSnack({ 
        message: 'Preencha todos os campos!', 
        type: 'error', 
        open: true
      });
      return;
    }

    if (unidade === null) {
      setSnack({ 
        message: 'Preencha todos os campos!', 
        type: 'error', 
        open: true
      });
      return;
    }
  
    for (let i = 0; i < Object.keys(form).length; i++) {
      if(form[Object.keys(form)[i]] === '') {
        setSnack({ 
          message: 'Preencha todos os campos!', 
          type: 'error', 
          open: true
        });
        return;
      }
    }         
    
    setLoading(true);

    try {
      dispatch({ type: 'lockSubmit' });

      const item = await api.post('/redacao', { ...form })
      
      setSnack({
        message: 'Redação cadastrada!',
        type: 'success',
        open: true,
      });
      
      dispatch({ type: 'resetForm' });  
         
      props.setItemCriado(item);
      props.handleCreateModalClose();           
      
      setLoading(false);
    } catch (err) {   
      setSnack({ 
        message: 'Ocorreu um erro ao tentar cadastrar. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });
      dispatch({ type: 'unlockSubmit' });        
      setLoading(false);
    }
  }

  return (
    <Modal
      open={props.createModal}
      onClose={props.handleCreateModalClose}
      title={`Novo Tema de Redação`}
      actions={
        <>        
          <PrimaryButton onClick={props.handleCreateModalClose}>CANCELAR</PrimaryButton>
          <PrimaryButton onClick={() => handleSubmit()}>CADASTRAR</PrimaryButton>
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
          <div>
            <form               
              onSubmit={handleSubmit} 
            >
              <HeaderSubtitle
                title="Informações da Redação"
              />
              <div className="file-form-basic" style={{ display: 'flex', flexDirection: 'column', gap: 10}}>                                                                                             

                <div className="input-block">            
                  <TextField                                    
                    label="Título"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.titulo}
                    onChange={(e) => dispatch({
                      type: 'cgTitulo',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth    
                    required={true}                          
                  />  
                </div>  
                <div className="input-block"> 
                  <TextField                                    
                    label="Enunciado"
                    variant="outlined"
                    type="text"
                    multiline
                    rows={4}
                    rowsMax={6}
                    autoComplete="off"
                    value={form.enunciado}
                    onChange={(e) => dispatch({
                      type: 'cgEnunciado',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth      
                    required={true}           
                  />  
                </div>                                                                                             
              </div>                                                  
            </form>
          </div>
        }
    </Modal>     
  );
};

export default FormCadastroRedacao;