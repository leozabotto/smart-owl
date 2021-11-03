import React, { useState } from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import { 
  CircularProgress  
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

import { HeaderSubtitle } from '../../../components/HeaderTitle';
import { SnackContext } from '../../../contexts/SnackContext';



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

  const [loading, setLoading] = useState(true);

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <div className={classes.toolbar} />
          <div className="master-dashboard">                
            <BackgroundCard>
              <BackgroundCardHeader title="Cursos Disponíveis" showBackBtn>
                { /*processandoRelatorio*/ false ?
                <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress />
                </div>
                :
                <>                                                          
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
               
                </>
              }                                                              
            </BackgroundCard>
        </div>
      </main>
    </div>
  );
}

export default CatalogoCursos;