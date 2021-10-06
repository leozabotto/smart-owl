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

import AdmDrawer from '../../../components/AdmDrawer';
import BackgroundCard from '../../../components/BackgroundCard';
import PrimaryButton from '../../../components/Button';
import Modal from '../../../components/Modal';
import BackgroundCardHeader from '../../../components/BackgroundCardHeader';
import FutureCalendar from '../../../components/FutureCalendar';
import IconButton from '../../../components/IconButton'

import FormCadastroUnidade from '../../../components/FormCadastroUnidade';

import { HeaderSubtitle } from '../../../components/HeaderTitle';
import { SnackContext } from '../../../contexts/SnackContext';


import download from 'downloadjs';
import api from '../../../services/api';

import './index.css';
import FormEdicaoUnidade from '../../../components/FormEdicaoUnidade';

const firstDayOfMonth = moment().startOf('month').add(1, 'days').format('YYYY-MM-DD');
const lastDayOfMonth = moment().endOf('month').add(1, 'days').format('YYYY-MM-DD');

const Unidades = () => {

  const { setSnack } = useContext(SnackContext);    

  const [accounts, setAccounts] = useState([]);
  
  const [payableTotalStr, setPayableTotalStr] = useState("");  
  const [payableTotal, setPayableTotal] = useState(0);  
  
  const [selectedToDelete, setSelectedToDelete] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  
  const [unidadeParaEditar, setUnidadeParaEditar] = useState(null);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [unidadeEditada, setUnidadeEditada] = useState({});

  const [modalCadastro, setModalCadastro] = useState(false);
  const [unidadeCriada, setUnidadeCriada] = useState({});

  const [loading, setLoading] = useState(false);

  const [processandoRelatorio, setProcessandoRelatorio] = useState(false); 
  
  const [unidades, setUnidades] = useState([]);


  const handleDeleteModalOpen = () => {
    setOpenDeleteModal(true);
  }

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
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

  const handleSelectToDelete = (id) => {
    setSelectedToDelete(id);
  }

  const handleUnselectToDelete = (id) => {
    setSelectedToDelete('');
  }   
  
  const handleSelecionarParaEditar = (account) => {
    setUnidadeParaEditar(account); 
    handleEditModalOpen(); 
  }

  const handleUnselectToEdit = () => {
    setUnidadeParaEditar(null);
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
           title={"Editar Unidade"}
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
      field: 'nome', 
      headerName: 'Nome', 
      width: 200,
      sortable: true,      
    },
    { 
      field: 'email', 
      headerName: 'E-mail', 
      width: 200,
      sortable: true,
    },
    { 
      field: 'telefone', 
      headerName: 'Telefone', 
      width: 200,
      sortable: true,
    },
  ];

  useEffect(() => {
    document.title = 'Unidades | Smart Owl';  
    
    async function getUnidades() {
      try {
        setLoading(true);
        const unidades = await api.get('/unidade');
        setUnidades(unidades.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setSnack({ 
          message: 'Erro ao buscar as unidades!' + err.mensagem, 
          type: 'error', 
          open: true 
        });
      }
    }
    getUnidades();

  }, []);


  useEffect(() => {
    if(Object.keys(unidadeCriada).length !== 0) {
      let unidade = {...unidadeCriada.data };
      setUnidades(unidades.concat(unidade));
    }   
  }, [unidadeCriada])

  useEffect(() => {
    if(Object.keys(unidadeEditada).length !== 0) {
      let unidade = {...unidadeEditada.data };      
      setUnidades(unidades.map(unid => {
        if (unid.id === unidade.id) {
          unid = unidade;
        }
        return unid;
      }));
    } 
  }, [unidadeEditada])

  return (
    <AdmDrawer title="Unidades">
      <div className="master-dashboard">                
        <BackgroundCard>
          <BackgroundCardHeader title="Unidades">
            { processandoRelatorio ?
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
        
          {
            loading ?
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px'}}>              
              <CircularProgress />
            </div>
            :
            <>
            <div style={{ height: '70vh', width: '100%', marginTop: '40px'}}>  
              <DataGrid 
                rows={unidades} 
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

      <FormCadastroUnidade     
        createModal={modalCadastro} 
        handleCreateModalClose={handleCreateModalClose}   
        type={'-'}     
        setUnidadeCriada={setUnidadeCriada}
        allowKeepPosting
      />

      <FormEdicaoUnidade 
        editModal={modalEdicao} 
        handleEditModalClose={handleEditModalClose}   
        type={'-'}     
        setUnidadeEditada={setUnidadeEditada}     
        unidadeParaEditar={unidadeParaEditar}
        handleUnselectToEdit={handleUnselectToEdit}
      />
    </AdmDrawer>
  );
};

export default Unidades;