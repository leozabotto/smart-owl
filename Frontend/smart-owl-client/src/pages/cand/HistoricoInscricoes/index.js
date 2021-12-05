import React, { useContext, useEffect, useState } from 'react';

import { 
  CircularProgress, MenuItem, TextField
} from '@material-ui/core'

import { DataGrid, ptBR } from '@material-ui/data-grid';

import moment from 'moment';

import AddIcon from '@material-ui/icons/Add';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'

import CandDrawer from '../../../components/CandDrawer';
import BackgroundCard from '../../../components/BackgroundCard';
import PrimaryButton from '../../../components/Button';
import BackgroundCardHeader from '../../../components/BackgroundCardHeader';
import IconButton from '../../../components/IconButton';

import FormCadastroTurma from '../../../components/FormCadastroTurma';

import jwtDecode from 'jwt-decode';

import { HeaderSubtitle } from '../../../components/HeaderTitle';
import { SnackContext } from '../../../contexts/SnackContext';

import api from '../../../services/api';

import './index.css';

import FormEdicaoTurma from '../../../components/FormEdicaoTurma';
import SelectUnidades from '../../../components/SelectUnidades';


const HistoricoInscricoes = () => {

  const { setSnack } = useContext(SnackContext);      
  
  const [turmaParaEditar, setTurmaParaEditar] = useState(null);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [turmaEditada, setTurmaEditada] = useState({});

  const [modalCadastro, setModalCadastro] = useState(false);
  const [turmaCriada, setTurmaCriada] = useState({});

  const [loading, setLoading] = useState(false);

  const [inscricoes, setInscricoes] = useState([])

  //const [processandoRelatorio, setProcessandoRelatorio] = useState(false); 
  
  const [turmas, setTurmas] = useState([]); 

  const [unidade, setUnidade] = useState([]); 

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
    setTurmaParaEditar(account); 
    handleEditModalOpen(); 
  }

  const handleUnselectToEdit = () => {
    setTurmaParaEditar(null);
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
      field: 'id', 
      headerName: 'Protocolo', 
      width: 150,
      sortable: true,      
    },
    { 
      field: 'data', 
      headerName: 'Data de Inscrição', 
      width: 200,
      sortable: true,   
      renderCell: (turma) => {
        return moment(turma.row.createdAt).format("DD/MM/YYYY");
      }   
    },
    { 
      field: 'curso', 
      headerName: 'Curso', 
      width: 240,
      sortable: true,
      renderCell: (turma) => {
        return turma.row.turma.curso.nome
      }
    },
    { 
      field: 'unidade', 
      headerName: 'Unidade', 
      width: 200,
      sortable: true,
      renderCell: (turma) => {
        return turma.row.turma.unidade.nome
      }
    },
    { 
      field: 'periodo', 
      headerName: 'Período', 
      width: 150,
      sortable: true,
      renderCell: (turma) => {
        return turma.row.turma.periodo
      }
    },
    { 
      field: 'modalidade', 
      headerName: 'Modalidade', 
      width: 200,
      sortable: true,
      renderCell: (turma) => {
        return turma.row.turma.modalidade
      }
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 250,
      sortable: true,
    },
    { 
      field: 'encerrada', 
      headerName: 'Encerrada', 
      width: 200,
      sortable: true,
      renderCell: (turma) => {
        return turma.row.encerrada === true ? 'Sim' : 'Não'
      }
    },   
  ];

  useEffect(() => {
    document.title = 'Histórico de Inscrições | Smart Owl';         
  }, []);


  useEffect(() => {
    console.log(turmaCriada)
    if(Object.keys(turmaCriada).length !== 0) {
      let turma = {...turmaCriada.data };
      setTurmas(turmas.concat(turma));
    }   
  }, [turmaCriada])

  useEffect(() => {
    if(Object.keys(turmaEditada).length !== 0) {
      let turma = {...turmaEditada.data };      
      setTurmas(turmas.map(t => {
        if (t.id === turma.id) {
          t = turma;
        }
        return t;
      }));
    } 
  }, [turmaEditada])


  useEffect(() => {
    async function getInscricoes() {
      try {
                
        const token = jwtDecode(localStorage.getItem('token'));
        const candidatoId =  token.id;

        const inscricao = await api.get('/inscricao', {
          params: {
            candidatoId,        
          }
        });
    
        if (inscricao.data.length === 0) {
          setInscricoes([]) 
        } else {
          setInscricoes(inscricao.data);
        }
      } catch (err) {
        setSnack({ 
          message: 'Erro ao buscar informações. Contate-nos! ' + err.message , 
          type: 'error', 
          open: true
        });
      }
    }

    setTimeout(() =>  getInscricoes(), 0);

  }, []);

  return (
    <CandDrawer title="Histórico de Inscrições">
      <div className="master-dashboard">                
        <BackgroundCard>
          <BackgroundCardHeader title="Histórico de Inscrições" />              
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
                rows={inscricoes} 
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
     
    </CandDrawer>
  );
};

export default HistoricoInscricoes;