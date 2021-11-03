import React, { useContext, useEffect, useState } from 'react';

import { 
  CircularProgress, MenuItem, TextField
} from '@material-ui/core'

import { DataGrid, ptBR } from '@material-ui/data-grid';

import AddIcon from '@material-ui/icons/Add';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'

import AdmDrawer from '../../../components/AdmDrawer';
import BackgroundCard from '../../../components/BackgroundCard';
import PrimaryButton from '../../../components/Button';
import BackgroundCardHeader from '../../../components/BackgroundCardHeader';
import IconButton from '../../../components/IconButton';

import FormCadastroRedacao from '../../../components/FormCadastroRedacao';

import { HeaderSubtitle } from '../../../components/HeaderTitle';
import { SnackContext } from '../../../contexts/SnackContext';

import api from '../../../services/api';

import './index.css';

import FormEdicaoRedacao from '../../../components/FormEdicaoRedacao';

const BancoRedacao = () => {

  const { setSnack } = useContext(SnackContext);      
  
  const [itemParaEditar, setItemParaEditar] = useState(null);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [itemEditado, setItemEditado] = useState({});

  const [modalCadastro, setModalCadastro] = useState(false);
  const [itemCriado, setItemCriado] = useState({});

  const [loading, setLoading] = useState(false);

  //const [processandoRelatorio, setProcessandoRelatorio] = useState(false); 
  
  const [turmas, setTurmas] = useState([]); 

  const [unidade, setUnidade] = useState([]); 

  const handleUnidadeChange = (value) => {
    setUnidade(value)
  }

  const [status, setStatus] = useState('Ativa'); 

  const handleStatusChange = (value) => {
    setStatus(value)
  }

  const handleCreateModalOpen = () => {
    setModalCadastro(true);
  }
    
  const handleCreateModalClose = () => {
    setModalCadastro(false);
  }

  const handleEditModalOpen = () => {
    setModalEdicao(true);
  }

  const handleEditModalClose = () => {
    setModalEdicao(false);
  }
  
  const handleSelecionarParaEditar = (account) => {
    setItemParaEditar(account); 
    handleEditModalOpen(); 
  }

  const handleUnselectToEdit = () => {
    setItemParaEditar(null);
  }   

  const handleFilter = async () => {
    try {

      const turmas = await api.get('/turma', { 
        params: {
          unidadeId: unidade.id, 
          status
        }
      });

      setTurmas(turmas.data);

    } catch (err) {
      setSnack({ 
        message: 'Ocorreu um erro ao buscar as turmas. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });

      console.log(err);
    }
  }

  const columns = [  
    { 
      field: 'actions', 
      headerName: 'Ações', 
      width: 100,
      sortable: false,
      renderCell: (account) => {                      
        return (<>            
          <IconButton 
           title={"Editar Turma"}
            onClick={() => {        
              handleSelecionarParaEditar(account.row);        
            }
          }>
            <CreateOutlinedIcon />
          </IconButton>                                
        </>);
      }
    },
    { 
      field: 'titulo', 
      headerName: 'Título', 
      width: 200,
      sortable: true,      
    },
    { 
      field: 'enunciado', 
      headerName: 'Enunciado', 
      width: 400,
      sortable: true,      
    },       
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 200,
      sortable: true,
      renderCell: (item) => {
        return item.row.ativo ? 'ATIVA' : 'INATIVA'
      }
    },
  ];

  useEffect(() => {
    document.title = 'Banco de Redações | Smart Owl';         
  }, []);


  useEffect(() => {
    console.log(itemCriado)
    if(Object.keys(itemCriado).length !== 0) {
      let turma = {...itemCriado.data };
      setTurmas(turmas.concat(turma));
    }   
  }, [itemCriado])

  useEffect(() => {
    if(Object.keys(itemEditado).length !== 0) {
      let turma = {...itemEditado.data };      
      setTurmas(turmas.map(t => {
        if (t.id === turma.id) {
          t = turma;
        }
        return t;
      }));
    } 
  }, [itemEditado])

  return (
    <AdmDrawer title="Banco de Redações">
      <div className="master-dashboard">                
        <BackgroundCard>
          <BackgroundCardHeader title="Banco de Redações">
            { /* processandoRelatorio */ false  ?
            <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </div>
            :
            <>
           
            <PrimaryButton variant="contained" size="large" title={"Nova Unidade"}
              onClick={() => handleCreateModalOpen()}  
            >
              <AddIcon />
            </PrimaryButton>
           
            <PrimaryButton variant="contained" size="large" title={"Gerar Relatório"} disabled>
                <PrintIcon />
            </PrimaryButton>
            </>
          }
          </BackgroundCardHeader>
          <HeaderSubtitle/>

          <div className="filter-form-container">
            <form className="filter-form" onSubmit={null} id="filter-form">
              <div className="filter-form-basic">              
                <div className="input-block">
                  <TextField                                    
                    label="Status"
                    variant="outlined"
                    autoComplete="off"
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    error={null}
                    fullWidth 
                    select                
                  >
                    <MenuItem value="Ativa" key="1">Ativa</MenuItem>
                    <MenuItem value="Inativa" key="2">Inativa</MenuItem>
                  </TextField> 
                </div>
                <div className="input-block">
                  <PrimaryButton size="large" variant="contained" onClick={() => handleFilter()}>Buscar</PrimaryButton>
                </div> 
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
            <div style={{ height: '70vh', width: '100%', marginTop: '40px'}}>  
              <DataGrid 
                rows={turmas} 
                columns={columns} 
                pageSize={50} 
                localeText={ptBR.props.MuiDataGrid.localeText}              
                disableSelectionOnClick              
              />
            </div> 
            </>
          }                                                              
         
        
        </BackgroundCard>                  
      </div>

      <FormCadastroRedacao  
        createModal={modalCadastro} 
        handleCreateModalClose={handleCreateModalClose}   
        type={'-'}     
        setItemCriado={setItemCriado}        
        allowKeepPosting
      />

      <FormEdicaoRedacao 
        editModal={modalEdicao} 
        handleEditModalClose={handleEditModalClose}   
        type={'-'}     
        setItemEditado={setItemEditado}     
        itemParaEditar={itemParaEditar}
        handleUnselectToEdit={handleUnselectToEdit}
      />
    </AdmDrawer>
  );
};

export default BancoRedacao;