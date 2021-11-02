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

import FormCadastroTurma from '../../../components/FormCadastroTurma';

import { HeaderSubtitle } from '../../../components/HeaderTitle';
import { SnackContext } from '../../../contexts/SnackContext';

import api from '../../../services/api';

import './index.css';

import FormEdicaoTurma from '../../../components/FormEdicaoTurma';
import SelectUnidades from '../../../components/SelectUnidades';


const Unidades = () => {

  const { setSnack } = useContext(SnackContext);      
  
  const [turmaParaEditar, setTurmaParaEditar] = useState(null);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [turmaEditada, setTurmaEditada] = useState({});

  const [modalCadastro, setModalCadastro] = useState(false);
  const [turmaCriada, setTurmaCriada] = useState({});

  const [loading, setLoading] = useState(false);

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
      field: 'pcd', 
      headerName: 'PCD?', 
      width: 200,
      sortable: true,
      renderCell: (turma) => {
        return turma.row.pcd === true ? 'Sim' : 'Não'
      }
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 200,
      sortable: true,
    },
  ];

  useEffect(() => {
    document.title = 'Turmas | Smart Owl';         
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

  return (
    <AdmDrawer title="Turmas">
      <div className="master-dashboard">                
        <BackgroundCard>
          <BackgroundCardHeader title="Turmas">
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
                <SelectUnidades 
                  value={unidade}
                  onChange={handleUnidadeChange}
                />

                <div className="input-block">
                  <TextField                                    
                    label="Status"
                    variant="outlined"
                    type="number"
                    autoComplete="off"
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    error={null}
                    fullWidth 
                    select                
                  >
                    <MenuItem value="Aberta" key="1">Aberta</MenuItem>
                    <MenuItem value="Fechada" key="2">Fechada</MenuItem>
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

      <FormCadastroTurma  
        createModal={modalCadastro} 
        handleCreateModalClose={handleCreateModalClose}   
        type={'-'}     
        setTurmaCriada={setTurmaCriada}        
        allowKeepPosting
      />

      <FormEdicaoTurma 
        editModal={modalEdicao} 
        handleEditModalClose={handleEditModalClose}   
        type={'-'}     
        setTurmaEditada={setTurmaEditada}     
        turmaParaEditar={turmaParaEditar}
        handleUnselectToEdit={handleUnselectToEdit}
      />
    </AdmDrawer>
  );
};

export default Unidades;