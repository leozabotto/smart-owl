import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { 
  TextField,
  MenuItem,  
} from '@material-ui/core'

import { DataGrid, ptBR } from '@material-ui/data-grid';

import {  useFormik } from 'formik';

import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import AddIcon from '@material-ui/icons/Add';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import PrintIcon from '@material-ui/icons/PrintOutlined';

import AccountingDrawer from '../../../components/AccountingDrawer';
import BackgroundCard from '../../../components/BackgroundCard';
import PrimaryButton from '../../../components/Button';
import Modal from '../../../components/Modal';
import BackgroundCardHeader from '../../../components/BackgroundCardHeader';
import FutureCalendar from '../../../components/FutureCalendar';
import IconButton from '../../../components/IconButton';
import { HeaderSubtitle } from '../../../components/HeaderTitle';
import { SnackContext } from '../../../contexts/SnackContext';

import api from '../../../services/api';
import './index.css';

const PayableAccList = () => {

  const [files, setFiles] = useState([]);
  const { setSnack } = useContext(SnackContext);    
  const [clients, setClients] = useState([]);

  const [startDueDate, setStartDueDate] = useState(new Date());
  const [finalDueDate, setFinalDueDate] = useState(new Date());

  const [payableTotal, setPayableTotal] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState('');

  const handleModalOpen = () => {
    setOpenModal(true);
  }

  const handleModalClose = () => {
    setOpenModal(false);
  }

  const handleSelect = (id) => {
    setSelected(id);
  }

  const handleUnselect = (id) => {
    setSelected('');
  }

  const handleStatusChange = async (id) => {
    try {
      await api.put(`payable/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      filterForm.handleSubmit();
      setSnack({ message: 'Status alterado com sucesso!', type: 'success', open: true})
    } catch(err) {
       if(!err.response){       
        setSnack({ message: `Encontramos um erro ao alterar o status. Entre em contato com o suporte! 
        ` + err, type: 'error', open: true})
      }
      else {        
        let msg = err.response.data.err;
        setSnack({ message: `${msg}`, type: 'error', open: true });
      }
    }
  }

  const handleDelete = async () => {
    try {

      await api.delete(`/payable/${selected}`);
                 
      setFiles(files.filter((file) => {
        return file.id !== selected
      }));

      handleUnselect();
      handleModalClose();

      setSnack({ 
        message: 'Conta excluída com sucesso!', 
        type: 'success', 
        open: true
      });

    } catch (err) {
      setSnack({ 
        message: 'Ocorreu um erro excluir a conta. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });
    }
  }
  
  
  const columns = [  
    { 
      field: 'actions', 
      headerName: 'Ações', 
      width: 120,
      sortable: false,
      renderCell: (file) => {        
        return (<>
          <IconButton onClick={() => {
            window.open(`${process.env.REACT_APP_API_URL}/uploads/client_payables/${file.value.fileName}`, '_blank');
          }}>
            <VisibilityOutlinedIcon />
          </IconButton>
          <IconButton onClick={() => handleStatusChange(file.value.id)}>
            <CreateOutlinedIcon />
          </IconButton>              
          {/* <IconButton onClick={() => {
            handleSelect(file.value.id)
            handleModalOpen(file.value.id);
          }}>
            <DeleteOutlinedIcon />
          </IconButton>    */}
        </>)
      }
    },
    { 
      field: 'category', 
      headerName: 'Categoria', 
      width: 200,
      sortable: true,
      valueGetter: (params) => {
        if (params.row.clientCategoryId) {
          return params.row.client_category.name;
        } else if (params.row.defaultCategoryId) {
          return params.row.default_category.name;
        } else {
          return ''
        }       
      }
    },
    { 
      field: 'supplier', 
      headerName: 'Fornecedor', 
      width: 200,
      sortable: true,
      valueGetter: (params) => {
        return params.row.supplier.name
      }
    },
    { 
      field: 'formatedStatus', 
      headerName: 'Status', 
      width: 120,
      sortable: true,
      renderCell: ((status) => {        
        return (<>
          <span style={{color: `${
           status.value === 'PENDENTE' ? 'red' : 'blue' }`}}>
             {status.value}      
          </span>     
        </>)
      })
    },
    { 
      field: 'createdAt', 
      headerName: 'Data de Envio', 
      width: 160,
      sortable: true,
    },
    { 
      field: 'dueDate', 
      headerName: 'Data de Vencimento', 
      width: 160,
      sortable: true,
    },   
    { 
      field: 'value', 
      headerName: 'Valor', 
      width: 120,
      sortable: true,
      renderCell: ((value) => {        
        return (<>{value.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</>)
      })
    },
    { 
      field: 'description', 
      headerName: 'Descrição', 
      width: 400,
      sortable: true,
    }    
  ];

  useEffect(() => {
    document.title = 'Contas a Pagar | GestFacil';    
    async function getClients() {
      try {
        const res = await api.get('/client');   
        setClients(res.data.active);      
      } catch (err) {
        if(!err.response){       
          setSnack({ message: `Encontramos um erro carregar as configurações. 
          Entre em contato com o suporte! ` + err, type: 'error', open: true})
        }
        else {        
          let msg = err.response.data.err;
          setSnack({ message: `${msg}`, type: 'error', open: true });
        }
      }
    }
    getClients();
  }, [setClients]);

  const filterForm = useFormik({
    initialValues: {     
      status: 'Todos',
      client: 'Todos',
      startDueDate: '',
      finalDueDate: ''   
    },
    onSubmit: (values) => {
      handleFilter(values);
    }
  });

  const handleFilter = async (values) => {

    let totalSum = 0;

    values.startDueDate = formatDateUS(startDueDate);
    values.finalDueDate = formatDateUS(finalDueDate);

    const response = await api.get("/payable", {
      params: {
        ...values
      }
    });

    response.data.payables.forEach(payable => {
      payable.paymentDate = formatDate(payable.paymentDate)
      payable.dueDate = formatDate(payable.dueDate);
      payable.createdAt = `${formatDate(payable.createdAt)} ${formatHour(payable.createdAt)}`;
      payable.actions = {
        fileName: payable.fileName,
        id: payable.id
      }
      payable.formatedStatus = payable.status;

      totalSum += payable.value;

      return;
    });
    setFiles(response.data.payables);
    const total = totalSum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    setPayableTotal(total);
  }

  const formatDate = (date) => {
    date = new Date(date);
    return date.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
  };

  const formatDateUS = (date) => {
    date = new Date(date);
    return date.toLocaleDateString('en-US');
  };

  const formatHour = (date) => {
    date = new Date(date);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  return (
    <AccountingDrawer title="Contas a Pagar">
      <div className="master-dashboard">
        <BackgroundCard>
          <BackgroundCardHeader title="Contas a Pagar">
            {/* <Link className="buttonLink" to="/cli/new_payable">
              <PrimaryButton variant="contained" size="large">
                <AddIcon />
              </PrimaryButton>
            </Link> */}
            <PrimaryButton variant="contained" size="large" disabled>
                <PrintIcon />
            </PrimaryButton>
          </BackgroundCardHeader>
          <HeaderSubtitle/>

          <div className="filter-form-container">
            <form className="filter-form" onSubmit={filterForm.handleSubmit} id="filter-form">
              <div className="filter-form-basic">
                <div className="input-block">
                  <TextField
                    select
                    name="client"
                    label="Cliente"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={filterForm.values.client}
                    onChange={filterForm.handleChange}                  
                    fullWidth                 
                  >                    
                    <MenuItem key="0" value="Todos">Todos</MenuItem>
                    {Object.keys(clients).map(key => {
                      return (
                        <MenuItem 
                          key={`${clients[key].id}`} 
                          value={`${clients[key].id}`}
                        >
                          {clients[key].tradingName}
                        </MenuItem>
                      )
                    })}
                  </TextField>
                </div>             
                <div className="input-block">
                  <TextField
                    select
                    name="status"
                    label="Status"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={filterForm.values.status}
                    onChange={filterForm.handleChange}                    
                    fullWidth                 
                    >
                    <MenuItem key="1" value="Todos">Todos</MenuItem>
                    <MenuItem key="2" value="PENDENTE">Pendente</MenuItem>
                    <MenuItem key="3" value="AGENDADO">Agendado</MenuItem>
                  </TextField>
                </div>
                <div className="input-block">
                  <FutureCalendar                    
                    name="startDueDate"
                    label="Data de Vencimento Inicial"
                    inputVariant="outlined"                    
                    autoComplete="off"
                    value={startDueDate}
                    onChange={setStartDueDate}           
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <FutureCalendar                    
                    name="finalDueDate"
                    label="Data de Vencimento Final"
                    inputVariant="outlined"                    
                    autoComplete="off"
                    value={finalDueDate}
                    onChange={setFinalDueDate}                
                    fullWidth
                  />
                </div>            
              </div>
              <div className="filter-form-button">
                <PrimaryButton size="large" variant="contained" type="submit">Buscar</PrimaryButton>
              </div>
            </form>
          </div>
          <div style={{ height: '50vh', width: '100%', marginTop: '40px'}}>                    
            <DataGrid 
              rows={files} 
              columns={columns} 
              pageSize={50} 
              localeText={ptBR.props.MuiDataGrid.localeText}              
              disableSelectionOnClick />                                   
          </div>
          <div style={{marginTop: '20px'}}>
            <h4>Total: {payableTotal} </h4> 
          </div>
        </BackgroundCard>
      </div>
      <Modal
        open={openModal}
        onClose={handleModalClose}
        title={`Você deseja realmente excluir esta conta?`}
        actions={
          <>
            <PrimaryButton onClick={() => { handleModalClose(); handleUnselect() }} color="primary">Cancelar</PrimaryButton>
            <PrimaryButton onClick={handleDelete}>Sim</PrimaryButton>
          </>
        }
      >        
        <p>
          <strong>ATENÇÃO: </strong> está ação é <b>permanente</b> e afetará o valor total de contas a pagar.
        </p>
      </Modal>
    </AccountingDrawer>
  );
};

export default PayableAccList;