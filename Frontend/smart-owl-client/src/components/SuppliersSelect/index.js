import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

import api from '../../services/api';
import { SnackContext } from '../../contexts/SnackContext';

const SuppliersSelect = (props) => {

  const [suppliers, setSuppliers] = useState([]);
  const history = useHistory();

  const { setSnack } = useContext(SnackContext);

  useEffect(() => {
    async function getSuppliers() {
      try {
        const res = await api.get('/supplier');
        setSuppliers(res.data);        
      } catch(err) {        
        setSnack({ 
          message: 'Ocorreu um erro ao buscar os fornecedores. Caso persista, contate o suporte! ' + err, 
          type: 'error', 
          open: true
        });
        history.push('/cli/dashboard');        
      }
    }
    getSuppliers();   
  }, [history, setSnack]);

  const options = suppliers.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      firstLetter,
      ...option,
    };
  });

  return (
    <>
      <div className="input-block">
        <Autocomplete       
          value={props.value}
          onChange={(event, value) => props.onChange(value)}                          
          options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
          groupBy={(option) => option.firstLetter}
          getOptionLabel={(option) => option.name}  
          getOptionSelected={(option, value) => option.id === props.value.id}                
          renderInput={(params) => <TextField {...params} id="suppliersSelect" 
          label="Fornecedor" variant="outlined" 
          required={props.optional ? false : true}
          />}
        />
      </div>  
    </>
  )
}

export default SuppliersSelect;