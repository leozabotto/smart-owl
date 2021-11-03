import React, { 
  useContext, 
  useState, 
  useReducer,
 } from 'react';

import { 
  TextField, 
  CircularProgress,
  MenuItem
} from '@material-ui/core';

import { FormControlLabel, Switch } from '@material-ui/core';

import PrimaryButton from '../Button';
import Modal from '../Modal';

import { HeaderSubtitle } from '../HeaderTitle';
import { SnackContext } from '../../contexts/SnackContext';

import './index.css';
import api from '../../services/api';


const FormCadastroQuestao = (props) => {

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
      case 'cgEnunciado': 
        return {
          ...state,
          enunciado: action.value,
        } 
      case 'cgDificuldade': 
        return {
          ...state,
          dificuldade: action.value,
        } 
      case 'cgDisciplina': 
        return {
          ...state,
          disciplina: action.value,
        } 
      case 'cgCorreta': 
        return {
          ...state,
          correta: action.value,
        } 
      case 'cgAltA': 
        return {
          ...state,
          alt_a: action.value,
        } 
      case 'cgAltB': 
        return {
          ...state,
          alt_b: action.value,
        } 
      case 'cgAltC': 
        return {
          ...state,
          alt_c: action.value,
        } 
      case 'cgAltD': 
        return {
          ...state,
          alt_d: action.value,
        } 
      case 'cgAltE': 
        return {
          ...state,
          alt_e: action.value,
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

      const item = await api.post('/questao', { ...form })
      
      setSnack({
        message: 'Questão cadastrada!',
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
      title={`Nova Questão`}
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
                title="Informações da Questão"
              />
              <div className="file-form-basic" style={{ display: 'flex', flexDirection: 'column', gap: 10}}>                                                                                             

                <div className="input-block">            
                  <TextField                                    
                    label="Enunciado"
                    variant="outlined"
                    multiline
                    rows={4}
                    rowsMax={6}
                    type="text"
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
                  <TextField                                    
                    label="Disciplina"
                    variant="outlined"
                    type="number"
                    autoComplete="off"
                    value={form.disciplina}
                    onChange={(e) => dispatch({type: 'cgDisciplina', value: e.target.value})}
                    error={null}
                    fullWidth 
                    select        
                    required={true}                     
                  >
                    <MenuItem value="PORT" key="1">Português</MenuItem>
                    <MenuItem value="MAT" key="2">Matemática</MenuItem>
                  </TextField> 
                </div>
                <div className="input-block">            
                  <TextField                                    
                    label="Alternativa A"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.alt_a}
                    onChange={(e) => dispatch({
                      type: 'cgAltA',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth    
                    required={true}                          
                  />  
                </div>  
                <div className="input-block">            
                  <TextField                                    
                    label="Alternativa B"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.alt_b}
                    onChange={(e) => dispatch({
                      type: 'cgAltB',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth    
                    required={true}                          
                  />  
                </div>  
                <div className="input-block">            
                  <TextField                                    
                    label="Alternativa C"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.alt_c}
                    onChange={(e) => dispatch({
                      type: 'cgAltC',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth    
                    required={true}                          
                  />  
                </div>  
                <div className="input-block">            
                  <TextField                                    
                    label="Alternativa D"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.alt_d}
                    onChange={(e) => dispatch({
                      type: 'cgAltD',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth    
                    required={true}                          
                  />  
                </div>  
                <div className="input-block">            
                  <TextField                                    
                    label="Alternativa E"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.alt_e}
                    onChange={(e) => dispatch({
                      type: 'cgAltE',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth    
                    required={true}                          
                  />  
                </div>  
                <div className="input-block">
                  <TextField                                    
                    label="Correta"
                    variant="outlined"
                    type="number"
                    autoComplete="off"
                    value={form.correta}
                    onChange={(e) => dispatch({type: 'cgCorreta', value: e.target.value})}
                    error={null}
                    fullWidth 
                    select   
                    required={true}             
                  >
                    <MenuItem value="A" key="1">A</MenuItem>
                    <MenuItem value="B" key="2">B</MenuItem>
                    <MenuItem value="C" key="3">C</MenuItem>
                    <MenuItem value="D" key="4">D</MenuItem>
                    <MenuItem value="E" key="5">E</MenuItem>
                  </TextField> 
                </div>
                <div className="input-block">
                  <TextField                                    
                    label="Dificuldade"
                    variant="outlined"
                    type="number"
                    autoComplete="off"
                    value={form.dificuldade}
                    onChange={(e) => dispatch({type: 'cgDificuldade', value: e.target.value})}
                    error={null}
                    fullWidth 
                    select    
                    required={true}                         
                  >
                    <MenuItem value="1" key="1">Fácil</MenuItem>
                    <MenuItem value="2" key="2">Média</MenuItem>
                    <MenuItem value="3" key="3">Difícil</MenuItem>
                  </TextField> 
                </div>
                                                                                                          
              </div>                                                  
            </form>
          </div>
        }
    </Modal>     
  );
};

export default FormCadastroQuestao;