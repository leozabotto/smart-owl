import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

import api from '../../services/api';
import { SnackContext } from '../../contexts/SnackContext';

const SelectCursos = (props) => {

  const [cursos, setCursos] = useState([]);
  const history = useHistory();

  const { setSnack } = useContext(SnackContext);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function getCursos() {
      try {
        const res = await api.get('/curso', {
          params: {
            ativo: props.ativo
          }
        });
        setCursos(res.data);       
      } catch(err) {        
        setSnack({ 
          message: 'Ocorreu um erro ao buscar os cursos. Caso persista, contate o suporte! ' + err, 
          type: 'error', 
          open: true
        });
        history.push('/adm/painel');        
      }
    }
    getCursos();   
  }, [history, setSnack]);

  useEffect(() => {
    if (cursos !== null) {
      setOptions(
      cursos.map((option) => {
        const firstLetter = option.nome[0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          firstLetter,
          ...option,
        };
      }));  
    }
    console.log(options)
  }, [cursos])

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
          renderInput={(params) => <TextField {...params} id="SelectCursos" 
          label="Curso" variant="outlined" required={props.optional ? false : true}
          disabled={props.disabled}
          />}          
        />
      </div>  
    </>
  )
}

export default SelectCursos;