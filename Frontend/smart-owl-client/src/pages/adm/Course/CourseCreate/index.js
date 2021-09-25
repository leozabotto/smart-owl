import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router';

import { 
  TextField, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio 
} from '@material-ui/core';

import BackgroundCard from '../../../../components/BackgroundCard';
import AdmDrawer from '../../../../components/AdmDrawer';
import PrimaryButton from '../../../../components/Button';
import { HeaderTitle, HeaderSubtitle } from '../../../../components/HeaderTitle';
import { SnackContext } from '../../../../contexts/SnackContext';

import api from '../../../../services/api';

import './index.css';

const CourseCreate = () => {

  const [label, setLabel] = useState('CNPJ');
  const { setSnack } = useContext(SnackContext);
  const history = useHistory();

  useEffect(() => {
    document.title = 'Cadastro de Curso | Smart Owl';
  }, []);

  const initialState = {
    name: '',
    description: '',
    hours: '',
  }

  const handleSubmit = async (e, form) => {
    try {
      e.preventDefault();
      await api.post('/course', { ...form });      
      dispatch({ type: 'reset' });
      setSnack({ 
        message: 'Curso cadastrado com sucesso!', 
        type: 'success', open: true
      });
      history.push('/adm/cursos');
      
    } catch (err) {
      setSnack({ 
        message: 'Falha ao cadastrar o curso, contate o suporte. Erro: ' + err.message, 
        type: 'error', 
        open: true
      });
      return false;
    }
  }

  const reducer = (state, action) => {
    switch(action.type) {
      case 'cgName':
        return { ...state, name: action.value };
      case 'cgDesc':
        return { ...state, description: action.value };
      case 'cgHours':
        return { ...state, hours: action.value };
      case 'reset':
        return { ...initialState }
      default:
        return state;
    }
  }
  
  const [form, dispatch] = useReducer(reducer, initialState);

  return (
    <AdmDrawer title="Curso / Cadastro">
      <BackgroundCard>
        <HeaderTitle
          title="Cadastro de Curso"
          subtitle="Atenção: preecha todos os campos obrigatórios (*) para o cadastro."
        />

        <div className="accounting-form-container">
          <form 
            className="accounting-form" 
            method="POST" 
            onSubmit={(e) => handleSubmit(e, form)}>
            <HeaderSubtitle
              title="Dados do Curso"
            />           

            <div className="accounting-form-admin">
              <div className="input-block">
                <TextField
                  name="name"
                  label="Nome"
                  variant="outlined"
                  type="text"
                  autoComplete="off"
                  value={form.name}
                  onChange={(e) => dispatch(
                    { type: 'cgName', value: e.target.value }
                  )}                  
                  fullWidth
                  required                  
                />
              </div> 
              <div className="input-block">
                <TextField
                  name="description"
                  label="Descrição"
                  variant="outlined"
                  type="text"
                  autoComplete="off"
                  value={form.description}
                  onChange={(e) => dispatch(
                    { type: 'cgDesc', value: e.target.value }
                  )}                  
                  fullWidth   
                  required            
                />
              </div>    
              <div className="input-block">
                <TextField
                  name="hours"
                  label="Carga Horária"
                  variant="outlined"
                  type="text"
                  autoComplete="off"
                  value={form.hours}
                  onChange={(e) => dispatch(
                    { type: 'cgHours', value: e.target.value }
                  )}                                 
                  fullWidth   
                  required           
                />
              </div>   
            </div>
            <div className="accounting-form-button">
              <PrimaryButton size="large" variant="contained" type="submit">
                Cadastrar
              </PrimaryButton>
            </div>
          </form>
        </div>
      </BackgroundCard>
    </AdmDrawer>
  );
};

export default CourseCreate;