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

import AccountingDrawer from '../../../components/AccountingDrawer';
import BackgroundCard from '../../../components/BackgroundCard';
import PrimaryButton from '../../../components/Button';
import BackgroundCardHeader from '../../../components/BackgroundCardHeader';
import Modal from '../../../components/Modal';
import IconButton from '../../../components/IconButton';

import { SnackContext } from '../../../contexts/SnackContext';
import DataGridWithTitle from '../../../components/DataGridWithTitle';

import './index.css';
import api from '../../../services/api';

const Operators = () => {
  
  const history = useHistory();
  const { setSnack } = useContext(SnackContext);

  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);

  const initialState = {
    activeOperators: [],
    inactiveOperators: [],
  }

  const active = (obj) => obj.active === "1";
  const inactive = (obj) => obj.active === "0";

  const reducer = (state, action) => {
    switch(action.type) {
      case 'set':
        setLoading(false);
        return { 
          ...state ,
          activeOperators: action.operators.filter(active),
          inactiveOperators: action.operators.filter(inactive),        
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

  const [operators, dispatch] = useReducer(reducer, initialState);
  const [customers, dispatch2] = useReducer(reducer, initialState);

  const handleInactivate = async () => {
    try {
      await api.put(`/accounting_user/inactivate/${operators.selected}`);
      setSnack({ 
        message: 'Operador inativado com sucesso!', 
        type: 'success', 
        open: true
      });
      setLoading(true);
      dispatch({ type: 'modalClose' });
      dispatch({ type: 'unselect' });
      setReload(true);
    } catch(err) {        
      setSnack({ 
        message: 'Ocorreu um erro ao inativar o operador. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });
      dispatch({ type: 'modalClose' });
    }
  }

  const handleActivate = async () => {
    try {
      await api.put(`/accounting_user/activate/${operators.selected}`);
      setSnack({ 
        message: 'Operador ativado com sucesso!', 
        type: 'success', 
        open: true
      });
      setLoading(true);
      dispatch({ type: 'modalClose' });
      dispatch({ type: 'unselect' });
      setReload(true);
    } catch(err) {        
      setSnack({ 
        message: 'Ocorreu um erro ao ativar o operador. Caso persista, contate o suporte! ' + err, 
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
      renderCell: (operator) => {        
        return (<>
          { operator.row.admin ? '' : 
            <>
            <IconButton onClick={() => {
              return history.push(`/acc/edit_operator/${operator.row.id}`)}
            }>
              <CreateOutlinedIcon />
            </IconButton>         
           { operator.row.active === "1"
            ?                       
            <IconButton onClick={() => {     
              dispatch({ type: 'select', selected: operator.row.id, method: 'inativar' });
            }}>
              <PowerSettingsNewOutlinedIcon />
            </IconButton>
            :
            <IconButton onClick={() => {     
              dispatch({ type: 'select', selected: operator.row.id, method: 'ativar' });
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
      renderCell: (operator) => {        
        return `${operator.row.name} ${operator.row.lastName}`
      }
    },
    { 
      field: 'email', 
      headerName: 'E-mail', 
      width: 250,
      sortable: true,
      renderCell: (operator) => {        
        return `${operator.row.email}`
      }
    }, 
  ];

  useEffect(() => {
    document.title = 'Operadores | GestFacil'; 
  }, []);

  useEffect(() => {
    
    const token = jwtDecode(localStorage.getItem('token'));

    async function getOperators() {
      try {
        const operators = await api.get('/accounting_user');    
        dispatch({ type: 'set', operators: operators.data, });
        setReload(false);
        setLoading(false);      
      } catch(err) {        
        setSnack({ 
          message: 'Ocorreu um erro ao buscar os Operadores. Caso persista, contate o suporte! ' + err, 
          type: 'error', 
          open: true
        });
        history.push('/acc/dashboard');
        setReload(false);
        setLoading(false);
      }
    }
    if (reload) return getOperators();

  }, [history, setSnack, reload]);

  return (

    <AccountingDrawer title="Operadores">
      <div className="master-dashboard">
        <BackgroundCard>        
          <BackgroundCardHeader
            title="Operadores"
          >
            <Link className="buttonLink" to="/acc/create_operator">
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
                rows={operators.activeOperators}
                title="Operadores Ativos"
              />

              <DataGridWithTitle 
                pageSize={20}
                columns={columns}
                rows={operators.inactiveOperators}
                title="Operadores Inativos"
              />
            </div>
          }                              
        </BackgroundCard>
      </div>
      <Modal
        open={operators.modalOpen}
        onClose={() => dispatch({ type: 'modalClose'})}
        title={`Você deseja realmente ${operators.method} este operador?`}
        actions={
          <>
            <PrimaryButton onClick={() => dispatch({ type: 'modalClose'})} color="primary">Cancelar</PrimaryButton>
            <PrimaryButton 
              onClick={operators.method === 'inativar' ? handleInactivate : handleActivate}>
                Sim
            </PrimaryButton>
          </>
        }
      > 
      {
        operators.method === 'inativar'
        ?
        <p>
          <strong>ATENÇÃO: </strong> isto o impedirá de acessar o sistema até 
          que seja ativado novamente.
        </p>
        : ''
      }      
      </Modal>
    </AccountingDrawer>
  );
};

export default Operators;