import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router';

import { TextField, MenuItem } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import BackgroundCard from '../../../../components/BackgroundCard';
import ClientDrawer from '../../../../components/ClientDrawer';
import PrimaryButton from '../../../../components/Button';
import { HeaderTitle, HeaderSubtitle } from '../../../../components/HeaderTitle';
import { SnackContext } from '../../../../contexts/SnackContext';

import api from '../../../../services/api';

import './index.css';
import { useParams } from 'react-router-dom';

const CategoriesEdit = () => {

  const [groups, setGroups] = useState([]);
  const { id } = useParams();
  const { setSnack } = useContext(SnackContext);

  const [loading, setLoading] = useState(true);
  const history = useHistory();  

  useEffect(() => {
    document.title = 'Edição de Categoria | GestFacil';
  }, []);

  useEffect(() => {

    async function getCategory() {
      try {
        const res = await api.get(`acc_category/${id}`);        
        if (res.data.category.default) {
          return history.push('/cli/categories');
        }
        dispatch({ type: 'cgName', name: res.data.category.name });   
        dispatch({ type: 'cgGroup', group: res.data.category.category_group.id});       
        setLoading(false);
      } catch (err) {

        if (err.response) {
          setSnack({ 
            message: err.response.data.msg, 
            type: 'error', 
            open: true
          });
        } else {
          setSnack({ 
            message: 'Ocorreu um erro: ' + err, 
            type: 'error', 
            open: true
          });
        }
        
        history.push('/cli/categories');
      }
    }

    async function getGroups() {
      try {
        const response = await api.get('category_group');
        setGroups(response.data);        
        dispatch({ type: 'cgGroup', group: response.data[0].id })
      } catch(err) {        
        setSnack({ 
          message: 'Ocorreu um erro ao buscar os grupos de categorias. Caso persista, contate o suporte! ' + err, 
          type: 'error', 
          open: true
        });
        history.push('/cli/categories');
      }
    }
    
    getGroups();
    getCategory();

  }, [history, setSnack, id]);

  const initialState = {
    name: '',
    categoryGroupId: '',
  }

  const handleSubmit = async (e, form) => {
    try {
      e.preventDefault();
      await api.put(`/acc_category/${id}`, { ...form });      
      dispatch({ type: 'reset' });
      setSnack({ 
        message: 'Categoria atualizada com sucesso!', 
        type: 'success', open: true
      });
      history.push('/cli/categories');
      
    } catch (err) {
      setSnack({ 
        message: 'Falha ao atualizar categoria, contate o suporte. Erro: ' + err.message, 
        type: 'error', 
        open: true
      });
      return false;
    }
  }

  const reducer = (state, action) => {
    switch(action.type) {
      case 'cgName':
        return { ...state, name: action.name };
      case 'cgGroup':
        return { ...state, categoryGroupId: action.group };
      case 'reset':
        return { ...initialState }
      default:
        return state;
    }
  }
  
  const [form, dispatch] = useReducer(reducer, initialState);

  return (
    <ClientDrawer title="Categoria / Edição">
      <BackgroundCard>
        <HeaderTitle
          title="Edição de Categoria"
          subtitle="Atenção: mantenha todos os campos obrigatórios (*) preenchidos."
        />

        <div className="accounting-form-container">
          <form 
            className="accounting-form" 
            method="POST" 
            onSubmit={(e) => handleSubmit(e, form)}>
            <HeaderSubtitle
              title="Dados da Categoria"
            />                       
            {
              loading ?
              <div style=
                {{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    height: '100%',
                    alignContent: 'center',
                    alignItems: 'center',
                }}>
                  <CircularProgress />
              </div>
              :
              <>
              <div className="accounting-form-admin">
                <div className="input-block">
                  <TextField
                    name="name"
                    label="Nome"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.name}
                    onChange={(e) => dispatch(
                      { type: 'cgName', name: e.target.value }
                    )}                  
                    fullWidth
                    required
                  />
                </div>
                <div className="input-block">
                  <TextField
                    select
                    name="categoryGroup"
                    label="Grupo"
                    variant="outlined"                  
                    autoComplete="off"
                    value={form.categoryGroupId}
                    onChange={(e) => dispatch(
                      { type: 'cgGroup', group: e.target.value }
                    )}          
                    fullWidth
                    required
                  >                   
                    {Object.keys(groups).map(key => {
                      return (
                        <MenuItem 
                          key={`${groups[key].id}`} 
                          value={`${groups[key].id}`}
                        >
                          {`${groups[key].name}`}
                        </MenuItem>
                      )
                    })}                                                    
                  </TextField> 
                </div>              
              </div>
              <div className="accounting-form-button">
                <PrimaryButton size="large" variant="contained" type="submit">
                  Atualizar
                </PrimaryButton>
              </div>
              </>
            }            
          </form>
        </div>
      </BackgroundCard>
    </ClientDrawer>
  );
};

export default CategoriesEdit;