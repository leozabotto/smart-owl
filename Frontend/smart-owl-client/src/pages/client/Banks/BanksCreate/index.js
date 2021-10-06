import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router';

import { TextField, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import MaskedInput from 'react-text-mask';

import BackgroundCard from '../../../../components/BackgroundCard';
import ClientDrawer from '../../../../components/ClientDrawer';
import PrimaryButton from '../../../../components/Button';
import { HeaderTitle, HeaderSubtitle } from '../../../../components/HeaderTitle';
import { SnackContext } from '../../../../contexts/SnackContext';
import FutureCalendar from '../../../../components/FutureCalendar';

import api from '../../../../services/api';

import './index.css';
import BanksSelect from '../../../../components/BanksSelect';

const formatDateUS = (date) => {
  date = new Date(date);
  return date.toLocaleDateString('en-US', {timeZone: 'UTC'});
};

const CustomersCreate = () => {

  const [bank, setBank] = useState(null);
  const [initialDate, setInitialDate] = useState(null);
  const { setSnack } = useContext(SnackContext);
  const history = useHistory();

  useEffect(() => {
    document.title = 'Cadastro de Conta Bancária | GestFacil';
  }, []);

  const initialState = {
    name: '',
    ag: '',
    acc: '',
    dig: '',
    initialDate: '',
    initialBalance:''
  }

  const handleSubmit = async (e, form) => {
    try {
      e.preventDefault();

      form.bankId = bank.id;
      form.initialBalance = parseFloat((form.initialBalance).replace(".","").replace(",","."));
      form.initialDate = formatDateUS(initialDate);

      if (form.initialDate === null) {
        setSnack({ 
          message: 'Preencha a data do saldo!', type: 'error', open: true });
        return false;
      }    

      await api.post('/client_bank', { ...form });      
      dispatch({ type: 'reset' });
      setSnack({ 
        message: 'Conta bancária cadastrada com sucesso!', 
        type: 'success', open: true
      });
      history.push('/cli/banks');
      
    } catch (err) {
      setSnack({ 
        message: 'Falha ao cadastrar a conta bancária, contate o suporte. Erro: ' + err.message, 
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
      case 'cgAg':
        return { ...state, ag: action.value };
      case 'cgAcc':
        return { ...state, acc: action.value };
      case 'cgDig':
        return { ...state, dig: action.value };
      case 'cgBalance':
        let value = action.value;
        value = value + '';
        value = parseInt(value.replace(/[\D]+/g, ''));
        value = value + '';
        value = value.replace(/([0-9]{2})$/g, ",$1");
        if (value.length > 6) {
            value = value.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        }
        if(value === 'NaN') return { ...state, initialBalance: '' }
        return { ...state, initialBalance: value };
      case 'cgDate':
        return { ...state, initialDate: action.value };
      case 'reset':
        return { ...initialState }
      default:
        return state;
    }
  }
  
  const [form, dispatch] = useReducer(reducer, initialState);

  return (
    <ClientDrawer title="Conta Bancária / Cadastro">
      <BackgroundCard>
        <HeaderTitle
          title="Cadastro de Conta Bancária"
          subtitle="Atenção: preecha todos os campos obrigatórios (*) para o cadastro."
        />

        <div className="accounting-form-container">
          <form 
            className="accounting-form" 
            method="POST" 
            onSubmit={(e) => handleSubmit(e, form)}>
            <HeaderSubtitle
              title="Dados da Conta"
            />           

            <div className="accounting-form-admin">
              <div className="input-block">
                <TextField
                  name="name"
                  label="Apelido"
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
                <BanksSelect 
                  onChange={(value) => setBank(value)} 
                  value={bank}
                />
              </div>
              <div className="input-block">
                <TextField
                  name="ag"
                  label="Agência"
                  variant="outlined"
                  type="text"
                  autoComplete="off"
                  value={form.ag}
                  onChange={(e) => dispatch(
                    { type: 'cgAg', value: e.target.value }
                  )}                  
                  fullWidth  
                  required              
                />
              </div>
              <div className="input-block">
                <TextField
                  name="acc"
                  label="Conta"
                  variant="outlined"
                  type="text"
                  autoComplete="off"
                  value={form.acc}
                  onChange={(e) => dispatch(
                    { type: 'cgAcc', value: e.target.value }
                  )}                  
                  fullWidth 
                  required               
                />
              </div>
              <div className="input-block">
                <TextField
                  name="dig"
                  label="Dígito"
                  variant="outlined"
                  type="text"
                  autoComplete="off"
                  value={form.dig}
                  onChange={(e) => dispatch(
                    { type: 'cgDig', value: e.target.value }
                  )}                  
                  fullWidth 
                  required               
                />
              </div>
              <div className="input-block">
                <TextField
                  name="initialBalance"
                  label="Saldo Inicial"
                  variant="outlined"
                  type="text"
                  autoComplete="off"
                  value={form.initialBalance}
                  onChange={(e) => dispatch(
                    { type: 'cgBalance', value: e.target.value }
                  )}                  
                  fullWidth 
                  required               
                />
              </div>
              <div className="input-block">
                <FutureCalendar 
                  name="initialDate"
                  label="Data do Saldo"
                  inputVariant="outlined"
                  autoComplete="off"
                  value={initialDate}
                  onChange={setInitialDate}
                  fullWidth
                  required
                />
              </div>
              <div className="input-block">
                
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