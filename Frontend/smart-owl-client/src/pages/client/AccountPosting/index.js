import React, { useContext, useEffect, useState, useReducer } from 'react';
import { useHistory } from 'react-router-dom';

import { 
  TextField, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  CircularProgress 
} from '@material-ui/core';

import BackgroundCard from '../../../components/BackgroundCard';
import ClientDrawer from '../../../components/ClientDrawer';
import PrimaryButton from '../../../components/Button';
import FutureCalendar from '../../../components/FutureCalendar';
import { HeaderTitle, HeaderSubtitle } from '../../../components/HeaderTitle';
import Modal from '../../../components/Modal';
//import InstallmentForm from '../../../components/InstallmentForm';

import { SnackContext } from '../../../contexts/SnackContext';

import CategoriesSelect from '../../../components/CategoriesSelect';
import SuppliersSelect from '../../../components/SuppliersSelect';
import CustomersSelect from '../../../components/CustomersSelect';

import './index.css';
import api from '../../../services/api';

const formatDateUS = (date) => {
  date = new Date(date);
  return date.toLocaleDateString('en-US', {timeZone: 'UTC'});
};

const PayableAccCreate = () => {
  const { setSnack } = useContext(SnackContext);
  const history = useHistory();  

  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [compDate, setCompDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [file, setFile] = useState(null);
  
  
  const initialState = {   
    accValue: "",
    description: "",
    fileName: "Nenhum arquivo selecionado.",
    type: "+",
    lockedSubmit: false,
    openModal: false,
  }

  const reducer = (state, action) => {
    switch(action.type) {      
      case 'cgAccValue':
        let value = action.value;
        value = value + '';
        value = parseInt(value.replace(/[\D]+/g, ''));
        value = value + '';
        value = value.replace(/([0-9]{2})$/g, ",$1");
        if (value.length > 6) {
            value = value.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        }
        if(value === 'NaN') return { ...state, accValue: '' }     
        
        return {
            ...state,
            accValue: value,
          }
      case 'cgDescription': 
        return {
          ...state,
          description: action.value,
        }
      case 'lockSubmit':
        return {
          ...state,
          lockedSubmit: true,
        }
      case 'unlockSubmit':
        return {
          ...state,
          lockedSubmit: false,
        }
      case 'openModal':
        return {
          ...state,
          openModal: true,
        }
      case 'closeModal':
        return {
          ...state,
          openModal: false,
        }
      case 'cgFileName':
        return {
          ...state,
          fileName: action.value
        }
      case 'cgType':
        return {
          ...state,
          type: action.value
        }
      case 'resetForm':
        return {
          ...initialState
        }
      default:
        return { ...state }
    }
  }

  const [form, dispatch] = useReducer(reducer, initialState);

  const handleCategoryChange = (value) => {
    setCategory(value);
  }

  const handleSupplierChange = (value) => {
    setSupplier(value);
  }

  const handleCustomerChange = (value) => {
    setCustomer(value);
  }

  const handleRedirect = () => {
    dispatch({ type: 'closeModal' });
    history.push("/cli/dashboard");
  }

  useEffect(() => {
    document.title = 'Novo Lançamento | GestFacil';
  }, []);

  const validateFields = () => {
    if (form.compDate === null) {
      setSnack({ 
        message: 'Preencha a data de competência!', type: 'error', open: true });
      return false;
    }
    if (form.dueDate === null) {
      setSnack({ 
        message: 'Preencha a data de vencimento!', type: 'error', open: true });
      return false;
    }    
    if (form.fileName === 'Nenhum arquivo selecionado.') {
      setSnack({ 
        message: 'Selecione um arquivo para enviar', type: 'error', open: true });
      return false;
    }
    return true;
  }

 
  const handleSubmit = async (e) => {  
    e.preventDefault();

    if (form.lockedSubmit) {
      setSnack({
        message: 'Aguarde o envio do arquivo!',
        type: 'error',
        open: true
      });
      return;
    }

    const filledFields = validateFields();
    if (!filledFields) {
      return;
    }

    const compDateF = formatDateUS(compDate);
    const dueDateF = formatDateUS(dueDate);

    setLoading(true);

    try {

      dispatch({ type: 'lockSubmit' });


      const formData = new FormData();
      formData.append("category", category.id);
      formData.append("accValue", parseFloat((form.accValue).replace(".","").replace(",",".")));
      formData.append("description", form.description);
      formData.append("compDateF", compDateF);
      formData.append("dueDateF", dueDateF);
      formData.append("file", file); 
      
      if(form.type === "+") {
        formData.append("customer", customer.id);      
        await api.post('/receivable', formData);
      } else {
        formData.append("supplier", supplier.id);
        await api.post('/payable', formData);
      }      
      
      setSnack({
        message: 'Lançamento enviado!',
        type: 'success',
        open: true,
      });

      dispatch({ type: 'resetForm' });
      dispatch({ type: 'openModal' });

      setLoading(false);

    } catch (err) {
      console.log(err);
      console.log(err.stack);
      setSnack({ 
        message: 'Ocorreu um erro ao enviar o lançamento. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });
      console.log(err)
      dispatch({ type: 'closeModal' });      
      setLoading(false);
    }
  }

  return (
    <ClientDrawer title="Novo Lançamento">
      <BackgroundCard>
        <HeaderTitle
          title="Novo Lançamento"
          subtitle="Preencha todos os campos obrigatórios (*)"
          showBackButton
          previousPage="/cli/dashboard"
        />

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
        
          <div className="file-form-container">
            <form 
              className="file-form" 
              onSubmit={handleSubmit} 
              encType="multipart/form-data">
              <HeaderSubtitle
                title="Informações do Lançamento"
              />
              <div className="file-form-basic">
                <div className="input-block">
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Tipo</FormLabel>
                    <RadioGroup row aria-label="tipo" name="type" value={form.type} onChange={(e) => dispatch({
                      type: 'cgType',
                      value: e.target.value
                    })}>
                      <FormControlLabel value="+" control={<Radio />} label="Entrada" />
                      <FormControlLabel value="-" control={<Radio />} label="Saída" />                                   
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className="input-block">
                  <FutureCalendar
                    name="compDate"
                    label="Data de Competência"
                    inputVariant="outlined"
                    autoComplete="off"
                    value={compDate}
                    onChange={setCompDate}
                    fullWidth
                    required
                  />
                </div>

                {form.type === '+' ?
                <CustomersSelect 
                  value={customer}
                  onChange={handleCustomerChange}
                />
                :
                <SuppliersSelect 
                  value={supplier} 
                  onChange={handleSupplierChange} 
                />}
                
                <CategoriesSelect 
                  value={category} 
                  onChange={handleCategoryChange}
                />
                                      
                <div className="input-block">
                  <TextField
                    name="accValue"
                    label="Valor"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.accValue}
                    onChange={(e) => dispatch({ 
                      type: 'cgAccValue', 
                      value: e.target.value
                    })}
                    error={null}
                    fullWidth                 
                    required
                  />             
                </div>

                <div className="input-block">
                  <FutureCalendar
                    name="dueDate"
                    label="Data de Vencimento"
                    inputVariant="outlined"
                    autoComplete="off"
                    value={dueDate}
                    onChange={setDueDate}
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
                    onChange={(e) => dispatch({
                      type: 'cgDescription',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth                 
                  />                 
                </div>
              </div>       

              {/* <InstallmentForm 
                total={form.accValue.replace(".","").replace(",",".")} 
                description={form.description}
              />        */}

              <HeaderSubtitle title="Arquivo"/>

              <div className="input-block">
                <p id="fileName">{form.fileName}</p> <br/>             
                <input                               
                  id="contained-button-file"
                  type="file"
                  name="document"
                  onChange={(e) => {
                    dispatch({ type: 'cgFileName', value: e.currentTarget.value});
                    setFile(e.currentTarget.files[0]);                  
                  }}
                  hidden
                  required
                />
                <label htmlFor="contained-button-file">
                  <PrimaryButton variant="contained" component="span">
                    Selecionar
                  </PrimaryButton>
                </label>
              </div>

              <div className="file-form-button">
                <PrimaryButton size="large" variant="contained" type="submit">
                  Enviar
                </PrimaryButton>
              </div>

            </form>
          </div>
        }
      </BackgroundCard>
      <Modal    
        open={form.openModal}    
        onClose={(e) => dispatch({ type: 'closeModal' })}
        title={`Você deseja fazer outro lançamento?`}
        actions={
          <>
            <PrimaryButton onClick={handleRedirect} color="primary">
              Não
            </PrimaryButton>
            <PrimaryButton onClick={(e) => dispatch({ type: 'resetForm' })}>
              Sim
            </PrimaryButton>
          </>
        }
        >
      </Modal>
    </ClientDrawer>    
  );
};

export default PayableAccCreate;