import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import PrimaryButton from '../../../components/PrimaryButton';

import './index.css';

import smartOwlLogo from '../../../assets/img/smart-owl-logo.png';

const InDevelopment = () => {

  useEffect(() => {
    document.title = 'Em desenvolvimento | Smart Owl'
  }, [])

  return (
    
    <div className="in-development">
       <Box
        display="flex"
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <img className="responsive-logo" src={smartOwlLogo} alt="Smart Owl" />
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <h2>Página em Desenvolvimento</h2>
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <p>
          Poxa! A página que você tentou acessar ainda não está disponível. :/ 
        </p>
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="flex-end"
        alignItems="flex-end"
      >
        <Link to="/">
          <PrimaryButton variant="contained" startIcon={<ArrowBackIcon />}>
            Voltar ao início
          </PrimaryButton>
        </Link>
      </Box>
    </div>

  );
};

export default InDevelopment;