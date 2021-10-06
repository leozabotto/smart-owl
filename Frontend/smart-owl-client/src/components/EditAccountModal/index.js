import React, { 
  useContext, 
  useState, 
  useReducer, 
  useEffect
 } from 'react';

import { 
  TextField, 
  CircularProgress,
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


const EditAccountModal = (props) => {

  const { setSnack } = useContext(SnackContext);

  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);
  
  const [category, setCategory] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [customer, setCustomer] = useState(null);
  
  const [dueDate, setDueDate] = useState(null);
  const [compDate, setCompDate] = useState();
   
  const initialState = {   
    accValue: "",
    description: "", 
    lockedSubmit: false, 
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
        return {
          ...initialState,       
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
      formData.append("hasFile", "false");

      if (file !== null) {      
        formData.append("file", file); 
        formData.append("hasFile", "true");
      }

      if(props.type === "+") {
        formData.append("customer", customer.id);     

        acc = await api.put(`/receivable/${props.selectedToEdit.id}`, formData);
        acc.data.customer = { ...customer }   

      } else {  
        formData.append("supplier", supplier.id);

        acc = await api.put(`/payable/${props.selectedToEdit.id}`, formData);
        acc.data.supplier = { ...supplier }
      }    
      
      if (acc.data.fileName === undefined) {
        acc.data.fileName = null;
      }
      
      acc.data.account_category = { ...category};
      
      setSnack({
        message: 'Lançamento atualizado!',
        type: 'success',
        open: true,
      });
      
      dispatch({ type: 'resetForm' });     

      props.setEditedAcc(acc);     
      props.handleUnselectToEdit();      
      props.handleEditModalClose();
      
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

  useEffect(() => {

    async function setAccount() {   
      try {        
        setLoading(true);

        
        let accValue = props.selectedToEdit.value.toString();
        console.log(props.selectedToEdit);
        if (!accValue.includes('.')) {
          accValue += '00';
        } else {  
          if (accValue.split('.')[1].length === 1) {
            accValue += '0';
          }         
        }
      
        dispatch({ type: 'cgAccValue', value: accValue });             
        dispatch({ type: 'cgDescription', value: props.selectedToEdit.description });       

        setCompDate(new Date(props.selectedToEdit.competenceDate).toLocaleDateString('en', { timeZone: 'UTC' }));
        setDueDate(new Date(props.selectedToEdit.dueDate).toLocaleDateString('en', { timeZone: 'UTC' }));       

        if(props.type === '+') {
          setCustomer(props.selectedToEdit.customer);
        } else {
          setSupplier(props.selectedToEdit.supplier);
        }    
        
        setCategory(props.selectedToEdit.account_category);
        
        setLoading(false);
      } catch (err) {
        console.log(err)
        setSnack({ 
          message: 'Ocorreu um erro ao buscar a conta. ' + err, 
          type: 'error', 
          open: true
        });
        setLoading(false);
        props.handleEditModalClose();
      }
    }

    if (props.selectedToEdit !== undefined && props.selectedToEdit !== null) {
      setAccount(); 
    }

  }, [props.selectedToEdit]);

  return (
    <Modal
      open={props.editModal}
      onClose={props.handleEditModalClose}
      title={`Editar Lançamento`}
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
              encType="multipart/form-data">
              <HeaderSubtitle
                title="Informações do Lançamento"
              />
              <div className="file-form-basic" style={{ display: 'flex', flexDirection: 'column', gap: 10}}>
                <div className="input-block">
                  <strong>Você está editando um:</strong> {props.type === '+' ? 'Recebimento' : 'Pagamento'}
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
              </div>     
                           
              <HeaderSubtitle title="Arquivo"/>

              <div className="input-block">
                <PrimaryButton variant="contained" component="span"
                  disabled={props.selectedToEdit !== null ? props.selectedToEdit.fileName === null ? true : false : ''}
                  onClick={() => window.open(`${process.env['REACT_APP_UPLOAD_STORAGE_URL']}/${props.selectedToEdit.fileName}`, '_blank')}
                >
                  Visualizar
                </PrimaryButton>               
              </div>                           
            </form>
          </div>
        }
    </Modal>     
  );
};

export default EditAccountModal;