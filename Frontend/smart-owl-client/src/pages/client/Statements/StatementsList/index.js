import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import moment from 'moment';

import { 
  TextField,
  MenuItem,
  CircularProgress,  
} from '@material-ui/core'

import { DataGrid, ptBR } from '@material-ui/data-grid';

import {  useFormik } from 'formik';

import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import AutorenewOutlinedIcon from '@material-ui/icons/AutorenewOutlined';
import PlaylistAddCheckOutlinedIcon from '@material-ui/icons/PlaylistAddCheckOutlined';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CancelOutlined from '@material-ui/icons/CancelOutlined';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import ClientDrawer from '../../../../components/ClientDrawer';
import BackgroundCard from '../../../../components/BackgroundCard';
import PrimaryButton from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import BackgroundCardHeader from '../../../../components/BackgroundCardHeader';
import FutureCalendar from '../../../../components/FutureCalendar';
import IconButton from '../../../../components/IconButton';

import { HeaderSubtitle } from '../../../../components/HeaderTitle';
import { SnackContext } from '../../../../contexts/SnackContext';

import api from '../../../../services/api';

import './index.css';
import ClientBanksSelect from '../../../../components/ClientBanksSelect';
import { CheckCircleOutline } from '@material-ui/icons';


const firstDayOfMonth = moment().startOf('month').add(1, 'days').format('YYYY-MM-DD');
const lastDayOfMonth = moment().endOf('month').add(1, 'days').format('YYYY-MM-DD');

const formatDateUS = (date) => {
  date = new Date(date);
  return date.toLocaleDateString('en-US');
};

const formatDate = (date) => {
  date = new Date(date);
  return date.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
};

