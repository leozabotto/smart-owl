import React, { useContext, useEffect, useState } from 'react';

import { 
  CircularProgress  
} from '@material-ui/core'

import { DataGrid, ptBR } from '@material-ui/data-grid';


import AddIcon from '@material-ui/icons/Add';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'

import AdmDrawer from '../../../components/AdmDrawer';
import BackgroundCard from '../../../components/BackgroundCard';
import PrimaryButton from '../../../components/Button';
import BackgroundCardHeader from '../../../components/BackgroundCardHeader';
import IconButton from '../../../components/IconButton'

import FormCadastroCurso from '../../../components/FormCadastroCurso';

import { HeaderSubtitle } from '../../../components/HeaderTitle';
import { SnackContext } from '../../../contexts/SnackContext';


import api from '../../../services/api';

import './index.css';
import FormEdicaoCurso from '../../../components/FormEdicaoCurso';

const Cursos = () => {

  const { setSnack } = useContext(SnackContext);    
  
  const [cursoParaEditar, setCursoParaEditar] = useState(null);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [cursoEditado, setCursoEditado] = useState({});

  const [modalCadastro, setModalCadastro] = useState(false);
  const [cursoCriado, setCursoCriado] = useState({});

  const [loading, setLoading] = useState(false);

  //const [processandoRelatorio, setProcessandoRelatorio] = useState(false); 
  
  const [cursos, setCursos] = useState([]);

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
    setCursoParaEditar(account); 
    handleEditModalOpen(); 
  }

  const handleUnselectToEdit = () => {
    setCursoParaEditar(null);
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
      width: 400,
      sortable: true,      
    },
    { 
      field: 'idade_min', 
      headerName: 'Idade Mín.', 
      width: 150,
      sortable: true,
    },
    { 
      field: 'idade_max', 
      headerName: 'Idade Max.', 
      width: 150,
      sortable: true,
    },
    { 
      field: 'ch', 
      headerName: 'C.H.', 
      width: 100,
      sortable: true,
    },
    { 
      field: 'ativo', 
      headerName: 'Status', 
      width: 200,
      sortable: true,
      renderCell: (curso) => {
        return curso.row.ativo === true ? "ATIVO" : "INATIVO"
      }
    }, 
    { 
      field: 'descricao', 
      headerName: 'Descrição', 
      width: 600,
      sortable: true,
    },      
  ];

  useEffect(() => {
    document.title = 'Cursos | Smart Owl';  
    
    async function getCursos() {
      try {
        setLoading(true);
        const cursos = await api.get('/curso');
        setCursos(cursos.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setSnack({ 
          message: 'Erro ao buscar os cursos!' + err.mensagem, 
          type: 'error', 
          open: true 
        });
      }
    }
    getCursos();

  }, []);


  useEffect(() => {
    if(Object.keys(cursoCriado).length !== 0) {
      let curso = {...cursoCriado.data };
      setCursos(cursos.concat(curso));
    }   
  }, [cursoCriado])

  useEffect(() => {
    if(Object.keys(cursoEditado).length !== 0) {
      let curso = {...cursoEditado.data };      
      setCursos(cursos.map(unid => {
        if (unid.id === curso.id) {
          unid = curso;
        }
        return unid;
      }));
    } 
  }, [cursoEditado])

  return (
    <AdmDrawer title="Cursos">
      <div className="master-dashboard">                
        <BackgroundCard>
          <BackgroundCardHeader title="Cursos">
            { /*processandoRelatorio*/ false ?
            <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </div>
            :
            <>
           
            <PrimaryButton variant="contained" size="large" title={"Novo Curso"}
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
                rows={cursos} 
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

      <FormCadastroCurso     
        createModal={modalCadastro} 
        handleCreateModalClose={handleCreateModalClose}   
        type={'-'}     
        setCursoCriado={setCursoCriado}
        allowKeepPosting
      />

      <FormEdicaoCurso 
        editModal={modalEdicao} 
        handleEditModalClose={handleEditModalClose}   
        type={'-'}     
        setCursoEditado={setCursoEditado}     
        cursoParaEditar={cursoParaEditar}
        handleUnselectToEdit={handleUnselectToEdit}
      />
    </AdmDrawer>
  );
};

export default Cursos;