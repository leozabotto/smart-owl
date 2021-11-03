import React, { useContext, useState } from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';

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

import FormCadastroCurso from '../../../components/FormCadastroCurso';

import { HeaderSubtitle, HeaderTitle } from '../../../components/HeaderTitle';
import { SnackContext } from '../../../contexts/SnackContext';

import SelectUnidades from '../../../components/SelectUnidades';

import api from '../../../services/api';


import './index.css';

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
  const theme = useTheme();

  const [loading, setLoading] = useState(false);

  const [unidade, setUnidade] = useState(null);
  const handleUnidadeChange = (value) => {
    setUnidade(value);
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
                      <div className="card-turma">
                        <h1>Título (Período)</h1>
                        <p><b>Início:</b></p>
                        <p><b>Fim:</b></p>
                      </div>
                      <div className="card-turma">
                        <h1>Título (Período)</h1>
                        <p><b>Início:</b></p>
                        <p><b>Fim:</b></p>
                      </div>
                      <div className="card-turma">
                        <h1>Título (Período)</h1>
                        <p><b>Início:</b></p>
                        <p><b>Fim:</b></p>
                      </div>
                      <div className="card-turma">
                        <h1>Título (Período)</h1>
                        <p><b>Início:</b></p>
                        <p><b>Fim:</b></p>
                      </div>
                    </div>



                    :
                    ''
                }
                

               
                </>
              }                                                              
            </BackgroundCard>
        </div>
      </main>
    </div>
  );
}

export default CatalogoCursos;