const Statement = () => {

  const { setSnack } = useContext(SnackContext);    
  
  const [movs, setMovs] = useState([]);
  const [ofxFileName, setOfxFileName] = useState('Nenhum arquivo selecionado.');
  const [ofxFile, setOfxFile] = useState(null);

  const [initialDate, setInitialDate] = useState(new Date(firstDayOfMonth).toLocaleString('en',{ timezone: 'UTC'}));
  const [finalDate, setFinalDate] = useState(new Date(lastDayOfMonth).toLocaleString('en',{ timezone: 'UTC'}));

  const [openImportModal, setOpenImportModal] = useState(false);
  const [openResultModal, setOpenResultModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUnlinkModal, setOpenUnlinkModal] = useState(false);

  const [importLog, setImportLog] = useState({ imported: 0, ignored: 0});

  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState(false);
  const [importErrorMsg, setImportErrorMsg] = useState(true);

  const [bankAccImport, setBankAccImport] = useState(null);
  const [bankAccFilter, setBankAccFilter] = useState(null);

  const [totalIn, setTotalIn] = useState("R$ 0,00");
  const [totalOut, setTotalOut] = useState("R$ 0,00");
  const [totalLiquid, setTotalLiquid] = useState("R$ 0,00");

  const [selected, setSelected] = useState({});

  const [loading, setLoading] = useState(false);

  const handleImportModalOpen = () => {
    setOpenImportModal(true);
  }

  const handleImportModalClose = () => {
    setOpenImportModal(false);
  }

  const handleResultModalOpen = () => {
    setOpenResultModal(true);
  }

  const handleResultModalClose = () => {
    setOpenResultModal(false);
    setImportErrorMsg(null);
    setImportError(false);
  }
  
  const handleDeleteModalOpen = (id, movType) => {
    setOpenDeleteModal(true);
    setSelected({ id, movType, });
  }

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
    setSelected('');
  }

  const handleUnlinkModalOpen = (id, movType, accId) => {
    setOpenUnlinkModal(true);   
    setSelected({ id, movType, accId, });
  }

  const handleUnlinkModalClose = () => {
    setOpenUnlinkModal(false);
    setSelected('');
  }

  const handleUnlink = async () => {
    try {

      await api.put(`/mov`, {
        id: selected.id,
        type: selected.movType,
        accId: selected.accId,
        method: "UNDO_CONCILIATION"
      });

      handleUnlinkModalClose();

      filterForm.submitForm();

      setSnack({ 
        message: 'Conciliação desfeita!', 
        type: 'success', 
        open: true
      });

    } catch (err) {
      setSnack({ 
        message: 'Ocorreu um erro ao desfazer a conciliação. Caso persista, contate o suporte! ' + err.message, 
        type: 'error', 
        open: true
      });
    }
  }

  const columns = [  
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 100,
      sortable: false,
      renderCell: (mov) => {        
        if (mov.row.value < 0) {
          if (mov.row.clientPayableId === null ) {
            return (
            <PrimaryButton size="small" title="Não Conciliada">
              <ErrorOutlineIcon style={{color:'red'}}/>
            </PrimaryButton>)
          } else {
            return (
            <PrimaryButton size="small"  title="Conciliada">
              <CheckCircleOutline style={{color: '#a3c338'}} />
            </PrimaryButton>)
          }
        } else {
          if (mov.row.clientReceivableId === null ) {
            return (
            <PrimaryButton size="small" title="Não Conciliada">
              <ErrorOutlineIcon style={{color:'red'}}/>
            </PrimaryButton>)
          } else {
            return (
            <PrimaryButton size="small"  title="Conciliada">
              <CheckCircleOutline style={{color: '#a3c338'}} />
            </PrimaryButton>)
          }
        }
      }
    },
    { 
      field: 'actions', 
      headerName: 'Ações', 
      width: 160,
      sortable: false,
      renderCell: (mov) => {        
        return (<>
          
        {
          mov.row.value < 0 && mov.row.clientPayableId !== null 
          ?
          <>
          <IconButton disabled={mov.row.client_payable.fileName !== undefined ? true : false} onClick={() => {
            window.open(`${process.env['REACT_APP_UPLOAD_STORAGE_URL']}/uploads/client_payables/${mov.row.client_payable.fileName}`, '_blank');
          }}>
            <VisibilityOutlinedIcon />
          </IconButton>
          <IconButton onClick={() => handleUnlinkModalOpen(mov.row.id, 'DEBIT', mov.row.clientPayableId) }>
            <CancelOutlined />
          </IconButton>
          <IconButton disabled>
            <DeleteOutlinedIcon />
          </IconButton>  
          </>
          : mov.row.value > 0 && mov.row.clientReceivableId !== null
          ?
          <>
          <IconButton disabled={mov.row.client_receivable.fileName !== undefined ? true : false} onClick={() => {
            window.open(`${process.env['REACT_APP_UPLOAD_STORAGE_URL']}/uploads/client_receivables/${mov.row.client_receivable.fileName}`, '_blank');
          }}>
            <VisibilityOutlinedIcon />
          </IconButton>
          <IconButton onClick={() => handleUnlinkModalOpen(mov.row.id, 'CREDIT', mov.row.clientReceivableId) }>
            <CancelOutlined />
          </IconButton>
          <IconButton disabled>
           <DeleteOutlinedIcon />
          </IconButton> 
          </>
          : 
          <>
          <IconButton disabled>
            <VisibilityOutlinedIcon />
          </IconButton>
          <IconButton disabled>
            <CancelOutlined />
          </IconButton> 
           <IconButton onClick={() => {
            handleDeleteModalOpen(mov.row.id, mov.row.value > 0 ? 'CREDIT' : 'DEBIT');
           }}>
             <DeleteOutlinedIcon />
          </IconButton> 
          
          </>
        }                                  
        </>)
      }
    },
    { 
      field: 'date', 
      headerName: 'Data', 
      width: 150,
      sortable: true,
      renderCell: (mov) => {        
        return formatDate(mov.row.date)
      }
    },
    { 
      field: 'memo', 
      headerName: 'Descrição', 
      width: 400,
      sortable: true,     
    },     
    { 
      field: 'value', 
      headerName: 'Valor', 
      width: 140,
      sortable: true,
      renderCell: ((mov) => {  
        let value = parseFloat(mov.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if (mov.value > 0) {
          return (<>
            <ArrowUpwardIcon style={{color: '#a3c338'}} /> &nbsp;
            {value}
          </>)
        } else {
          return (<>
           <ArrowDownwardIcon style={{color: 'red'}} /> &nbsp;
            {value}
          </>)
        }
      })
    },
   
  ];

  const filterForm = useFormik({
    initialValues: {     
      movType: 'Todos',
      finalDueDate: '',  
    },
    onSubmit: (values) => {
      handleFilter(values);
    }
  });

  const importForm = useFormik({
    initialValues: {     
      bankAccount: 'TODAS',  
    },
    onSubmit: (values) => {
      handleImport(values);
    },
  });

  const handleFilter = async (values) => {
    setLoading(true);
        
    let totalIn = 0;
    let totalOut = 0;
    let totalLiquid = 0;

    try {

      values.initialDate = formatDateUS(initialDate);
      values.finalDate = formatDateUS(finalDate);

      if (bankAccFilter !== null) {
        values.clientBankId = bankAccFilter.id;
      }

      const response = await api.get("/mov", {
        params: {
          ...values
        }
      });

      let movs = [];

      if (values.movType === 'Todos') {
        movs = response.data.in.concat(response.data.out);
      } else if (values.movType === 'Entrada') {
        movs = response.data.in;
      } else {
        movs = response.data.out;
      }

      setMovs(movs);

      movs.forEach(mov => {
        let value = parseFloat(mov.value);
        if (value > 0) {
          totalIn += value;
        } else {
          totalOut += value;
        }
      });

      totalLiquid = totalIn - (totalOut * - 1);
    
      setTotalLiquid(parseFloat(totalLiquid).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
      setTotalIn(parseFloat(totalIn).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
      setTotalOut(parseFloat(totalOut * -1).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));

      setLoading(false);
    } catch (err) {
      setSnack({ 
        message: 'Ocorreu um erro ao buscar os movimentos. Caso persista, contate o suporte! ' + err.message, 
        type: 'error', 
        open: true
      });
      setLoading(false);
    }
  }

  const handleImport = async (values) => {
    
    setImportLoading(true);

    if (bankAccImport === null) {
      setSnack({ 
        message: 'Selecione uma conta bancária!', 
        type: 'error', 
        open: true
      });     
      setImportLoading(false); 
      return;
    }

    if (ofxFile === null) {
      setSnack({ 
        message: 'Selecione um arquivo para importar!', 
        type: 'error', 
        open: true
      });     
      setImportLoading(false);      
      return;
    }
   
    const formData = new FormData();
    formData.append("ofxFile", ofxFile);
    formData.append("clientBankId", bankAccImport.id);    

    try {
      const res = await api.post('/mov', formData);
    
      setImportLog({ imported: res.data.imported, ignored: res.data.ignored });

      handleImportModalClose();
      setImportLoading(false);
      handleResultModalOpen();
      setOfxFileName('Nenhum arquivo selecionado.');
      setOfxFile(null);

    } catch (err) {

      handleImportModalClose();
      setImportErrorMsg(err.response.data.message);
      setImportError(true);
      handleResultModalOpen();
      setImportLoading(false);
      setOfxFileName('Nenhum arquivo selecionado.');
      setOfxFile(null);
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
    document.title = 'Extrato | GestFacil';    
    filterForm.submitForm();
  }, []);

  return (
    <ClientDrawer title="Extrato">
      <div className="master-dashboard">
        <BackgroundCard>
          <BackgroundCardHeader title="Extrato">
         
            <PrimaryButton 
              variant="contained" 
              size="large" 
              onClick={_ => handleImportModalOpen()}
              title="Importar OFX"
            >
              <PublishOutlinedIcon />
            </PrimaryButton>
         
            <Link className="buttonLink" to="/cli/conciliation">
              <PrimaryButton variant="contained" size="large" title="Conciliação">
                <PlaylistAddCheckOutlinedIcon />
              </PrimaryButton>
            </Link>
            <PrimaryButton variant="contained" size="large" title="Gerar Relatório" disabled>
                <PrintIcon />
            </PrimaryButton>
          </BackgroundCardHeader>
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
                  <FutureCalendar                    
                    name="initialDate"
                    label="Data Inicial"
                    inputVariant="outlined"                    
                    autoComplete="off"
                    value={initialDate}
                    onChange={setInitialDate}           
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <FutureCalendar                    
                    name="finalDate"
                    label="Data Final"
                    inputVariant="outlined"                    
                    autoComplete="off"
                    value={finalDate}
                    onChange={setFinalDate}                
                    fullWidth
                  />
                </div>  
                <div className="input-block">
                  <TextField
                    select
                    name="movType"
                    label="Tipo de Movimento"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={filterForm.values.movType}
                    onChange={filterForm.handleChange}                    
                    fullWidth                 
                    >
                    <MenuItem key="1" value="Todos">Todos</MenuItem>
                    <MenuItem key="2" value="Entrada">Entrada</MenuItem>
                    <MenuItem key="3" value="Saída">Saída</MenuItem>
                  </TextField>
                </div>          
              </div>
              <div className="filter-form-button">
              <PrimaryButton variant="contained" size="large" onClick={() => filterForm.submitForm()} title="Atualizar Listagem">
                <AutorenewOutlinedIcon />
              </PrimaryButton>
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
                rows={movs} 
                columns={columns} 
                pageSize={50} 
                localeText={ptBR.props.MuiDataGrid.localeText}              
                disableSelectionOnClick 
              />                                   
            </div>  
            <div style={{marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
              <span><strong>Total de entradas:</strong> {totalIn}  </span> 
              <span><strong>Total de saídas:</strong> {totalOut} </span>
              <span><strong>Total líquido:</strong> {totalLiquid} </span> 
            </div>  
            </>         
          }                        
        </BackgroundCard>
      </div>
      <Modal
        open={openImportModal}
        onClose={handleImportModalClose}
        title={`Importar OFX`}
        actions={
          <>
            {!importLoading ? 
            <>
              <PrimaryButton onClick={() => { handleImportModalClose() }} color="secondary">CANCELAR</PrimaryButton>
              <PrimaryButton onClick={() => { importForm.submitForm(); }} color="primary">IMPORTAR</PrimaryButton>
            </>
            : '' }
          </>
        }
      >       
        {!importLoading ?
        
        <div className="filter-form-container">
          <form onSubmit={importForm.handleSubmit} id="import-ofx-form">
            <div className="input-block">
              <ClientBanksSelect 
                value={bankAccImport}
                onChange={(value) => setBankAccImport(value)}       
              /> 
            </div>

            <HeaderSubtitle title="Arquivo"/>

            <div className="input-block">
              <p id="fileName">{ofxFileName}</p> <br/>             
              <input                               
                id="contained-button-file"
                type="file"
                name="document"
                onChange={(e) => {
                  setOfxFileName(e.currentTarget.value);
                  setOfxFile(e.currentTarget.files[0]);                  
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
        : <>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignContent: 'center', 
              alignItems: 'center',             
            }}>
              <CircularProgress /> 
              <p style={{ marginTop: '10px'}}> Importando movimentos... Não feche o navegador. </p>
            </div>
         
         </>}
      </Modal>
      <Modal
        open={openResultModal}
        onClose={handleResultModalClose}
        title={``}
        actions={
          <>           
            <PrimaryButton onClick={() => { handleResultModalClose() }} color="secondary">OK</PrimaryButton>             
          </>
        }
      >       
        {importError ?
        
        <>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignContent: 'center', 
            alignItems: 'center',             
          }}>
            <ErrorOutlineIcon style={{fontSize: '40px', color: 'red'}}/>
            <p style={{ marginTop: '10px'}}><strong> Erro ao importar movimentos! </strong></p>
            <p style={{ marginTop: '20px', justifyContent: 'center'}}> 
              Não foi possível importar os movimentos porque {importErrorMsg} Tente novamente!
            </p>
          </div>
         </>
       
        : <>
            <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignContent: 'center', 
            alignItems: 'center',             
          }}>
            <DoneOutlineOutlinedIcon style={{fontSize: '40px', color: '#a3c338'}}/>
            <p style={{ marginTop: '10px'}}><strong> Operação concluída com sucesso! </strong></p>
            <p style={{ marginTop: '20px', justifyContent: 'center'}}> 
              <ul style={{ listStyleType: 'none' }}>
                <li><strong> {importLog.imported} movimentos </strong> foram importados...</li>
                <li><strong> {importLog.ignored} movimentos repetidos </strong> foram ignorados...</li>
              </ul>
            </p>
          </div>
         </>}
      </Modal>
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
        open={openUnlinkModal}
        onClose={handleUnlinkModalClose}
        title={`Você deseja realmente desfazer esta conciliação?`}
        actions={
          <>
            <PrimaryButton onClick={() => { handleUnlinkModalClose() }} color="primary">Cancelar</PrimaryButton>
            <PrimaryButton onClick={handleUnlink}>Sim</PrimaryButton>
          </>
        }
      >               
      </Modal>
    </ClientDrawer>
  );
};

export default Statement;