import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import PrimaryButton from '../../../components/Button';

import './index.css';

import owl from '../../../assets/img/owl.png';

const NotFound = () => {

  useEffect(() => {
    document.title = 'GestFacil | Seleção de Módulo'
  }, [])

  return (
    
    <div className="notfound">
       <Box
        display="flex"
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <img className="responsive-logo" src={owl} alt="Gest Facil" />
      </Box>

    
      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <h2>Página não encontrada</h2>

      </Box>


      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <p>A página que você tentou acessar não existe ou foi removida.</p>

      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="flex-end"
        alignItems="flex-end"
      >
      <Link to="/"><PrimaryButton variant="contained" startIcon={<ArrowBackIcon />}>Voltar ao início</PrimaryButton></Link>

      </Box>
    </div>
  );
};


export default NotFound;