import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

import api from '../../services/api';
import { SnackContext } from '../../contexts/SnackContext';

const SelectUnidades = (props) => {

  const [unidades, setUnidades] = useState([]);
  const history = useHistory();

  const { setSnack } = useContext(SnackContext);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function getUnidades() {
      try {
        const res = await api.get('/unidade', {
          params: {
            ativo: props.ativo
          }
        });
        setUnidades(res.data);       
      } catch(err) {        
        setSnack({ 
          message: 'Ocorreu um erro ao buscar as unidades. Caso persista, contate o suporte! ' + err, 
          type: 'error', 
          open: true
        });
        history.push('/adm/painel');        
      }
    }
    getUnidades();   
  }, [history, setSnack]);

  useEffect(() => {
    if (unidades !== null) {
      setOptions(
      unidades.map((option) => {
        const firstLetter = option.nome[0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          firstLetter,
          ...option,
        };
      }));  
    }
    console.log(options)
  }, [unidades])

  return (
    <>
      <div className="input-block">
        <Autocomplete       
          value={props.value}
          onChange={(event, value) => props.onChange(value)}                          
          options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
          groupBy={(option) => option.firstLetter}
          getOptionLabel={(option) => option.nome}  
          getOptionSelected={(option, value) => option.id === props.value.id}                
          renderInput={(params) => <TextField {...params} id="selectUnidades" 
          label="Unidade" variant="outlined" required={props.optional ? false : true} 
          disabled={props.disabled}
          />}          
        />
      </div>  
    </>
  )
}

export default SelectUnidades;