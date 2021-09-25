import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';

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
import AdmDrawer from '../../../../components/AdmDrawer';
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

const CourseList = () => {

  const { id } = useParams();
  const [label, setLabel] = useState('PJ');
  const { setSnack } = useContext(SnackContext);
  const history = useHistory();

  useEffect(() => {
    document.title = 'GestFacil | Edição de Fornecedor';
  }, []);


  const initialState = {
    name: '',
    cpfCnpj: '',
    email: '',
    type: 'CNPJ',
  }

  const handleSubmit = async (e, form) => {
    try {
      e.preventDefault();
      await api.put(`/supplier/${id}`, { ...form });      
      dispatch({ type: 'reset' });
      setSnack({ 
        message: 'Fornecedor atualizado com sucesso!', 
        type: 'success', open: true
      });
      history.push('/cli/suppliers');
      
    } catch (err) {
      setSnack({ 
        message: 'Falha ao atualizar o fornecedor, contate o suporte. Erro: ' + err.message, 
        type: 'error', 
        open: true
      });     
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

  useEffect(() => {
    async function getSupplier() {
      try {
        const supplier = await api.get(`/supplier/${id}`);
        dispatch({ type: 'cgName', value: supplier.data.name });
        dispatch({ type: 'cgCpfCnpj', value: supplier.data.cpfCnpj });
        dispatch({ type: 'cgType', value: supplier.data.type });
        dispatch({ type: 'cgEmail', value: supplier.data.email });        
        dispatch({ type: 'cgPhone', value: supplier.data.mainPhone });       
      } catch (err) {
        setSnack({ 
          message: 'Falha ao buscar o fornecedor, contate o suporte. Erro: ' + err.message, 
          type: 'error', 
          open: true
        });
        history.push("/cli/supplier");
      }
    }
    getSupplier();
  }, [id, history, setSnack])

  return (
    <AdmDrawer title="Fornecedor / Edição">
      <BackgroundCard>
        <HeaderTitle
          title="Edição de Fornecedor"
          subtitle="Atenção: mantenha todos os campos obrigatórios (*) preenchidos para a edição."
        />

        <div className="accounting-form-container">
          <form 
            className="accounting-form" 
            method="POST" 
            onSubmit={(e) => handleSubmit(e, form)}>
            <HeaderSubtitle
              title="Dados do Fornecedor"
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
                Atualizar
              </PrimaryButton>
            </div>
          </form>
        </div>
      </BackgroundCard>
    </AdmDrawer>
  );
};

export default CourseList;