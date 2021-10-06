import React, { useContext, useEffect, useState, useReducer } from 'react';
import { Link, useHistory } from 'react-router-dom';

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

const Suppliers = () => {
  
  const history = useHistory();
  const { setSnack } = useContext(SnackContext);

  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);

  const initialState = {
    activeSuppliers: [],
    inactiveSuppliers: [],
  }

  const active = (obj) => obj.active === true;
  const inactive = (obj) => obj.active === false;

  const reducer = (state, action) => {
    switch(action.type) {
      case 'set':
        setLoading(false);
        return { 
          ...state ,
          activeSuppliers: action.suppliers.filter(active),
          inactiveSuppliers: action.suppliers.filter(inactive),        
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

  const [suppliers, dispatch] = useReducer(reducer, initialState);

  const handleInactivate = async () => {
    try {
      await api.put(`supplier/inactivate/${suppliers.selected}`);
      setSnack({ 
        message: 'Fornecedor inativado com sucesso!', 
        type: 'success', 
        open: true
      });
      setLoading(true);
      dispatch({ type: 'modalClose' });
      dispatch({ type: 'unselect' });
      setReload(true);
    } catch(err) {        
      setSnack({ 
        message: 'Ocorreu um erro ao inativar. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });
      dispatch({ type: 'modalClose' });
    }
  }

  const handleActivate = async () => {
    try {
      await api.put(`supplier/activate/${suppliers.selected}`);
      setSnack({ 
        message: 'Fornecedor ativado com sucesso!', 
        type: 'success', 
        open: true
      });
      setLoading(true);
      dispatch({ type: 'modalClose' });
      dispatch({ type: 'unselect' });
      setReload(true);
    } catch(err) {        
      setSnack({ 
        message: 'Ocorreu um erro ao ativar. Caso persista, contate o suporte! ' + err, 
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
      renderCell: (supplier) => {        
        return (<>  
          <IconButton onClick={() => {
            return history.push(`/cli/edit_supplier/${supplier.row.id}`)}
          }>
            <CreateOutlinedIcon />
          </IconButton>         
          {
            supplier.row.active
            ?                       
            <IconButton onClick={() => {     
              dispatch({ type: 'select', selected: supplier.row.id, method: 'inativar' });
            }}>
              <PowerSettingsNewOutlinedIcon />
            </IconButton>
            :
            <IconButton onClick={() => {     
              dispatch({ type: 'select', selected: supplier.row.id, method: 'ativar' });
            }}>
              <WbIncandescentIcon />
            </IconButton>           
          }
        </>)
      }
    },
    { 
      field: 'name', 
      headerName: 'Nome', 
      width: 250,
      sortable: true,
    }, 
    { 
      field: 'cpfCnpj', 
      headerName: 'CPF/CNPJ', 
      width: 200,
      sortable: false,
    }, 
    { 
      field: 'type', 
      headerName: 'Tipo', 
      width: 100,
      sortable: true,
    },  
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 300,
      sortable: true,
    }        
  ];

  useEffect(() => {
    document.title = 'Fornecedores | GestFacil'; 
  }, []);

  useEffect(() => {
    
    async function getSuppliers() {
      try {
        const suppliers = await api.get('/supplier');        
        dispatch({ type: 'set', suppliers: suppliers.data, });
        setReload(false);
        setLoading(false);
      } catch(err) {        
        setSnack({ 
          message: 'Ocorreu um erro ao buscar os Fornecedores. Caso persista, contate o suporte! ' + err, 
          type: 'error', 
          open: true
        });
        history.push('/cli/dashboard');
        setReload(false);
        setLoading(false);
      }
    }
    if (reload) return getSuppliers();

  }, [history, setSnack, reload]);

  return (

    <ClientDrawer title="Fornecedores">
      <div className="master-dashboard">
        <BackgroundCard>        
          <BackgroundCardHeader
            title="Fornecedores"
          >
            <Link className="buttonLink" to="/cli/create_supplier">
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
                rows={suppliers.activeSuppliers}
                title="Fornecedores Ativos"
              />

              <DataGridWithTitle 
                pageSize={20}
                columns={columns}
                rows={suppliers.inactiveSuppliers}
                title="Fornecedores Inativos"
              />
            </div>
          }                              
        </BackgroundCard>
      </div>
      <Modal
        open={suppliers.modalOpen}
        onClose={() => dispatch({ type: 'modalClose'})}
        title={`Você deseja realmente ${suppliers.method} este fornecedor?`}
        actions={
          <>
            <PrimaryButton onClick={() => dispatch({ type: 'modalClose'})} color="primary">Cancelar</PrimaryButton>
            <PrimaryButton 
              onClick={suppliers.method === 'inativar' ? handleInactivate : handleActivate}>
                Sim
            </PrimaryButton>
          </>
        }
      > 
      {
        suppliers.method === 'inativar'
        ?
        <p>
          <strong>ATENÇÃO: </strong> isto não afetará as contas cadastradas a pagar já
          vinculadas a ele.
        </p>
        : ''
      }      
      </Modal>
    </ClientDrawer>
  );
};

export default Suppliers;