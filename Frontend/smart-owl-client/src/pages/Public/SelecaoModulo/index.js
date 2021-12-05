import React, { useEffect } from 'react';

import Box from '@material-ui/core/Box';

import PersonIcon from '@material-ui/icons/Person';

import CardLink from '../../../components/CardLink';
import CreateIcon from '@material-ui/icons/Create';
import SecurityIcon from '@material-ui/icons/Security';

import mainLogo from '../../../assets/img/mainLogo.png';
import './index.css';

const SelecaoModulo = () => {

  useEffect(() => {
    document.title = 'Smart Owl'
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
        <img className="responsive-logo" src={mainLogo} alt="Gest Facil" />
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >        
        <CardLink link="/cursos" icon={<CreateIcon />}>
          Cursos
        </CardLink>

        <CardLink link="/login" icon={<PersonIcon />}>
          Área do Candidato
        </CardLink>

        <CardLink link="/adm/login" icon={<SecurityIcon />}>
          Administração
        </CardLink>       
      </Box>
    </div>
  );
};

export default SelecaoModulo;