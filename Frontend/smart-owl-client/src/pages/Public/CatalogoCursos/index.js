import React, { useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal/Modal';

import PersonIcon from '@material-ui/icons/Person';

import CardLink from '../../../components/CardLink';
import CreateIcon from '@material-ui/icons/Create';
import SecurityIcon from '@material-ui/icons/Security';

import mainLogo from '../../../assets/img/mainLogo.png';
import './index.css';

import api from '../../../services/api';

const CatalogoCursos = () => {

  const [cursos, setCursos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selecionado, setSelecionado] = useState({});

  const handleModalOpen = () => {
    setOpenModal(true);
  }

  const handleModalClose = () => {
    setOpenModal(true);
  }

  const handleSelect = (curso) => {
    setSelecionado(curso);

  }

  const handleUnselect = () => {
    setSelecionado([]);
  }

  useEffect(() => {
    document.title = 'Cursos do IOS | Smart Owl'

    async function getCursos() {
      try {
        const res1 = await api.get('/curso');
        setCursos(res1.data);
      } catch (err) {
        alert('Opa! Deu algo errado aí...' + err.message);
      }
    }
    getCursos();
  }, []); 

  return (
    <div className="chooseModule">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        css={{ height: 35 + 'vh' }}
      >
        <img className="responsive-logo" src={mainLogo} alt="Gest Facil" /> <br/>
        <h4> Cursos Disponíveis </h4>
      </Box>

      <div className="cursos">
        {
          cursos.map(curso => {
            return (
              <button className="card-curso" onClick={() => { 
                handleSelect(curso);             
              }}>{curso.nome}</button>
            )
          })
        }
        
      </div>

      <Modal    
        open={openModal}    
        onClose={() => console.log('a')}
        title={selecionado.nome}
        actions={
          <>
            <PrimaryButton onClick={() => { handleDeleteModalClose(); handleUnselectToDelete() }} color="primary">Cancelar</PrimaryButton>
            <PrimaryButton onClick={handleDelete}>Sim</PrimaryButton>        
          </>
        }
      >
        <p>
          <strong>ATENÇÃO: </strong> está ação é <b>permanente</b> e afetará o valor total de contas a pagar.
        </p>
      </Modal>

    </div>

    
  );
};

export default CatalogoCursos;