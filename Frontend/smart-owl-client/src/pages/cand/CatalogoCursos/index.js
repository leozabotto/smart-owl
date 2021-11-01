import React, { useContext, useEffect, useState } from 'react';

import { 
  CircularProgress, MenuItem, TextField,
} from '@material-ui/core'

import { DataGrid, ptBR } from '@material-ui/data-grid';

import AddIcon from '@material-ui/icons/Add';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'

import CandDrawer from '../../../components/CandDrawer';
import BackgroundCard from '../../../components/BackgroundCard';
import PrimaryButton from '../../../components/Button';
import BackgroundCardHeader from '../../../components/BackgroundCardHeader';
import IconButton from '../../../components/IconButton'

import FormCadastroTurmas from '../../../components/FormCadastroTurmas';

import { HeaderSubtitle } from '../../../components/HeaderTitle';
import { SnackContext } from '../../../contexts/SnackContext';

import api from '../../../services/api';

import Modal from '../../../components/Modal';


import './index.css';

import FormEdicaoUnidade from '../../../components/FormEdicaoUnidade';
import SelectUnidades from '../../../components/SelectUnidades';


const CatalogoCursos = () => {

  const { setSnack } = useContext(SnackContext);      
  
  const [unidadeParaEditar, setUnidadeParaEditar] = useState(null);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [unidadeEditada, setTurmaEditada] = useState({});

  const [modalCadastro, setModalCadastro] = useState(false);
  const [turmaCriada, setTurmaCriada] = useState({});

  const [loading, setLoading] = useState(false);

  //const [processandoRelatorio, setProcessandoRelatorio] = useState(false); 
  
  const [turmas, setTurmas] = useState([]); 
  const [unidade, setUnidade] = useState([]);
  
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  }

  const handleUnidadeChange = (value) => {
    setUnidade(value)
  }

  const [status, setStatus] = useState('Aberta'); 

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
    setUnidadeParaEditar(account); 
    handleEditModalOpen(); 
  }

  const handleUnselectToEdit = () => {
    setUnidadeParaEditar(null);
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
        message: 'Ocorreu um erro ao buscar os cursos. Caso persista, contate o suporte! ' + err, 
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
      field: 'curso', 
      headerName: 'Curso', 
      width: 240,
      sortable: true,
      renderCell: (turma) => {
        return turma.row.curso.nome
      }
    },
    { 
      field: 'unidade', 
      headerName: 'Unidade', 
      width: 200,
      sortable: true,
      renderCell: (turma) => {
        return turma.row.unidade.nome
      }
    },
    { 
      field: 'periodo', 
      headerName: 'Período', 
      width: 150,
      sortable: true,
    },
    { 
      field: 'modalidade', 
      headerName: 'Modalidade', 
      width: 200,
      sortable: true,
    },
    { 
      field: 'qtd_vagas', 
      headerName: 'Qtd. Vagas', 
      width: 150,
      sortable: true,
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 200,
      sortable: true,
    },
  ];

  useEffect(() => {
    document.title = 'Catálogo de Cursos | Smart Owl';         
  }, []);


  useEffect(() => {
    console.log(turmaCriada)
    if(Object.keys(turmaCriada).length !== 0) {
      let turma = {...turmaCriada.data };
      setTurmas(turmas.concat(turma));
    }   
  }, [turmaCriada])

  useEffect(() => {
    if(Object.keys(unidadeEditada).length !== 0) {
      let unidade = {...unidadeEditada.data };      
      /*setUnidades(unidades.map(unid => {
        if (unid.id === unidade.id) {
          unid = unidade;
        }
        return unid;
      }));*/
    } 
  }, [unidadeEditada])

  return (
    <CandDrawer title="Catálogo de Cursos">
      <div className="master-dashboard">                
        <BackgroundCard>
          <BackgroundCardHeader title="Catálogo de Cursos" />            
          <HeaderSubtitle/>         
        
          {
            loading ?
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px'}}>              
              <CircularProgress />
            </div>
            :
            <>
             <div className="cursos">
             
              <button className="card-curso" onClick={() =>{
                handleOpenModal();
              }}>CURSO</button>
              <button className="card-curso" onClick={() =>{
                handleOpenModal();
              }}>CURSO</button>
              <button className="card-curso" onClick={() =>{
                handleOpenModal();
              }}>CURSO</button>
              <button className="card-curso" onClick={() =>{
                handleOpenModal();
              }}>CURSO</button>
              <button className="card-curso" onClick={() =>{
                handleOpenModal();
              }}>CURSO</button>
              <button className="card-curso" onClick={() =>{
                handleOpenModal();
              }}>CURSO</button>
              <button className="card-curso" onClick={() =>{
                handleOpenModal();
              }}>CURSO</button>
              <button className="card-curso" onClick={() =>{
                handleOpenModal();
              }}>CURSO</button>
                
              
            </div>
            </>
          }                                                              
         
        
        </BackgroundCard>                  
      </div>
      
      <Modal      
        open={openModal}
        onClose={handleCloseModal}
        title={`Curso X`}
        actions={
          <>
            <PrimaryButton onClick={() => { handleCloseModal(); }} color="secondary">Cancelar</PrimaryButton>
            <PrimaryButton onClick={() => { handleCloseModal(); }} color="primary">Inscrever-se</PrimaryButton>
          </>
        }
      >        
        <p><b>Descrição:</b></p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec scelerisque ut lacus finibus sollicitudin.</p>

        <p style={{marginTop: '10px'}}><b>Carga Horária:</b> 360h</p>

        <p style={{marginTop: '40px'}}><b>Unidades (Período)</b></p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
          <p><b>1.</b> Unidade Barra Funda (Manhã) </p>
          <p><b>QTD Vagas:</b> 80</p>
          <p><b>2.</b> Unidade Barra Funda (Tarde) </p>
          <p><b>QTD Vagas:</b> 80</p>
          <p><b>3.</b> Unidade Barra Funda (Noite) </p>
          <p><b>QTD Vagas:</b> 80</p>
        </div>
      </Modal>
    </CandDrawer>
  );
};

export default CatalogoCursos;