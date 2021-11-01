import React, { 
  useContext, 
  useState, 
  useReducer,
  useEffect,
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
        message: 'Aguarde a edição!',
        type: 'error',
        open: true
      });
      return;
    }

    setLoading(true);

    try {
      dispatch({ type: 'lockSubmit' });

      const curso = await api.put(`/curso/${props.cursoParaEditar.id}`, { ...form })
      
      setSnack({
        message: 'Curso atualizado!',
        type: 'success',
        open: true,
      });
      
      dispatch({ type: 'resetForm' });     
      props.setCursoEditado(curso);
      props.handleEditModalClose();           
      
      setLoading(false);
    } catch (err) {   
      setSnack({ 
        message: 'Ocorreu um erro ao tentar salvar. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });
      dispatch({ type: 'unlockSubmit' });        
      setLoading(false);
    }
  }

  useEffect(() => {

    async function setUnidade() {   
      try {        
        setLoading(true);
                      
        dispatch({ type: 'cgNome', value: props.cursoParaEditar.nome });             
        dispatch({ type: 'cgDescricao', value: props.cursoParaEditar.descricao });             
        dispatch({ type: 'cgCargaHoraria', value: props.cursoParaEditar.carga_horaria });                         
        
        setLoading(false);
      } catch (err) {
        console.log(err)
        setSnack({ 
          message: 'Ocorreu um erro ao buscar o curso. ' + err, 
          type: 'error', 
          open: true
        });
        setLoading(false);
        props.handleEditModalClose();
      }
    }

    if (props.cursoParaEditar !== undefined && props.cursoParaEditar !== null) {
      setUnidade(); 
    }

  }, [props.cursoParaEditar]);

  return (
    <Modal
      open={props.editModal}
      onClose={props.handleEditModalClose}
      title={`Editar Curso`}
      actions={
        <>        
          <PrimaryButton onClick={props.handleEditModalClose}>CANCELAR</PrimaryButton>
          <PrimaryButton onClick={() => handleSubmit()}>ATUALIZAR</PrimaryButton>
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
                title="Informações do Curso"
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
                    rows={4}
                    rowsMax={6}    
                    multiline        
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