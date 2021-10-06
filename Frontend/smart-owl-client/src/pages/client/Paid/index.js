import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';

import { 
  CircularProgress  
} from '@material-ui/core'

import { DataGrid, ptBR } from '@material-ui/data-grid';

import { useFormik } from 'formik';

import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import AddIcon from '@material-ui/icons/Add';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'

import ClientDrawer from '../../../components/ClientDrawer';
import BackgroundCard from '../../../components/BackgroundCard';
import PrimaryButton from '../../../components/Button';
import SuppliersSelect from '../../../components/SuppliersSelect';
import Modal from '../../../components/Modal';
import BackgroundCardHeader from '../../../components/BackgroundCardHeader';
import FutureCalendar from '../../../components/FutureCalendar';
import IconButton from '../../../components/IconButton'

import CreateAccountModal from '../../../components/CreateAccountModal';

import { HeaderSubtitle } from '../../../components/HeaderTitle';
import { SnackContext } from '../../../contexts/SnackContext';


import download from 'downloadjs'
import api from '../../../services/api';

import './index.css';
import EditAccountModal from '../../../components/EditAccountModal';

const firstDayOfMonth = moment().startOf('month').add(1, 'days').format('YYYY-MM-DD');
const lastDayOfMonth = moment().endOf('month').add(1, 'days').format('YYYY-MM-DD');

