import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';

import './index.css';

import smartOwlLogo from '../../../assets/img/smart-owl-logo.png';

const ChooseModule = (props) => {

  useEffect(() => {
    document.title = "Seleção de Módulo | Smart Owl"
  })

  return (
    <>
      <div className="choose-module">       
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          css={{ height: 35 + 'vh' }}
        >
          <img className="responsive-logo" src={smartOwlLogo} alt="SmartOwl" />
        </Box>

        <Box
          display="flex"
          flexWrap="wrap"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <Link to="/pub/login" className="card-link">            
            <div className="card-link-icon">
              <PersonIcon />
            </div>
            <p>Candidato</p>          
          </Link>

          <Link to="/adm/login" className="card-link">            
            <div className="card-link-icon">
              <LockIcon />
            </div>
            <p>Administração</p>          
          </Link>                
        </Box>               
      </div>
    </>
  )
}

export default ChooseModule;