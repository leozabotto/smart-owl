import React, { 
  useContext, 
  useState, 
  useReducer 
 } from 'react';

import { 
  TextField, 
  CircularProgress,
} from '@material-ui/core';

import PrimaryButton from '../Button';
import Modal from '../Modal';

import { HeaderSubtitle } from '../HeaderTitle';
import { SnackContext } from '../../contexts/SnackContext';

import './index.css';
import api from '../../services/api';


const FormCadastroCurso = (props) => {

  const { setSnack } = useContext(SnackContext);

  const [loading, setLoading] = useState(false);
  
  const initialState = {   
    nome: "",
    descricao: "",
    carga_horaria: ""
  }

  const reducer = (state, action) => {
    switch(action.type) {            
      case 'cgNome': 
        return {
          ...state,
          nome: action.value,
        }
      case 'cgDescricao': 
        return {
          ...state,
          descricao: action.value,
        }
      case 'cgCargaHoraria': 
        return {
          ...state,
          carga_horaria: action.value,
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

    setLoading(true);

    try {
      dispatch({ type: 'lockSubmit' });

      const curso = await api.post('/curso', { ...form })
      
      setSnack({
        message: 'Curso cadastrado!',
        type: 'success',
        open: true,
      });
      
      dispatch({ type: 'resetForm' });     
      props.setCursoCriado(curso);
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
      title={`Novo Curso`}
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
                title="Informações da Unidade"
              />
              <div className="file-form-basic" style={{ display: 'flex', flexDirection: 'column', gap: 10}}>                                                                                             

                <div className="input-block">            
                  <TextField                                    
                    label="Nome"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.nome}
                    onChange={(e) => dispatch({
                      type: 'cgNome',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth                 
                  />  
                </div>
                <div className="input-block"> 
                  <TextField                                    
                    label="Descrição"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.descricao}
                    onChange={(e) => dispatch({
                      type: 'cgDescricao',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth                 
                  />  
                </div>
                <div className="input-block"> 
                  <TextField                                    
                    label="Carga Horária"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.carga_horaria}
                    onChange={(e) => dispatch({
                      type: 'cgCargaHoraria',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth                 
                  />  
                </div>                                       
              </div>                                                  
            </form>
          </div>
        }
    </Modal>     
  );
};

export default FormCadastroCurso;