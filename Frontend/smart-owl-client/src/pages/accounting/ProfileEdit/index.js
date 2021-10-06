import React, { useContext, useEffect, useReducer } from 'react';

import { 
  TextField, 
} from '@material-ui/core';

import BackgroundCard from '../../../components/BackgroundCard';
import ClientDrawer from '../../../components/ClientDrawer';
import PrimaryButton from '../../../components/Button';
import { HeaderTitle, HeaderSubtitle } from '../../../components/HeaderTitle';

import { SnackContext } from '../../../contexts/SnackContext';
import { AuthContext } from '../../../contexts/AuthContext';

import api from '../../../services/api';

import './index.css';

const ProfileEdit = () => {

  const { setSnack } = useContext(SnackContext);

  const { user, } = useContext(AuthContext);

  useEffect(() => {
    document.title = 'Meu Perfil | GestFacil';
  }, []);

  const initialState = {
    name: user.name,
    lastName: user.lastName,
    email: user.email,
  }

  const initialState2 = {
    password: '',
    passwordConf: '',
  }

  const handleProfile = async (e, form) => {
    try {
      e.preventDefault();
      await api.patch('/accounting_user/profile', { ...form });       
      const updatedUser = JSON.stringify(form)
      localStorage.setItem('user', updatedUser);
      setSnack({ 
        message: 'Dados básicos atualizados com sucesso! A página será recarregada...', 
        type: 'success', open: true
      });
      setTimeout(() => {
        return window.location.reload()
      }, 3000);
      
    } catch (err) {
      setSnack({ 
        message: 'Falha ao atualizar os dados, contate o suporte. Erro: ' + err.message, 
        type: 'error', 
        open: true
      });
      return false;
    }
  }

  const handlePassword = async (e, form2) => {
    try {
      e.preventDefault();
     
      if (form2.password !== form2.passwordConf) {
        setSnack({ 
          message: 'As senhas não conferem!', 
          type: 'error', 
          open: true
        });
        return;
      }

      await api.patch('/accounting_user/password', { ...form2 });  
      
      setSnack({ 
        message: 'Senha alterada com sucesso!', 
        type: 'success', open: true
      });
      setTimeout(() => {
        return window.location.reload()
      }, 3000);
      
    } catch (err) {
      setSnack({ 
        message: 'Falha ao atualizar a senha, contate o suporte. Erro: ' + err.message, 
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
      case 'reset':
        return { ...initialState }
      default:
        return state;
    }
  }

  const reducer2 = (state, action) => {
    switch(action.type) {
      case 'cgPassword':
        return { ...state, password: action.value };
      case 'cgPasswordConf':
        return { ...state, passwordConf: action.value };
      case 'reset':
        return { ...initialState2 }
      default:
        return state;
    }
  }
  
  const [form, dispatch] = useReducer(reducer, initialState);
  const [form2, dispatch2] = useReducer(reducer2, initialState2);

  return (
    <ClientDrawer title="Meu Perfil">
      <BackgroundCard>
        
        <HeaderTitle
          title="Meu Perfil"
          showBackButton
          previousPage="/cli/dashboard"
        />

        <div className="accounting-form-container">
          <form 
            className="accounting-form" 
            method="POST" 
            onSubmit={(e) => handleProfile(e, form)}
          >
            <HeaderSubtitle
              title="Dados Básicos"
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
                  name="name"
                  label="Nome"
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
                  label="E-mail"
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
                <PrimaryButton size="large" variant="contained" type="submit">
                  Salvar
                </PrimaryButton>
              </div>          
            </div>
          </form>
            
          
          <form 
            className="accounting-form" 
            method="POST" 
            onSubmit={(e) => handlePassword(e, form2)}
          >
            <HeaderSubtitle
              title="Senha de Acesso"
            />           

            <div className="accounting-form-admin">          
              <div className="input-block">
                <TextField
                  name="password"
                  label="Senha"
                  variant="outlined"
                  type="password"
                  autoComplete="off"
                  value={form2.password}
                  onChange={(e) => dispatch2(
                    { type: 'cgPassword', value: e.target.value }
                  )}                  
                  fullWidth  
                  required                               
                />
              </div> 
              <div className="input-block">
                <TextField
                  name="passwordConf"
                  label="Confirmação da Senha"
                  variant="outlined"
                  type="password"
                  autoComplete="off"
                  value={form2.passwordConf}
                  onChange={(e) => dispatch2(
                    { type: 'cgPasswordConf', value: e.target.value }
                  )}                  
                  fullWidth   
                  required                              
                />
              </div> 
              <div className="input-block">
                <PrimaryButton size="large" variant="contained" type="submit">
                  Alterar Senha
                </PrimaryButton>                      
              </div>
            </div>            
          </form>
        </div>
      </BackgroundCard>
    </ClientDrawer>
  );
};

export default ProfileEdit;