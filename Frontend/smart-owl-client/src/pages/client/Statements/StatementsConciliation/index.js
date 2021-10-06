import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { 
  TextField,
  MenuItem,
  CircularProgress,  
} from '@material-ui/core'

import { DataGrid, ptBR } from '@material-ui/data-grid';

import {  useFormik } from 'formik';

import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, makeStyles } from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import AutorenewOutlinedIcon from '@material-ui/icons/AutorenewOutlined';
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CheckBoxIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ClientDrawer from '../../../../components/ClientDrawer';
import BackgroundCard from '../../../../components/BackgroundCard';
import PrimaryButton from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import IconButton from '../../../../components/IconButton';
import { HeaderSubtitle, HeaderTitle } from '../../../../components/HeaderTitle';
import { SnackContext } from '../../../../contexts/SnackContext';

import api from '../../../../services/api';

import './index.css';
import ClientBanksSelect from '../../../../components/ClientBanksSelect';
import { ArrowUpwardRounded, InsertEmoticonTwoTone  } from '@material-ui/icons';
import CreateAccountModal from '../../../../components/CreateAccountModal';

const formatDate = (date) => {
  date = new Date(date);
  return date.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
};

const StatementsConciliation = () => {

  const { setSnack } = useContext(SnackContext);    
  
  const [movs, setMovs] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingAcc, setLoadingAcc] = useState(false);
  const [loadingAccForm, setLoadingAccForm] = useState(false);

  const [bankAccFilter, setBankAccFilter] = useState(null);

  const [selected, setSelected] = useState({});
  const [selectionModal, setSelectionModal] = useState(false);
  
  const [createModal, setCreateModal] = useState(false);
  const [createdAcc, setCreatedAcc] = useState({});
  const [createType, setCreateType] = useState('');

  const useStyles = makeStyles({
    table: {
      minWidth: 'auto',
      border: '1px solid rgba(224, 224, 224, 1)',
      borderCollapse: 'separate',
      borderRadius: '8px'
    },
  });

  const classes = useStyles();

  useEffect(() => {

  console.log(createdAcc)
  setMovs(movs.map(mov => {
    if(mov.mov.id === selected.id) {
      mov.sugestion = createdAcc.data
    }
    return mov;
  }));

  handleCreateModalClose();

  }, [createdAcc]);

  const handleConciliate = async (movId, accId, type) => {
    try {

      setLoading(true);

      await api.put('/mov', {
        id: movId,
        accId,
        type,
        method: 'CONCILIATE'
      });

      setSnack({ 
        message: 'Transação conciliada!', 
        type: 'success', 
        open: true
      });

      setMovs(movs.filter(item => item.mov.id !== movId));

      setLoading(false);

    } catch(err) {
      setSnack({ 
        message: 'Ocorreu um erro ao conciliar. Caso persista, contate o suporte! ' + err.message, 
        type: 'error', 
        open: true
      });

      setLoading(false);
    }
  }

  const handleSugestionChange = async (acc) => {
    try {
      setMovs(movs.map(item => {
        if (item.sugestion !== null) {
          if (item.sugestion.id === acc.id) {
            item.sugestion = null;
          }
        }
        if (item.mov.id === selected.id) {
          item.sugestion = acc;
        }
        return item;
      }));
      handleSelectionModalClose();
    } catch (err) {
      setSnack({ 
        message: 'Ocorreu um erro ao alterar a conta. Caso persista, contate o suporte! ' + err.message, 
        type: 'error', 
        open: true
      });
    }
  }

  const handleDeleteModalOpen = (id, movType) => {
    setOpenDeleteModal(true);
    setSelected({ id, movType, });
  }

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
    setSelected('');
  }

  const handleSelectionModalOpen = (movId) => {
    setSelected(movId);
    console.log(movId);
    setCreateType(movId.value > 0 ? '+' : '-');
    setSelectionModal(true);
  }

  const handleSelectionModalClose = () => {
    setSelected({});
    setSelectionModal(false);
  }

  const handleCreateModalOpen = () => {
    setSelectionModal(false);
    setCreateModal(true);  
  }

  const handleCreateModalClose = () => {
    setSelected({});
    setCreateModal(false);
  }

  const [payables, setPayables] = useState([]);
  const [receivables, setReceivables] = useState([]);
  
  const filterForm = useFormik({
    initialValues: {     
      movType: 'Todos',  
    },
    onSubmit: (values) => {
      handleFilter(values);
    }
  });


  const handleFilter = async (values) => {

    try {

      setLoading(true);

      if (bankAccFilter !== null) {
        values.clientBankId = bankAccFilter.id;
      }  

      values.conciliated = false;

      const response = await api.get("/mov", {
        params: {
          ...values
        }
      });

      setMovs(response.data.movs_sugestions);
      setPayables(response.data.payables);
      setReceivables(response.data.receivables);

      setLoading(false);
            
    } catch (err) {
      setLoading(false);
      setSnack({ 
        message: 'Ocorreu um erro ao buscar os movimentos. Caso persista, contate o suporte! ' + err.message, 
        type: 'error', 
        open: true
      });
    }
  } 

  const handleDelete = async () => {
    try {

      await api.delete(`/mov/${selected.id}/${selected.movType}`);

      handleDeleteModalClose();

      filterForm.submitForm();

      setSnack({ 
        message: 'Movimento excluído!', 
        type: 'success', 
        open: true
      });
    } catch (err) {
      setSnack({ 
        message: 'Ocorreu um erro ao excluir o movimento. Caso persista, contate o suporte! ' + err.message, 
        type: 'error', 
        open: true
      });
    }
  }

  useEffect(() => {
    document.title = 'Conciliação | GestFacil';
    filterForm.submitForm();
  }, []);

  return (
    <ClientDrawer title="Extrato / Conciliação">
      <div className="master-dashboard">
        <BackgroundCard>
          <HeaderTitle 
           title="Conciliação"
           showBackButton
           previousPage="/cli/statement"
          />

          <HeaderSubtitle/>

          <div className="filter-form-container">
            <form className="filter-form" onSubmit={filterForm.handleSubmit} id="filter-form">
              <div className="filter-form-basic">                           
                <div className="input-block">
                  <ClientBanksSelect 
                    value={bankAccFilter}
                    onChange={(value) => setBankAccFilter(value)}                        
                  />                 
                </div>
                <div className="input-block">
                  <PrimaryButton title="Atualizar Movimentos" variant="contained" size="large" onClick={() => filterForm.submitForm()}>
                    <AutorenewOutlinedIcon />
                  </PrimaryButton>
                </div>                         
              </div>                     
            </form>
          </div>

          <div style={{marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
            <span><strong>Pendências:</strong> {movs.length} movimento(s)</span>
          </div>

          {loading 
          
            ? 

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </div>

            :

          

            <div className="conciliation-container">         
              {movs.map(item => {
                return (
                  <div className="conciliation-row">
                    <div className="conciliation-mov-card">
                      <span className="mov-date">
                        {item.mov.value > 0 
                          ? 
                          <ArrowUpwardRounded style={{color: '#A6CE39'}} /> 
                          : 
                          <ArrowDownwardIcon style={{color: 'red'}} />
                        }
                        <br />
                        {formatDate(item.mov.date)}
                      </span>
                      <span className="mov-value">                       
                        {parseFloat(item.mov.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
                      </span>
                      <span className="mov-memo">
                        {item.mov.memo}
                      </span>
                    </div>
                    <div className="conciliation-acc-card">
                      {
                        item.sugestion !== null 
                        ?
                        <>
                        <span className="acc-duedate">
                          <strong>Vencimento:</strong> {formatDate(item.sugestion.dueDate)}
                        </span>
                        <span className="acc-value">
                          <strong>Valor:</strong> {parseFloat(item.sugestion.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <span className="acc-category">
                          <strong>Categoria:</strong> {item.sugestion.account_category.name}
                        </span>
                        <span className="acc-description">
                          <strong>Descrição:</strong> {!item.sugestion.description || item.sugestion.description === "" ? "--" : item.sugestion.description  }
                        </span>
                        <span className="acc-supplier-customer">
                          {item.mov.value < 0 
                            ? <><strong>Fornecedor:</strong> {item.sugestion.supplier.name}</>
                            : <><strong>Cliente:</strong> {item.sugestion.customer.name}</>
                          }
                        </span>
                        </>
                        :
                        <>
                          <br />
                          <br />
                          <h4>Não foram encontradas sugestões.</h4>
                        </>
                      }
                    </div> 
                    <div className="conciliation-card-actions">                
                      <PrimaryButton title="Buscar conta" variant="contained" size="large"
                        onClick={() => handleSelectionModalOpen(item.mov)}
                      >
                        <SearchOutlinedIcon />
                      </PrimaryButton>
                      { 
                        item.sugestion !== null 
                        ?
                        <>
                        <PrimaryButton title="Visualizar Conta" variant="contained" size="large"
                          disabled={item.sugestion.fileName !== null ? true : false}
                          onClick={() => {
                            window.open(`${process.env.REACT_APP_UPLOAD_STORAGE_URL}${item.sugestion.fileName}`,'_blank')
                          }}
                        >
                          <VisibilityOutlinedIcon />
                        </PrimaryButton>
                        <PrimaryButton title="Conciliar" variant="contained" size="large"
                        onClick={() => handleConciliate(item.mov.id, item.sugestion.id, (item.mov.value > 0 ? 'CREDIT' : 'DEBIT'))}
                        >
                          <CheckOutlinedIcon />
                        </PrimaryButton>
                        </>
                        : ''
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          }                                     
        </BackgroundCard>
      </div>

      <Modal
        open={openDeleteModal}
        onClose={handleDeleteModalClose}
        title={`Você deseja realmente excluir este movimento?`}
        actions={
          <>
            <PrimaryButton onClick={() => { handleDeleteModalClose() }} color="primary">Cancelar</PrimaryButton>
            <PrimaryButton onClick={handleDelete}>Sim</PrimaryButton>
          </>
        }
      >        
        <p>
          <strong>ATENÇÃO: </strong> para recuperá-lo, será necessário importar o OFX novamente.
        </p>
      </Modal>

      <Modal
        open={selectionModal}
        onClose={handleSelectionModalClose}
        title={`Selecionar Conta:`}
        actions={
          <>

          </>
        }
      >    

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', justifyContent: 'center', gap: 10, marginBottom: '20px' }}>
          <PrimaryButton onClick={handleSelectionModalClose} variant="contained" size="small">Cancelar</PrimaryButton>
          <PrimaryButton  onClick={handleCreateModalOpen} variant="contained" size="small">Nova Conta</PrimaryButton>
        </div>

        {
          loadingAcc 
          
          ?

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </div> 
          
          :
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Valor</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Vencimento</TableCell>
                <TableCell> { selected.value < 0 ? 'Fornecedor' : 'Cliente' }</TableCell>
                <TableCell>Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                { selected.value < 0 
                ? 
                  <>
                  { payables.map(acc => {

                    return (
                      <TableRow>
                        <TableCell>
                          {parseFloat(acc.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell>
                          {acc.description === "" || acc.description === null ? '--' : acc.description}
                        </TableCell>
                        <TableCell>
                          {formatDate(acc.dueDate)}
                        </TableCell>
                        <TableCell>
                          {acc.supplier.name}
                        </TableCell>
                        <TableCell>
                          <PrimaryButton title="Selecionar" size="small"
                            onClick={() => handleSugestionChange(acc)}
                          >
                            <CheckBoxIcon />
                          </PrimaryButton>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  </>
                : 
                <>
                  { receivables.map(acc => {

                    return (
                      <TableRow>
                        <TableCell>
                          {parseFloat(acc.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell>
                          {acc.description === "" || acc.description === null ? '--' : acc.description}
                        </TableCell>
                        <TableCell>
                          {formatDate(acc.dueDate)}
                        </TableCell>
                        <TableCell>
                          {acc.customer.name}
                        </TableCell>
                        <TableCell>
                          <PrimaryButton title="Selecionar" size="small"
                            onClick={() => handleSugestionChange(acc)}
                          >
                            <CheckBoxIcon />
                          </PrimaryButton>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  </>              
              } 
            </TableBody>
          </Table>
          

        }

              
      </Modal>

     
      <CreateAccountModal 
        loading={loadingAccForm} 
        createModal={createModal} 
        handleCreateModalClose={handleCreateModalClose}   
        type={createType}     
        setCreatedAcc={setCreatedAcc}
      />
      
    </ClientDrawer>
  );
};

export default StatementsConciliation;