const Paid = () => {

  const { setSnack } = useContext(SnackContext);    

  const [accounts, setAccounts] = useState([]);

  const [startDueDate, setStartDueDate] = useState(new Date(firstDayOfMonth).toLocaleString('en',{ timezone: 'UTC'}));
  const [finalDueDate, setFinalDueDate] = useState(new Date(lastDayOfMonth).toLocaleString('en',{ timezone: 'UTC'}));
  
  const [payableTotalStr, setPayableTotalStr] = useState("");  
  const [payableTotal, setPayableTotal] = useState(0);  
  
  const [selectedToDelete, setSelectedToDelete] = useState(null);
  const [selectedToEdit, setSelectedToEdit] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedAcc, setEditedAcc] = useState({});

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [createdAcc, setCreatedAcc] = useState({});
  const [loading, setLoading] = useState(false);
  const [processingReport, setProcessingReport] = useState(false); 
  
  const [supplier, setSupplier] = useState(null);
  const handleSupplierChange = (value) => {
    setSupplier(value);
  }

  const handleReport = async  () => {
    
    setProcessingReport(true);
    try {
      const pdf = await api.get('/report/payable', {
        params: {
          startDueDate: moment(startDueDate).format("YYYY-MM-DD"),
          finalDueDate: moment(finalDueDate).format("YYYY-MM-DD")
        }, resType: 'blob'        
      });
      setProcessingReport(false);
      download(pdf.data, 'GestFacil - Contas Pagas.pdf');
      
    } catch (err) {
      setProcessingReport(false);
      setSnack({ 
        message: 'Ocorreu um erro ao gerar o relatório. Caso persista, contate o suporte! ' + err.message, 
        type: 'error', 
        open: true
      });
    }
  }

  const handleDeleteModalOpen = () => {
    setOpenDeleteModal(true);
  }

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
  }

  const handleCreateModalOpen = () => {
    setOpenCreateModal(true);
  }

  const handleCreateModalClose = () => {
    setOpenCreateModal(false);
  }

  const handleEditModalOpen = () => {
    setOpenEditModal(true);
  }

  const handleEditModalClose = () => {
    setOpenEditModal(false);
  }

  const handleSelectToDelete = (id) => {
    setSelectedToDelete(id);
  }

  const handleUnselectToDelete = (id) => {
    setSelectedToDelete('');
  }   
  
  const handleSelectToEdit = (account) => {
    setSelectedToEdit(account); 
    handleEditModalOpen(); 
  }

  const handleUnselectToEdit = () => {
    setSelectedToEdit(null);
  } 

  const filterForm = useFormik({
    initialValues: {     
      status: 'Todos',     
    },
    onSubmit: (values) => {
      handleFilter(values);
    }
  });

  const handleFilter = async (values) => {
    try {

      if (!moment(startDueDate).isValid() || !moment(finalDueDate).isValid()) {
        setSnack({
          message: 'Insira datas válidas!', 
          type: 'error', 
          open: true
        });
        setLoading(false);
        return;
      }

      if (!moment(finalDueDate).isSameOrAfter(moment(startDueDate))) {
        setSnack({
          message: 'A data final tem que ser maior que a inicial!', 
          type: 'error', 
          open: true
        });
        setLoading(false);
        return;
      }

      setLoading(true);
     
      let totalSum = 0;
  
      values.status = "PAGO";
      values.startDueDate = moment(startDueDate).format("YYYY-MM-DD");
      values.finalDueDate = moment(finalDueDate).format("YYYY-MM-DD");
      
      if (supplier !== null) {
        values.supplier = supplier.id;
      }

      const res = await api.get("/payable", {
        params: {
          ...values
        }
      });
  
      res.data.payables.forEach(payable => {
        payable.dueDateF = moment(payable.dueDate).format("DD/MM/YYYY");
        payable.createdAt = `${moment(payable.createdAt).format("DD/MM/YYYY HH:mm")}`;
        payable.actions = {
          id: payable.id,
          fileName: payable.fileName
        }

        totalSum += payable.value;
        return;
      });
      
      setAccounts(res.data.payables);
      setPayableTotal(totalSum);
      setLoading(false);

    } catch (err) {
      setLoading(false);
      setSnack({
        message: 'Ocorreu um erro ao buscar as contas.' + err.message, 
        type: 'error', 
        open: true
      });
    }
  } 

  const handleDelete = async () => {
    try {
      setLoading(true);

      const deleted = await api.delete(`/payable/${selectedToDelete }`);

      setPayableTotal(payableTotal - deleted.data.value);
                 
      setAccounts(accounts.filter(account => account.id !== selectedToDelete ));

     handleUnselectToDelete();
      handleDeleteModalClose();

      setSnack({ 
        message: 'Conta excluída com sucesso!', 
        type: 'success', 
        open: true
      });

      setLoading(false);
    } catch (err) {
      setLoading(false);
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
      width: 220,
      sortable: false,
      renderCell: (account) => {                      
        return (<>
          <IconButton 
            title={"Visualizar Arquivo"}
            disabled={account.value.fileName === null ? true : false}
            onClick={() => {
            window.open(`${process.env['REACT_APP_UPLOAD_STORAGE_URL']}/${account.value.fileName}`, '_blank');          
          }}>
            <VisibilityOutlinedIcon />
          </IconButton>   
          {/*<IconButton 
           title={"Editar Conta"}
            onClick={() => {        
              handleSelectToEdit(account.row);        
            }
          }>
            <CreateOutlinedIcon />
        </IconButton>            
          <IconButton 
            title={"Excluir Conta"}
            onClick={() => {
              handleSelectToDelete(account.value.id);
              handleDeleteModalOpen(account.value.id);
            }
          }>
            <DeleteOutlinedIcon />
          </IconButton>*/}          
        </>);
      }
    },
    { 
      field: 'category', 
      headerName: 'Categoria', 
      width: 200,
      sortable: true,
      valueGetter: (params) => {
        if(params.row.account_category) {
          return params.row.account_category.name
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
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      sortable: true,
      renderCell: ((account) => {        
        return (<>
          <span style={{color: 'green'}}>
             {account.row.status}      
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
      field: 'dueDateF', 
      headerName: 'Data de Vencimento', 
      width: 160,
      sortable: true,
    },   
    { 
      field: 'value', 
      headerName: 'Valor', 
      width: 120,
      sortable: true,
      renderCell: ((payable) => {        
        return (<>{payable.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</>)
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
    document.title = 'Contas Pagas | GestFacil';      
    filterForm.submitForm();
  }, []);

  useEffect(() => {
    setPayableTotalStr(payableTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
  }, [payableTotal])

  useEffect(() => {
    if(Object.keys(createdAcc).length !== 0) {
      let payable = {...createdAcc.data };

      let total = parseFloat(payableTotal) + parseFloat(payable.value);
      setPayableTotal(total);

      payable.paymentDate = moment(payable.paymentDate).format("DD/MM/YYYY");
      payable.dueDateF = moment(payable.dueDate).format("DD/MM/YYYY");
      payable.createdAt = `${moment(payable.createdAt).format("DD/MM/YYYY HH:mm")}`;
      payable.value = parseFloat(payable.value)
      payable.actions = {
        id: payable.id,
        fileName: payable.fileName
      }      
      setAccounts(accounts.concat(payable));
    }   
  }, [createdAcc])

  useEffect(() => {
    if(Object.keys(editedAcc).length !== 0) {
      let payable = {...editedAcc.data };

      let oldValue = accounts.filter(acc => acc.id === payable.id)[0].value;
      let total = (parseFloat(payableTotal) - parseFloat(oldValue)) + parseFloat(payable.value);
      setPayableTotal(total);     

      payable.paymentDate = moment(payable.paymentDate).format("DD/MM/YYYY");
      payable.dueDateF = moment(payable.dueDate).format("DD/MM/YYYY");
      payable.createdAt = `${moment(payable.createdAt).format("DD/MM/YYYY HH:mm")}`;
      payable.value = parseFloat(payable.value)
      payable.actions = {
        id: payable.id,
        fileName: payable.fileName
      }   

      setAccounts(accounts.map(account => {
        if (account.id === payable.id) {
          account = payable;
        }
        return account;
      }));
    } 
  }, [editedAcc])

  return (
    <ClientDrawer title="Contas Pagas">
      <div className="master-dashboard">                
        <BackgroundCard>
          <BackgroundCardHeader title="Contas Pagas">
            { processingReport ?
            <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </div>
            :
            <>
           
            <PrimaryButton disabled variant="contained" size="large" title={"Nova Conta"}
              onClick={() => handleCreateModalOpen()}  
            >
              <AddIcon />
            </PrimaryButton>
           
            <PrimaryButton disabled variant="contained" size="large" onClick={handleReport} title={"Gerar Relatório"}>
                <PrintIcon />
            </PrimaryButton>
            </>
          }
          </BackgroundCardHeader>
          <HeaderSubtitle/>

          <div className="filter-form-container">
            <form className="filter-form" onSubmit={filterForm.handleSubmit} id="filter-form">
              <div className="filter-form-basic">                            
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
                <div className="input-block">
                  <SuppliersSelect 
                    value={supplier}
                    onChange={handleSupplierChange}
                    optional
                  />
                </div>          
              </div>
              <div className="filter-form-button">
                <PrimaryButton size="large" variant="contained" type="submit">Buscar</PrimaryButton>
              </div>
            </form>
          </div>
        
          {
            loading ?
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px'}}>              
              <CircularProgress />
            </div>
            :
            <>
            <div style={{ height: '50vh', width: '100%', marginTop: '40px'}}>  
              <DataGrid 
                rows={accounts} 
                columns={columns} 
                pageSize={50} 
                localeText={ptBR.props.MuiDataGrid.localeText}              
                disableSelectionOnClick              
              /> 
            </div>
            <div style={{marginTop: '20px'}}>
              <h4>Total: {payableTotalStr} </h4> 
            </div>
            </>
          }                                                              
         
        
        </BackgroundCard>                  
      </div>

      <CreateAccountModal       
        createModal={openCreateModal} 
        handleCreateModalClose={handleCreateModalClose}   
        type={'-'}     
        setCreatedAcc={setCreatedAcc}
        allowKeepPosting
      />

      <EditAccountModal 
        editModal={openEditModal} 
        handleEditModalClose={handleEditModalClose}   
        type={'-'}     
        setEditedAcc={setEditedAcc}     
        selectedToEdit={selectedToEdit}
        handleUnselectToEdit={handleUnselectToEdit}
      />

      <Modal
        open={openDeleteModal}
        open={openDeleteModal}
        onClose={handleDeleteModalClose}
        title={`Você deseja realmente excluir esta conta?`}
        actions={
          <>
            <PrimaryButton onClick={() => { handleDeleteModalClose(); handleUnselectToDelete() }} color="primary">Cancelar</PrimaryButton>
            <PrimaryButton onClick={handleDelete}>Sim</PrimaryButton>
          </>
        }
      >        
        <p>
          <strong>ATENÇÃO: </strong> está ação é <b>permanente</b> e afetará o valor total de contas Pagas.
        </p>
      </Modal>
    </ClientDrawer>
  );
};

export default Paid;