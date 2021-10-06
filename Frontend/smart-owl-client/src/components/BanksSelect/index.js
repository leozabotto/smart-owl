import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

import api from '../../services/api';
import { SnackContext } from '../../contexts/SnackContext';

const BanksSelect = (props) => {

  const [banks, setBanks] = useState([]);
  const history = useHistory();

  const { setSnack } = useContext(SnackContext);

  useEffect(() => {
    async function getBanks() {
      try {
        const res = await api.get('/bank');     
        setBanks(res.data);        
      } catch(err) {        
        setSnack({ 
          message: 'Ocorreu um erro ao buscar os bancos. Caso persista, contate o suporte! ' + err, 
          type: 'error', 
          open: true
        });
        history.push('/cli/dashboard');        
      }
    }
    getBanks();   
  }, [history, setSnack]);

  const options = banks.map((option) => {
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
          renderInput={(params) => <TextField {...params} id="BanksSelect" 
          label="Banco" variant="outlined" required />}
          required
        />
      </div>  
    </>
  )
}

export default BanksSelect;