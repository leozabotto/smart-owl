import React, { useContext, useEffect, useState, useReducer } from 'react';
import { Link, useHistory } from 'react-router-dom';

import AddIcon from '@material-ui/icons/Add';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import PrintIcon from '@material-ui/icons/PrintOutlined';
//import DeleteOutlinedIcon
//from '@material-ui/icons/DeleteOutlined';
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

const CategoriesList = () => {
  
  const history = useHistory();
  const { setSnack } = useContext(SnackContext);

  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);

  const initialState = {
    receitasOp: [],
    receitasNop: [],
    despesasOp: [],
    despesasNop: [],
    ativosImob: [],
    modalOpen: false,
    selected: ''
  }

  const isReceitaOp = (obj) => obj.categoryGroupId === '197d06f4-f632-47dc-8940-3b83f5182d41';
  const isReceitaNop = (obj) => obj.categoryGroupId === 'f24be241-d1ab-4fe1-b5ec-2604e926f69f';
  const isDespesaOp = (obj) => obj.categoryGroupId === '23aea284-7446-4795-b05f-281c76ea1b14';
  const isDespesaNop = (obj) => obj.categoryGroupId === '5fde7cf8-9ead-4f1b-a33e-649a57848e6d';
  const isAtivoImob = (obj) => obj.categoryGroupId === '780247f6-a6e1-4efb-a288-693d9f82a7cb';

  const reducer = (state, action) => {
    switch(action.type) {
      case 'set':
        setLoading(false);
        return { 
          ...state ,
          receitasOp: action.categories.filter(isReceitaOp),
          receitasNop: action.categories.filter(isReceitaNop),
          despesasOp: action.categories.filter(isDespesaOp),
          despesasNop: action.categories.filter(isDespesaNop),
          ativosImob: action.categories.filter(isAtivoImob),
        }
      case 'select':
        return {
          ...state,
          selected: action.selected,
          modalOpen: true
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

  const [categories, dispatch] = useReducer(reducer, initialState);

  const handleInactivate = async () => {
    try {
      await api.delete(`client_category/${categories.selected}`);
      setSnack({ 
        message: 'Categoria excluída com sucesso!', 
        type: 'success', 
        open: true
      });
      setLoading(true);
      dispatch({ type: 'modalClose' });
      dispatch({ type: 'unselect' });
      setReload(true);
    } catch(err) {        
      setSnack({ 
        message: 'Ocorreu um erro excluir a categoria. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });
      dispatch({ type: 'modalClose' });
    }
  }
  
  const columns = [  
    { 
      field: 'name', 
      headerName: 'Nome', 
      width: 300,
      sortable: false,
    },    
    { 
      field: 'actions', 
      headerName: 'Ações', 
      width: 100,
      sortable: false,
      renderCell: (category) => {        
        return (<>           
          {
            !category.row.default
            ?
            <>
            <IconButton onClick={() => {
              return history.push(`/cli/edit_category/${category.row.id}`)}
             }>
               <CreateOutlinedIcon />
            </IconButton>
            {/* <IconButton onClick={() => {     
              dispatch({ type: 'select', selected: category.row.id });
            }}>
              <DeleteOutlinedIcon />
            </IconButton> */}
            </>
            :
            ''           
          }
        </>)
      }
    }
  ];

  useEffect(() => {
    document.title = 'Categorias | GestFacil'; 
  }, []);

  useEffect(() => {
    
    async function getCategories() {
      try {
          
        const res = await api.get('/acc_category');    
        const defaultCategories = res.data.defaultCategories;
        const clientCategories = res.data.clientCategories;
        dispatch(
          { type: 'set', 
          categories: defaultCategories.concat(clientCategories), 
        });
        setReload(false);
        setLoading(false);
      } catch(err) {        
        setSnack({ 
          message: 'Ocorreu um erro ao buscar as categorias. Caso persista, contate o suporte! ' + err, 
          type: 'error', 
          open: true
        });
        history.push('/cli/dashboard');
        setReload(false);
        setLoading(false);
      }
    }
    if (reload) return getCategories();

  }, [history, setSnack, reload]);

  return (

    <ClientDrawer title="Categorias">
      <div className="master-dashboard">
        <BackgroundCard>        
          <BackgroundCardHeader
            title="Categorias"
          >
            <Link className="buttonLink" to="/cli/create_category">
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

            <div className="data-grid-categories">
              <DataGridWithTitle 
                pageSize={20}
                columns={columns}
                rows={categories.receitasOp}
                title="Receitas Operacionais"
              />

              <DataGridWithTitle 
              pageSize={20}
              columns={columns}
              rows={categories.receitasNop}
              title="Receitas Não Operacionais"
              />

              <DataGridWithTitle 
                pageSize={20}
                columns={columns}
                rows={categories.despesasOp}
                title="Despesas Operacionais"
              />

              <DataGridWithTitle 
                pageSize={20}
                columns={columns}
                rows={categories.despesasNop}
                title="Despesas Não Operacionais"
              />
            
              <DataGridWithTitle 
                pageSize={20}
                columns={columns}
                rows={categories.ativosImob}
                title="Ativos Imobilizados"
              />
            </div>
          }                              
        </BackgroundCard>
      </div>
      <Modal
        open={categories.modalOpen}
        onClose={() => dispatch({ type: 'modalClose'})}
        title={`Você deseja realmente excluir esta categoria?`}
        actions={
          <>
            <PrimaryButton onClick={() => dispatch({ type: 'modalClose'})} color="primary">Cancelar</PrimaryButton>
            <PrimaryButton onClick={handleInactivate}>Sim</PrimaryButton>
          </>
        }
      >
        <p>
          Esta ação é permanente. Caso pretenda utilizar esta categoria no futuro, 
          recomendamos que não a exclua.
        </p>
        <br/>
        <p>
          <strong>ATENÇÃO: </strong> isto não afetará as contas cadastradas no
          sistema, porém você não poderá filtrar contas a partir desta categoria.
        </p>
      </Modal>
    </ClientDrawer>
  );
};

export default CategoriesList;