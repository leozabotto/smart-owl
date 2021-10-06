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

import ClientDrawer from '../../../../components/ClientDrawer';
import BackgroundCard from '../../../../components/BackgroundCard';
import PrimaryButton from '../../../../components/Button';
import BackgroundCardHeader from '../../../../components/BackgroundCardHeader';
import Modal from '../../../../components/Modal';
import IconButton from '../../../../components/IconButton';

import { SnackContext } from '../../../../contexts/SnackContext';
import DataGridWithTitle from '../../../../components/DataGridWithTitle';

import './index.css';
import api from '../../../../services/api';

const Banks = () => {
  
  const history = useHistory();
  const { setSnack } = useContext(SnackContext);

  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);

  const initialState = {
    activeBanks: [],
    inactiveBanks: [],
  }

  const active = (obj) => obj.active === true;
  const inactive = (obj) => obj.active === false;

  const reducer = (state, action) => {
    switch(action.type) {
      case 'set':
        setLoading(false);
        return { 
          ...state ,
          activeBanks: action.banks.filter(active),
          inactiveBanks: action.banks.filter(inactive),        
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

  const [banks, dispatch] = useReducer(reducer, initialState);

  const handleInactivate = async () => {
    try {
      await api.put(`/client_bank/inactivate/${banks.selected}`);
      setSnack({ 
        message: 'Conta inativada com sucesso!', 
        type: 'success', 
        open: true
      });
      setLoading(true);
      dispatch({ type: 'modalClose' });
      dispatch({ type: 'unselect' });
      setReload(true);
    } catch(err) {        
      setSnack({ 
        message: 'Ocorreu um erro ao inativar a conta. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });
      dispatch({ type: 'modalClose' });
    }
  }

  const handleActivate = async () => {
    try {
      await api.put(`/client_bank/activate/${banks.selected}`);
      setSnack({ 
        message: 'Conta ativada com sucesso!', 
        type: 'success', 
        open: true
      });
      setLoading(true);
      dispatch({ type: 'modalClose' });
      dispatch({ type: 'unselect' });
      setReload(true);
    } catch(err) {        
      setSnack({ 
        message: 'Ocorreu um erro ao ativar o conta. Caso persista, contate o suporte! ' + err, 
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
      renderCell: (bank) => {        
        return (<>
          { bank.row.admin ? '' : 
            <>
            {/*<IconButton onClick={() => {
              return history.push(`/cli/edit_bank/${bank.row.id}`)}
            }>
              <CreateOutlinedIcon />
          </IconButton>*/}      
           { bank.row.active === true
            ?                       
            <IconButton onClick={() => {     
              dispatch({ type: 'select', selected: bank.row.id, method: 'inativar' });
            }}>
              <PowerSettingsNewOutlinedIcon />
            </IconButton>
            :
            <IconButton onClick={() => {     
              dispatch({ type: 'select', selected: bank.row.id, method: 'ativar' });
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
      field: 'name', 
      headerName: 'Nome', 
      width: 250,
      sortable: true,
      renderCell: (bank) => {        
        return `${bank.row.name}`
      }
    },
    { 
      field: 'ag', 
      headerName: 'Agência', 
      width: 100,
      sortable: true,
    },
    { 
      field: 'acc', 
      headerName: 'Conta', 
      width: 150,
      sortable: true,
      renderCell: (bank) => {        
        return `${bank.row.acc}-${bank.row.dig}`
      }
    },
    {
      field: 'initialBalance', 
      headerName: 'Saldo Inicial', 
      width: 250,
      sortable: true,
      renderCell: (bank) => {        
        return `${bank.row.initialBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
      }
    }, 
  ];

  useEffect(() => {
    document.title = 'Contas Bancárias | GestFacil'; 
  }, []);

  useEffect(() => {
    
    async function getBanks() {
      try {
        const banks = await api.get('/client_bank');    
        console.log(banks)
        dispatch({ type: 'set', banks: banks.data, });
        setReload(false);
        setLoading(false);      
      } catch(err) {        
        setSnack({ 
          message: 'Ocorreu um erro ao buscar as contas bancárias. Caso persista, contate o suporte! ' + err, 
          type: 'error', 
          open: true
        });
        history.push('/cli/dashboard');
        setReload(false);
        setLoading(false);
      }
    }
    if (reload) return getBanks();

  }, [history, setSnack, reload]);

  return (
    <ClientDrawer title="Contas Bancárias">
      <div className="master-dashboard">
        <BackgroundCard>        
          <BackgroundCardHeader
            title="Contas Bancárias"
          >
            <Link className="buttonLink" to="/cli/create_bank">
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
                rows={banks.activeBanks}
                title="Contas Ativas"
              />

              <DataGridWithTitle 
                pageSize={20}
                columns={columns}
                rows={banks.inactiveBanks}
                title="Contas Inativas"
              />
            </div>
          }                              
        </BackgroundCard>
      </div>
      <Modal
        open={banks.modalOpen}
        onClose={() => dispatch({ type: 'modalClose'})}
        title={`Você deseja realmente ${banks.method} esta conta?`}
        actions={
          <>
            <PrimaryButton onClick={() => dispatch({ type: 'modalClose'})} color="primary">Cancelar</PrimaryButton>
            <PrimaryButton 
              onClick={banks.method === 'inativar' ? handleInactivate : handleActivate}>
                Sim
            </PrimaryButton>
          </>
        }
      > 
      {
        banks.method === 'inativar'
        ?
        <p>
          <strong>ATENÇÃO: </strong> você não poderá conciliar o extrato desta conta bancária
          até que esteja ativa novamente.
        </p>
        : ''
      }      
      </Modal>
    </ClientDrawer>
  );
};

export default Banks;