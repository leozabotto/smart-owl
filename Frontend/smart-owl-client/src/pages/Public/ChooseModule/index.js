import React, { useEffect } from 'react';

import Box from '@material-ui/core/Box';

import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';

import CardLink from '../../../components/CardLink';

import mainLogo from '../../../assets/img/smart-owl-logo.png';
import './index.css';

const ChooseModule = () => {

  useEffect(() => {
    document.title = 'Seleção de Módulo | Smart Owl'
  }, [])

  return (
    <div className="chooseModule">
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        css={{ height: 35 + 'vh' }}
      >
        <img className="responsive-logo" src={mainLogo} alt="Smart Owl" />
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <CardLink link="/pub/login" icon={<PersonIcon/>}>
          Candidato
        </CardLink>

        <CardLink link="/adm/login" icon={<LockIcon/>}>
          Administração
        </CardLink>
      </Box>
    </div>
  );
};

export default ChooseModule;