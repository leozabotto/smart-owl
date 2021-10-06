import React, { useContext, useEffect, useReducer } from 'react';
import { useHistory } from 'react-router';

import { TextField } from '@material-ui/core';
import { FormControlLabel, Switch } from '@material-ui/core';


import BackgroundCard from '../../../../components/BackgroundCard';
import ClientDrawer from '../../../../components/ClientDrawer';
import PrimaryButton from '../../../../components/Button';
import { HeaderTitle, HeaderSubtitle } from '../../../../components/HeaderTitle';
import { SnackContext } from '../../../../contexts/SnackContext';

import api from '../../../../services/api';

import './index.css';

const OperatorsCreate = () => {

  const { setSnack } = useContext(SnackContext);
  const history = useHistory();

  useEffect(() => {
    document.title = 'Cadastro de Operador | GestFacil';
  }, []);

  const initialState = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    permissions: {
      register: false,
      financial: false,
      files: false,
      accountPosting: false,
    }
  }

  const handleSubmit = async (e, form) => {
    try {
      e.preventDefault();
      await api.post('/client_user', { ...form });      
      dispatch({ type: 'reset' });
      setSnack({ 
        message: 'Operador cadastrado com sucesso!', 
        type: 'success', open: true
      });
      history.push('/cli/operators');
      
    } catch (err) {
      setSnack({ 
        message: 'Falha ao cadastrar operador, contate o suporte. Erro: ' + err.message, 
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
      case 'cgLastName':
        return { ...state, lastName: action.value };
      case 'cgEmail':
        return { ...state, email: action.value };
      case 'cgPassword':
        return { ...state, password: action.value };
      case 'cgRegister':
        return { ...state, permissions: {
          ...state.permissions,
          register: action.value 
        }};
      case 'cgFinancial':
        return { ...state, permissions: {
          ...state.permissions,
          financial: action.value 
        }};
      case 'cgFiles':
        return { ...state, permissions: {
          ...state.permissions,
          files: action.value 
        }};
      case 'cgAccountPosting':
        return { ...state, permissions: {
          ...state.permissions,
          accountPosting: action.value 
        }};
      case 'reset':
        return { ...initialState }
      default:
        return state;
    }
  }
  
  const [form, dispatch] = useReducer(reducer, initialState);

  return (
    <ClientDrawer title="Operador / Cadastro">
      <BackgroundCard>
        <HeaderTitle
          title="Cadastro de Operador"
          subtitle="Atenção: preecha todos os campos obrigatórios (*) para o cadastro."
        />

        <div className="accounting-form-container">
          <form 
            className="accounting-form" 
            method="POST" 
            onSubmit={(e) => handleSubmit(e, form)}>
            
            <HeaderSubtitle
              title="Dados do Operador"
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
                  name="lastName"
                  label="Sobrenome"
                  variant="outlined"
                  type="text"
                  autoComplete="off"
                  value={form.lastName}
                  onChange={(e) => dispatch(
                    { type: 'cgLastName', value: e.target.value }
                  )}                  
                  fullWidth
                  required
                />
              </div>
              <div className="input-block">
                <TextField
                  name="email"
                  label="Email"
                  variant="outlined"
                  type="email"
                  autoComplete="off"
                  value={form.email}
                  onChange={(e) => dispatch(
                    { type: 'cgEmail', value: e.target.value }
                  )}                  
                  fullWidth
                  required
                />
              </div>
              <div className="input-block">
                <TextField
                  name="password"
                  label="Senha"
                  variant="outlined"
                  type="password"
                  autoComplete="off"
                  value={form.password}
                  onChange={(e) => dispatch(
                    { type: 'cgPassword', value: e.target.value }
                  )}                  
                  fullWidth
                  required
                />
              </div>       
            </div>
              
              <HeaderSubtitle
                title="Permissões do Operador"
              />

              <div className="input-block">
                <FormControlLabel control={
                <Switch 
                  checked={form.permissions.register}
                  onChange={(e) => dispatch({ type: "cgRegister", value: e.target.checked})}
                />
                } label="Cadastros" />
                <FormControlLabel control={
                <Switch 
                  checked={form.permissions.financial}
                  onChange={(e) => dispatch({ type: "cgFinancial", value: e.target.checked})}
                />} label="Financeiro" />
                <FormControlLabel control={
                <Switch 
                  checked={form.permissions.files}
                  onChange={(e) => dispatch({ type: "cgFiles", value: e.target.checked})}
                />} label="Arquivos" />
                <FormControlLabel control={
                <Switch 
                  checked={form.permissions.accountPosting}
                  onChange={(e) => dispatch({ type: "cgAccountPosting", value: e.target.checked})}
                />} label="Lançamentos" />
              </div>
          
            <div className="accounting-form-button">
              <PrimaryButton size="large" variant="contained" type="submit">
                Cadastrar
              </PrimaryButton>
            </div>
          </form>
        </div>
      </BackgroundCard>
    </ClientDrawer>
  );
};

export default OperatorsCreate;