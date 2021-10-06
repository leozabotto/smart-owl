import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

import api from '../../services/api';
import { SnackContext } from '../../contexts/SnackContext';

const CustomersSelect = (props) => {

  const [customers, setCustomers] = useState([]);
  const history = useHistory();

  const { setSnack } = useContext(SnackContext);

  useEffect(() => {
    async function getCustomers() {
      try {
        const res = await api.get('/customer');
        setCustomers(res.data);        
      } catch(err) {        
        setSnack({ 
          message: 'Ocorreu um erro ao buscar os clientes. Caso persista, contate o suporte! ' + err, 
          type: 'error', 
          open: true
        });
        history.push('/cli/dashboard');        
      }
    }
    getCustomers();   
  }, [history, setSnack]);

  const options = customers.map((option) => {
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
          renderInput={(params) => <TextField {...params} id="customersSelect" 
          label="Cliente" variant="outlined" required={props.optional ? false : true} />}          
        />
      </div>  
    </>
  )
}

export default CustomersSelect;