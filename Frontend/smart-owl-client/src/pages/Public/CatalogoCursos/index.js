import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import moment from 'moment';

import { 
  CircularProgress ,
  MenuItem,
  TextField,
} from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'

import AdmDrawer from '../../../components/AdmDrawer';
import BackgroundCard from '../../../components/BackgroundCard';
import PrimaryButton from '../../../components/Button';
import BackgroundCardHeader from '../../../components/BackgroundCardHeader';
import IconButton from '../../../components/IconButton'

import Modal from '../../../components/Modal';

import FormCadastroCurso from '../../../components/FormCadastroCurso';

import { HeaderSubtitle, HeaderTitle } from '../../../components/HeaderTitle';
import { SnackContext } from '../../../contexts/SnackContext';

import SelectUnidades from '../../../components/SelectUnidades';

import api from '../../../services/api';


import './index.css';
import useQuery from '../../../contexts/hooks/useQuery';

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      zIndex: theme.zIndex.drawer + 1,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: {
    [theme.breakpoints.down('sm')]: theme.mixins.toolbar,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
    },
  },
  selected: {
    borderRight: '5px solid purple',
  },
}));

const CatalogoCursos = (props) => {

  const classes = useStyles();
  const history = useHistory();

  const query = useQuery();

  const [selecionada, setSelecionada] = useState({});

  const handleSelecionar = (turma) => {
    setSelecionada(turma);
    handleOpenModal();
  }

  const [loading, setLoading] = useState(false);

  const [unidade, setUnidade] = useState(null);
  const handleUnidadeChange = (value) => {
    setUnidade(value);
  }

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  }

  const [turmas, setTurmas]  = useState([]);
  const [buscou, setBuscou] = useState(false);

  const { setSnack } = useContext(SnackContext);

  const handleFilter = async () => {
    try {

      setLoading(true);
      const turmas = await api.get('/turma', { 
        params: {
          unidadeId: unidade.id,          
        }
      });

      setTurmas(turmas.data);
      setBuscou(true);

      setLoading(false);

    } catch (err) {
      setSnack({ 
        message: 'Ocorreu um erro ao buscar as turmas. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });

      console.log(err);
    }
  }

  const handleRedirectToSubscription = (turmaId) => {
    if (query.get('user') === 'true') {
      return history.push(`/inscrever_se?turma=${turmaId}`);
    } else {
      return history.push(`/login?origem=catalogo&turma=${turmaId}`);
    }
  }

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <div className={classes.toolbar} />
          <div className="master-dashboard">                
            <BackgroundCard>
              <HeaderTitle 
                title="Cursos Disponíveis"
                showBackButton
                previousPage="/"
              />

              <HeaderSubtitle/>

              <div className="filter-form-container">
            <form className="filter-form" onSubmit={null} id="filter-form">
              <div className="filter-form-basic">
                <SelectUnidades 
                  value={unidade}
                  onChange={handleUnidadeChange}
                />             
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
                {
                  turmas.length === 0 && buscou ?
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '200px'}}>  
                    <p>Não há turmas disponíveis para a unidade selecionada. ☹️</p>
                  </div>
                  : 
                    buscou && turmas.length !== 0
                    ?
                    
                    <div className="container-turma">
                      {
                        turmas.map(turma => {
                        return (
                          <div className="card-turma" onClick={() => handleSelecionar(turma)}>
                            <h1>{turma.curso.nome}</h1>
                            <h2>({turma.periodo})</h2>                       
                          </div>)
                        })
                      }                                          
                    </div>
                    :
                    ''
                }                               
                </>
              }                                                              
            </BackgroundCard>
            
            {
              Object.keys(selecionada).length !== 0 ?
                <Modal      
                open={openModal}
                onClose={handleCloseModal}
                title={`${selecionada.curso.nome} (${selecionada.periodo})`}
                actions={
                  <>
                    <PrimaryButton onClick={() => { handleCloseModal(); }} color="secondary">Cancelar</PrimaryButton>
                    <PrimaryButton onClick={() => { handleCloseModal(); history.push("/login")}} color="primary">Inscrever-se</PrimaryButton>
                  </>
                }
              >        
                <p><b>Descrição:</b></p>
                <p style={{marginTop: '10px'}}>{selecionada.curso.descricao}</p>

                <p style={{marginTop: '10px'}}><b>Carga Horária:</b> {selecionada.curso.ch}</p>
              
                <p style={{marginTop: '20px'}}><b>Hora de Início:</b> {selecionada.hora_inicio}</p>
                <p><b>Hora de Término:</b> {selecionada.hora_termino}</p>

                <p style={{marginTop: '20px'}}><b>Idade mínima:</b> {selecionada.curso.idade_min === 0 ? 'N/A' : selecionada.curso.idade_min }</p>
                <p><b>Idade máxima:</b> {selecionada.curso.idade_max === 0 ? 'N/A' : selecionada.curso.idade_max }</p>

                <p style={{marginTop: '40px'}}><b>Unidade:</b></p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr'}}>
                  <p><b>{selecionada.unidade.nome}</b> - {selecionada.unidade.rua}, {selecionada.unidade.numero_endereco} - {selecionada.unidade.bairro}, {selecionada.unidade.cidade} - {selecionada.unidade.estado} - {selecionada.unidade.cep} </p>                
                </div>
                <p style={{marginTop: '40px'}}><b>Inscrições até</b> {moment(selecionada.data_encerramento).format("DD/MM/YYYY")}</p>              
              </Modal>
              : ''
            }           
        </div>
      </main>
    </div>
  );
}

export default CatalogoCursos;