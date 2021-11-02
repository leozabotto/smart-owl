import React, { 
  useContext, 
  useState, 
  useReducer,
  useEffect
 } from 'react';

import { 
  TextField, 
  CircularProgress,
  MenuItem,
} from '@material-ui/core';

import { FormControlLabel, Switch } from '@material-ui/core';

import SelectUnidades from '../SelectUnidades';
import SelectCursos from '../SelectCursos';

import PrimaryButton from '../Button';
import Modal from '../Modal';

import { HeaderSubtitle } from '../HeaderTitle';
import { SnackContext } from '../../contexts/SnackContext';

import './index.css';
import api from '../../services/api';


const FormEdicaoTurmas = (props) => {

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
    nome: "",
    modalidade: "Online",
    qtd_vagas: 0,
    status: "Aberta",
    idade_min: 0,
    idade_max: 0,
    periodo: "Manhã"
  }

  const reducer = (state, action) => {
    switch(action.type) {            
      case 'cgNome': 
        return {
          ...state,
          nome: action.value,
        }
      case 'cgModalidade': 
        return {
          ...state,
          modalidade: action.value,
        }
      case 'cgQtdVagas': 
        return {
          ...state,
          qtd_vagas: action.value,
        }
      case 'cgStatus': 
        return {
          ...state,
          status: action.value,
        }      
      case 'cgPeriodo': 
        return {
          ...state,
          periodo: action.value,
        }     
      case 'cgInicio': 
        return {
          ...state,
          hora_inicio: action.value,
        }     
      case 'cgTermino': 
        return {
          ...state,
          hora_termino: action.value,
        } 
      case 'cgPcd': 
        return {
          ...state,
          pcd: action.value,
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

      form.unidadeId = unidade.id;
      form.cursoId = curso.id;

      const turma = await api.put(`/turma/${props.turmaParaEditar.id}`, { ...form })
      
      setSnack({
        message: 'Turma atualizada!',
        type: 'success',
        open: true,
      });
      
      dispatch({ type: 'resetForm' });  

      turma.data.curso = curso;
      turma.data.unidade = unidade;
         
      props.setTurmaEditada(turma);
      props.handleEditModalClose();           
      
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

  useEffect(() => {

    async function setTurma() {   
      try {        
        setLoading(true);
                      
        dispatch({ type: 'cgNome', value: props.turmaParaEditar.nome });             
        dispatch({ type: 'cgModalidade', value: props.turmaParaEditar.modalidade });             
        dispatch({ type: 'cgQtdVagas', value: props.turmaParaEditar.qtd_vagas });                         
        dispatch({ type: 'cgPeriodo', value: props.turmaParaEditar.periodo });                         
        dispatch({ type: 'cgInicio', value: props.turmaParaEditar.hora_inicio });                         
        dispatch({ type: 'cgTermino', value: props.turmaParaEditar.hora_termino });                                                     
        dispatch({ type: 'cgPcd', value: props.turmaParaEditar.pcd });

        setUnidade(props.turmaParaEditar.unidade);
        setCurso(props.turmaParaEditar.curso);

        setLoading(false);
      } catch (err) {
        console.log(err)
        setSnack({ 
          message: 'Ocorreu um erro ao buscar a turma. ' + err, 
          type: 'error', 
          open: true
        });
        setLoading(false);
        props.handleEditModalClose();
      }
    }    
    
    if (props.turmaParaEditar !== undefined && props.turmaParaEditar !== null) {
      setTurma();
      setSnack({
        message: 'Editar uma turma afetará todas as inscrições já existentes vinculadas a ela. Tome cuidado!',
        type: 'warning',
        open: true
      }); 
    }

  }, [props.turmaParaEditar]);


  return (
    <Modal
      open={props.editModal}
      onClose={props.handleEditModalClose}
      title={`Nova Turma`}
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
                title="Informações da Turma"
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
                    required={true}                          
                  />  
                </div>
                <div className="input-block">
                  <SelectCursos 
                    value={curso}
                    onChange={handleCursoChange}
                    ativo={"1"}
                    disabled={true}
                  />
                </div>
                <div className="input-block">
                  <SelectUnidades 
                    value={unidade}
                    onChange={handleUnidadeChange}
                    ativo={"1"}
                    disabled={true}
                  />
                </div>
                <div className="input-block"> 
                  <TextField                                    
                    label="Modalidade"
                    variant="outlined"
                    select
                    autoComplete="off"
                    value={form.modalidade}
                    onChange={(e) => dispatch({
                      type: 'cgModalidade',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth     
                    required={true}   
                    disabled={true}                               
                  >
                    <MenuItem value={"Online"} key={1}>Online</MenuItem>
                    <MenuItem value={"Presencial"} key={2}>Presencial</MenuItem>
                    <MenuItem value={"Semipresencial"} key={3}>Semipresencial</MenuItem>
                  </TextField>  
                </div>
                <div className="input-block"> 
                  <TextField                                    
                    label="Período"
                    variant="outlined"
                    select
                    autoComplete="off"
                    value={form.periodo}
                    onChange={(e) => dispatch({
                      type: 'cgPeriodo',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth   
                    required={true}
                    disabled={true}                          
                  >
                    <MenuItem value={"Manhã"} key={1}>Manhã</MenuItem>
                    <MenuItem value={"Tarde"} key={2}>Tarde</MenuItem>
                    <MenuItem value={"Noite"} key={3}>Noite</MenuItem>
                  </TextField>  
                </div>
                <div className="input-block"> 
                  <TextField                                    
                    label="Hora de Início"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.hora_inicio}
                    onChange={(e) => dispatch({
                      type: 'cgInicio',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth 
                    required={true}                             
                  />    
                </div>                                                                    
                <div className="input-block"> 
                  <TextField                                    
                    label="Hora de Término"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.hora_termino}
                    onChange={(e) => dispatch({
                      type: 'cgTermino',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth    
                    required={true}             
                  />    
                </div>                                                                    
                <div className="input-block"> 
                  <TextField                                    
                    label="Qtd. Vagas"
                    variant="outlined"
                    type="number"
                    autoComplete="off"
                    value={form.qtd_vagas}
                    onChange={(e) => dispatch({
                      type: 'cgQtdVagas',
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
                    checked={form.pcd}
                    onChange={(e) => dispatch({ type: "cgPcd", value: e.target.checked})}
                  />
                } label="PCD" /></div>                                                                    
              </div>                                                  
            </form>
          </div>
        }
    </Modal>     
  );
};

export default FormEdicaoTurmas;