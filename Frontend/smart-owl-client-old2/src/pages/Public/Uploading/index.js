import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import PrimaryButton from '../../../components/Button';

import './index.css';

import mainLogo from '../../../assets/img/logo-small.png';

const Uploading = () => {

  useEffect(() => {
    document.title = 'GestFacil | Página em Desenvolvimento'
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
        <img className="responsive-logo" src={mainLogo} alt="Gest Facil" />
      </Box>

    
      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <h2>ATUALIZAÇÃO EM ANDAMENTO</h2>

      </Box>


      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <p>A página que você tentou acessar ainda está sendo disponibilizada.</p> <br />
        

      </Box>
      <p>Por enquanto, sinta-se à vontade para utilizar as outras funcionalidades do sistema! 😉</p>

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


export default Uploading;