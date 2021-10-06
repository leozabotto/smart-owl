import React, { 
  useContext, 
  useState, 
  useReducer 
 } from 'react';

import { 
  TextField, 
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@material-ui/core';

import moment from 'moment';

import PrimaryButton from '../Button';
import FutureCalendar from '../FutureCalendar';
import Modal from '../Modal';

import CategoriesSelect from '../CategoriesSelect';
import SuppliersSelect from '../SuppliersSelect';
import CustomersSelect from '../CustomersSelect';

import { HeaderSubtitle } from '../HeaderTitle';
import { SnackContext } from '../../contexts/SnackContext';

import './index.css';
import api from '../../services/api';


const CreateAccountModal = (props) => {

  const { setSnack } = useContext(SnackContext);

  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);
  
  const [category, setCategory] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [customer, setCustomer] = useState(null);
  
  const [dueDate, setDueDate] = useState(null);
  const [compDate, setCompDate] = useState(new Date());
  
  const initialState = {   
    accValue: "",
    description: "",
    fileName: "Nenhum arquivo selecionado.",    
    lockedSubmit: false, 
    keepPosting: false,
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
      case 'cgFileName':
        return {
          ...state,
          fileName: action.value
        }     
      case 'resetForm':
        let keepPosting = state.keepPosting;
        return {
          ...initialState,
          keepPosting,
        }
      case 'cgKeepPosting':
        return {
          ...state,
          keepPosting: action.value
        }
      default:
        return { ...state }
    }
  }
  
  const [form, dispatch] = useReducer(reducer, initialState);

  const validateFields = () => {
    if (compDate === null) {
      setSnack({ 
        message: 'Preencha a data de competência!', type: 'error', open: true });
      return false;
    }
    if (dueDate === null) {
      setSnack({ 
        message: 'Preencha a data de vencimento!', type: 'error', open: true });
      return false;
    }   
    if (form.accValue === "") {
      setSnack({ 
        message: 'Preencha o valor da conta!', type: 'error', open: true });
      return false;
    }   
    if (supplier === null && props.type === '-') {
      setSnack({ 
        message: 'Selecione o fornecedor!', type: 'error', open: true });
      return false;
    }  
    if (customer === null && props.type === '+') {
      setSnack({ 
        message: 'Selecione o cliente!', type: 'error', open: true });
      return false;
    }  
    if (category === null) {
      setSnack({ 
        message: 'Selecione a categoria!', type: 'error', open: true });
      return false;
    }   
    return true;
  }

  const handleCategoryChange = (value) => {
    setCategory(value);
  }

  const handleSupplierChange = (value) => {
    setSupplier(value);
  }

  const handleCustomerChange = (value) => {
    setCustomer(value);
  }
 
  const handleSubmit = async () => {  

   if (form.lockedSubmit) {
      setSnack({
        message: 'Aguarde o envio da conta!',
        type: 'error',
        open: true
      });
      return;
    }

    const filledFields = validateFields();
    if (!filledFields) return;

    const compDateF = moment(compDate).format('YYYY-MM-DD');
    const dueDateF = moment(dueDate).format('YYYY-MM-DD');
    
    let acc = {};

    setLoading(true);

    try {
      dispatch({ type: 'lockSubmit' });

      const formData = new FormData();
      formData.append("category", category.id);
      formData.append("accValue", parseFloat((form.accValue).replace(".","").replace(",",".")));
      formData.append("description", form.description);
      formData.append("compDateF", compDateF);
      formData.append("dueDateF", dueDateF);
      formData.append("hasFile", file !== null ? true : false);

      if (file !== null) {      
        formData.append("file", file); 
        console.log('aqui')        
      }

      if(props.type === "+") {
        formData.append("customer", customer.id);     

        acc = await api.post('/receivable', formData);
        acc.data.customer = { ...customer }   

      } else {  
        formData.append("supplier", supplier.id);

        acc = await api.post('/payable', formData);
        acc.data.supplier = {  ...supplier }
      }    
      
      if (acc.data.fileName === undefined) {
        acc.data.fileName = null;
      }
      
      acc.data.account_category = { ...category };
      
      setSnack({
        message: 'Lançamento enviado!',
        type: 'success',
        open: true,
      });
      
      dispatch({ type: 'resetForm' });     
      props.setCreatedAcc(acc);
      
      if (form.keepPosting === false) {
        props.handleCreateModalClose();
      }
      
      setLoading(false);

    } catch (err) {   
      setSnack({ 
        message: 'Ocorreu um erro ao enviar o lançamento. Caso persista, contate o suporte! ' + err, 
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
      title={`Novo Lançamento`}
      actions={
        <>        
          <PrimaryButton onClick={props.handleCreateModalClose}>CANCELAR</PrimaryButton>
          <PrimaryButton onClick={() => handleSubmit()}>ENVIAR</PrimaryButton>
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
              encType="multipart/form-data">
              <HeaderSubtitle
                title="Informações do Lançamento"
              />
              <div className="file-form-basic" style={{ display: 'flex', flexDirection: 'column', gap: 10}}>
                <div className="input-block">
                  <strong>Você está cadastrando um:</strong> {props.type === '+' ? 'Recebimento' : 'Pagamento'}
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
                  />
                </div>

                {props.type === '+' ?
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
                    required={true}
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

                {
                  props.allowKeepPosting
                  ?
                  <div className="input-block">
                    <FormControlLabel control={
                      <Switch 
                        checked={form.keepPosting}
                        onChange={(e) => dispatch({ type: "cgKeepPosting", value: e.target.checked})}
                      />} 
                      label="Continuar lançando" 
                    />
                  </div>
                  : ''
                }
                
              </div>       
           
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
            </form>
          </div>
        }
    </Modal>     
  );
};

export default CreateAccountModal;