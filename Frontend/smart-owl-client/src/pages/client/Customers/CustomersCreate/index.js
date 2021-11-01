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
import MaskedInput from 'react-text-mask';

import BackgroundCard from '../../../../components/BackgroundCard';
import ClientDrawer from '../../../../components/ClientDrawer';
import PrimaryButton from '../../../../components/Button';
import { HeaderTitle, HeaderSubtitle } from '../../../../components/HeaderTitle';
import { SnackContext } from '../../../../contexts/SnackContext';

import api from '../../../../services/api';

import './index.css';

const TelephoneMask = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      guide={false}
    />
  );
}

const CustomersCreate = () => {

  const [label, setLabel] = useState('CNPJ');
  const { setSnack } = useContext(SnackContext);
  const history = useHistory();

  useEffect(() => {
    document.title = 'Cadastro de Cliente | GestFacil';
  }, []);

  const initialState = {
    name: '',
    cpfCnpj: '',
    email: '',
    type: 'PJ',
  }

  const handleSubmit = async (e, form) => {
    try {
      e.preventDefault();
      await api.post('/customer', { ...form });      
      dispatch({ type: 'reset' });
      setSnack({ 
        message: 'Cliente cadastrado com sucesso!', 
        type: 'success', open: true
      });
      history.push('/cli/customers');
      
    } catch (err) {
      setSnack({ 
        message: 'Falha ao cadastrar o cliente, contate o suporte. Erro: ' + err.message, 
        type: 'error', 
        open: true
      });
      return false;
    }
  }

  const reducer = (state, action) => {
    switch(action.type) {
      case 'cgType': 
        const type = action.value === 'PJ' ? 'CNPJ' : 'CPF'
        setLabel(type);
        return { ...state, type: action.value }
      case 'cgName':
        return { ...state, name: action.value };
      case 'cgCpfCnpj':
        return { ...state, cpfCnpj: action.value };
      case 'cgEmail':
        return { ...state, email: action.value };
      case 'cgPhone':
        return { ...state, mainPhone: action.value };
      case 'reset':
        return { ...initialState }
      default:
        return state;
    }
  }
  
  const [form, dispatch] = useReducer(reducer, initialState);

  return (
    <ClientDrawer title="Cliente / Cadastro">
      <BackgroundCard>
        <HeaderTitle
          title="Cadastro de Cliente"
          subtitle="Atenção: preecha todos os campos obrigatórios (*) para o cadastro."
        />

        <div className="accounting-form-container">
          <form 
            className="accounting-form" 
            method="POST" 
            onSubmit={(e) => handleSubmit(e, form)}>
            <HeaderSubtitle
              title="Dados do Cliente"
            />           

            <div className="accounting-form-admin">
              <div className="input-block">
                <FormControl component="fieldset">
                  <FormLabel component="legend">Tipo</FormLabel>
                  <RadioGroup row aria-label="tipo" name="type" value={form.type} onChange={(e) => dispatch({
                    type: 'cgType',
                    value: e.target.value
                  })}>
                    <FormControlLabel value="PF" control={<Radio />} label="Pessoa Física" />
                    <FormControlLabel value="PJ" control={<Radio />} label="Pessoa Jurídica" />                                   
                  </RadioGroup>
                </FormControl>
              </div>
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
                  name="cpfCnpj"
                  label={label}
                  variant="outlined"
                  type="text"
                  autoComplete="off"
                  value={form.cpfCnpj}
                  onChange={(e) => dispatch(
                    { type: 'cgCpfCnpj', value: e.target.value }
                  )}                  
                  fullWidth                
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
                />
              </div>    
              <div className="input-block">
                <TextField
                  name="mainPhone"
                  label="Telefone"
                  variant="outlined"
                  type="text"
                  autoComplete="off"
                  value={form.mainPhone}
                  onChange={(e) => dispatch(
                    { type: 'cgPhone', value: e.target.value }
                  )}       
                  InputProps={{
                    inputComponent: TelephoneMask,
                  }}           
                  fullWidth              
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
    </ClientDrawer>
  );
};

export default CustomersCreate;