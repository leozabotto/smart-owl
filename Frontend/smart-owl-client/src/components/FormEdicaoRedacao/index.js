import React, { 
  useContext, 
  useState, 
  useReducer,
  useEffect
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


const FormEdicaoRedacao = (props) => {

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
      case 'cgAtivo': 
        return {
          ...state,
          ativo: action.value,
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

      const item = await api.put(`/redacao/${props.itemParaEditar.id}`, { ...form })
      
      setSnack({
        message: 'Redação atualizada!',
        type: 'success',
        open: true,
      });
      
      dispatch({ type: 'resetForm' });     
      props.setItemEditado(item);
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

    async function setItem() {   
      try {        
        setLoading(true);
                      
        dispatch({ type: 'cgTitulo', value: props.itemParaEditar.titulo });             
        dispatch({ type: 'cgEnunciado', value: props.itemParaEditar.enunciado });  
        dispatch({ type: 'cgAtivo', value: props.itemParaEditar.ativo ? true: false});

        setLoading(false);
      } catch (err) {
        console.log(err)
        setSnack({ 
          message: 'Ocorreu um erro ao buscar as informações necessárias. ' + err, 
          type: 'error', 
          open: true
        });
        setLoading(false);
        props.handleEditModalClose();
      }
    }    
    
    if (props.itemParaEditar !== undefined && props.itemParaEditar !== null) {
      setItem();
      setSnack({
        message: 'Editar um tema de redação afetará todas as provas já realizadas. Tome cuidado!',
        type: 'warning',
        open: true
      }); 
    }

  }, [props.itemParaEditar]);

  return (
    <Modal
      open={props.editModal}
      onClose={props.handleEditModalClose}
      title={`Novo Tema de Redação`}
      actions={
        <>        
          <PrimaryButton onClick={props.handleEditModalClose}>CANCELAR</PrimaryButton>
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
                <div className="input-block">
                <FormControlLabel control={
                  <Switch 
                    checked={form.ativo}
                    onChange={(e) => dispatch({ type: "cgAtivo", value: e.target.checked})}
                  />
                } label="Ativo" /></div>                                                                                     
              </div>                                                  
            </form>
          </div>
        }
    </Modal>     
  );
};

export default FormEdicaoRedacao;