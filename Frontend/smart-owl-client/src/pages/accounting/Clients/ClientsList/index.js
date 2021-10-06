import React, { useContext, useEffect, useState, useReducer } from 'react';
import { Link, useHistory } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import AddIcon from '@material-ui/icons/Add';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import PrintIcon from '@material-ui/icons/PrintOutlined';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescentOutlined';
import PowerSettingsNewOutlinedIcon 
from '@material-ui/icons/PowerSettingsNewOutlined';
import { Skeleton } from '@material-ui/lab';

import AccountingDrawer from '../../../../components/AccountingDrawer';
import BackgroundCard from '../../../../components/BackgroundCard';
import PrimaryButton from '../../../../components/Button';
import BackgroundCardHeader from '../../../../components/BackgroundCardHeader';
import Modal from '../../../../components/Modal';
import IconButton from '../../../../components/IconButton';

import { SnackContext } from '../../../../contexts/SnackContext';
import DataGridWithTitle from '../../../../components/DataGridWithTitle';

import './index.css';
import api from '../../../../services/api';

const Clients = () => {
  
  const history = useHistory();
  const { setSnack } = useContext(SnackContext);

  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);

  const initialState = {
    activeClients: [],
    inactiveClients: [],
  }

  const active = (obj) => obj.active === true;
  const inactive = (obj) => obj.active ===  false;

  const reducer = (state, action) => {
    switch(action.type) {
      case 'set':
        setLoading(false);
        return { 
          ...state ,
          activeClients: action.clients.filter(active),
          inactiveClients: action.clients.filter(inactive),        
        }
      case 'select':
        return {
          ...state,
          selected: action.selected,
          modalOpen: true,
          method: action.method
        }
      case 'unselect':
        return {
          ...state,
          selected: false
        }
      case 'modalOpen':
        return {
          ...state,
          modalOpen: true
        }
      case 'modalClose':
        return {
          ...state,
          modalOpen: false,
          logging: true
        }
      default:
        return { ...state } 
    }
  }

  const [clients, dispatch] = useReducer(reducer, initialState);

  const handleInactivate = async () => {
    try {
      await api.put(`/client/inactivate/${clients.selected}`);
      setSnack({ 
        message: 'Cliente inativado com sucesso!', 
        type: 'success', 
        open: true
      });
      setLoading(true);
      dispatch({ type: 'modalClose' });
      dispatch({ type: 'unselect' });
      setReload(true);
    } catch(err) {        
      setSnack({ 
        message: 'Ocorreu um erro ao inativar o cliente. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });
      dispatch({ type: 'modalClose' });
    }
  }

  const handleActivate = async () => {
    try {
      await api.put(`/client/activate/${clients.selected}`);
      setSnack({ 
        message: 'Cliente ativado com sucesso!', 
        type: 'success', 
        open: true
      });
      setLoading(true);
      dispatch({ type: 'modalClose' });
      dispatch({ type: 'unselect' });
      setReload(true);
    } catch(err) {        
      setSnack({ 
        message: 'Ocorreu um erro ao ativar o cliente. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });
      dispatch({ type: 'modalClose' });
    }
  }
  
  const columns = [      
    { 
      field: 'actions', 
      headerName: 'Ações', 
      width: 100,
      sortable: false,
      renderCell: (client) => {        
        return (<>
          { client.row.admin ? '' : 
            <>
            <IconButton onClick={() => {
              return history.push(`/acc/edit_client/${client.row.id}`)}
            }>
              <CreateOutlinedIcon />
            </IconButton>         
           { client.row.active === true
            ?                       
            <IconButton onClick={() => {     
              dispatch({ type: 'select', selected: client.row.id, method: 'inativar' });
            }}>
              <PowerSettingsNewOutlinedIcon />
            </IconButton>
            :
            <IconButton onClick={() => {     
              dispatch({ type: 'select', selected: client.row.id, method: 'ativar' });
            }}>
              <WbIncandescentIcon />
            </IconButton>
          }
          </>          
          }
        </>)
      }
    },
    { 
      field: 'tradingName', 
      headerName: 'Razão Social', 
      width: 250,
      sortable: true,
    },
    { 
      field: 'cpfCnpj', 
      headerName: 'CPF/CNPJ', 
      width: 200,
      sortable: true,
    }, 
    { 
      field: 'mainPhone', 
      headerName: 'Telefone', 
      width: 150,
      sortable: true,
    }, 
    { 
      field: 'email', 
      headerName: 'E-mail', 
      width: 250,
      sortable: true,
    }, 
    { 
      field: 'ownerName', 
      headerName: 'Proprietário', 
      width: 150,
      sortable: true,
    }, 
  ];

  useEffect(() => {
    document.title = 'Clientes | GestFacil'; 
  }, []);

  useEffect(() => {
    
    const token = jwtDecode(localStorage.getItem('token'));

    async function getClients() {
      try {
        const clients = await api.get('/client');    
        dispatch({ type: 'set', clients: clients.data, });
        setReload(false);
        setLoading(false);      
      } catch(err) {        
        setSnack({ 
          message: 'Ocorreu um erro ao buscar os Clientes. Caso persista, contate o suporte! ' + err, 
          type: 'error', 
          open: true
        });
        history.push('/acc/dashboard');
        setReload(false);
        setLoading(false);
      }
    }
    if (reload) return getClients();

  }, [history, setSnack, reload]);

  return (

    <AccountingDrawer title="Clientes">
      <div className="master-dashboard">
        <BackgroundCard>        
          <BackgroundCardHeader
            title="Clientes"
          >
            <Link className="buttonLink" to="/acc/create_client">
              <PrimaryButton variant="contained" size="large">
                <AddIcon />
              </PrimaryButton>
              <PrimaryButton variant="contained" size="large" disabled>
                <PrintIcon />
            </PrimaryButton>
            </Link>
          </BackgroundCardHeader>
                     
          { (loading) 

            ?              

            <div style={{ 
              marginTop: '40px'
            }}>
              {[1, 2, 3, 4, 5, 6].map((n) =>
                <Skeleton 
                  key={n} 
                  animation="wave" 
                  width="auto" 
                  height="65px" 
                  variant="rect" 
                  style={{ marginTop: 5 }} 
                />
              )}
            </div>
            
            :

            <div className="data-grid">
              <DataGridWithTitle 
                pageSize={20}
                columns={columns}
                rows={clients.activeClients}
                title="Clientes Ativos"
              />

              <DataGridWithTitle 
                pageSize={20}
                columns={columns}
                rows={clients.inactiveClients}
                title="Clientes Inativos"
              />
            </div>
          }                              
        </BackgroundCard>
      </div>
      <Modal
        open={clients.modalOpen}
        onClose={() => dispatch({ type: 'modalClose'})}
        title={`Você deseja realmente ${clients.method} este cliente?`}
        actions={
          <>
            <PrimaryButton onClick={() => dispatch({ type: 'modalClose'})} color="primary">Cancelar</PrimaryButton>
            <PrimaryButton 
              onClick={clients.method === 'inativar' ? handleInactivate : handleActivate}>
                Sim
            </PrimaryButton>
          </>
        }
      > 
      {
        clients.method === 'inativar'
        ?
        <p>
          <strong>ATENÇÃO: </strong> isto o impedirá de acessar o sistema até 
          que seja ativado novamente. As contas e os arquivos enviados por ele não serão afetadas.
        </p>
        : ''
      }      
      </Modal>
    </AccountingDrawer>
  );
};

export default Clients;