import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

import api from '../../services/api';
import { SnackContext } from '../../contexts/SnackContext';

const CategoriesSelect = (props) => {

  const [categories, setCategories] = useState([]);
  const history = useHistory();

  const { setSnack } = useContext(SnackContext);

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await api.get('/acc_category');
        
        const client = res.data.clientCategories;
        const defaultC = res.data.defaultCategories;
       
        
        const categories = client.concat(defaultC);
        setCategories(categories);
      } catch(err) {        
        setSnack({ 
          message: 'Ocorreu um erro ao buscar as categorias. Caso persista, contate o suporte! ' + err, 
          type: 'error', 
          open: true
        });
        history.push('/cli/dashboard');        
      }
    }
    getCategories();   
  }, [history, setSnack]);

  const getCategoryGroup = (categoryGroupId) => {
    if(categoryGroupId === '197d06f4-f632-47dc-8940-3b83f5182d41') return 'Receita Operacional';
    if(categoryGroupId === 'f24be241-d1ab-4fe1-b5ec-2604e926f69f') return 'Receita Não Operacional';
    if(categoryGroupId === '23aea284-7446-4795-b05f-281c76ea1b14') return 'Despesa Operacional';
    if(categoryGroupId === '5fde7cf8-9ead-4f1b-a33e-649a57848e6d') return 'Despesa Não Operacional';
    if(categoryGroupId === '780247f6-a6e1-4efb-a288-693d9f82a7cb') return 'Ativo Imobilizado';
  }

  const options = categories.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    const categoryGroup = getCategoryGroup(option.categoryGroupId);
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      categoryGroup,
      ...option,
    };
  });

  return (
    <>
      <div className="input-block">
        <Autocomplete       
          value={props.value}
          onChange={(event, value) => props.onChange(value)}                          
          options={options.sort((a, b) => -b.categoryGroup.localeCompare(a.categoryGroup))}
          groupBy={(option) => option.categoryGroup}
          getOptionLabel={(option) => option.name}  
          getOptionSelected={(option, value) => option.id === props.value.id}                
          renderInput={(params) => <TextField {...params} id="categorySelect" 
          label="Categoria" variant="outlined" required />}
          required
        />
      </div>  
    </>
  )
}

export default CategoriesSelect;