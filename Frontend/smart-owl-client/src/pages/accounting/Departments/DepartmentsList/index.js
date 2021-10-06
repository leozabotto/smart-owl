import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

//Material UI
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, makeStyles } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab';

// Icons
import AddIcon from '@material-ui/icons/Add';

// Custom Components
import AccountingDrawer from '../../../components/AccountingDrawer';
import BackgroundCard from '../../../components/BackgroundCard';
import PrimaryButton from '../../../components/Button';
import BackgroundCardHeader from '../../../components/BackgroundCardHeader';
import ActionButton from '../../../components/ActionButton';
import Modal from '../../../components/Modal';

import api from '../../../services/api';

// Assets
import './index.css';
import { SnackContext } from '../../../contexts/SnackContext';

const useStyles = makeStyles({
  table: {
    minWidth: 'auto',
    border: '1px solid rgba(224, 224, 224, 1)',
    borderCollapse: 'separate',
    borderRadius: '8px'
  },
});

const Departments = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [activeDepartments, setActiveDepartments] = useState([]);
  const [inactiveDepartments, setInactiveDepartments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [ dptId, setDptId] = useState('');
  const [method, setMethod] = useState('');

  const { setSnack } = useContext(SnackContext);

  useEffect(() => {
    document.title = 'GestFacil | Departamentos'
    populateTable();
  }, [])

  const handleOpenModal = (id, method) => {
    setDptId(id);
    setMethod(method);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInactivate = async () => {
    try {
      await api.post(`/inactivate_department/${dptId}`);
      setLoading(true);
      populateTable();
      handleCloseModal();
      setSnack({ message: 'Departamento inativado com sucesso!', type: 'success', open: true})      
    } catch(err) {
      if(!err.response){       
        setSnack({ message: 'Encontramos um erro ao inativar o departamento. Entre em contato com o suporte! ' + err, type: 'error', open: true})
      }
      else {        
        let msg = err.response.data.err;
        setSnack({ message: `${msg}`, type: 'error', open: true });
      }
    }
  }
  
  const handleActivate = async () => {
    try {
      await api.post(`/activate_department/${dptId}`);
      setLoading(true);
      populateTable();
      handleCloseModal();
      setSnack({ message: 'Departamento ativado com sucesso!', type: 'success', open: true})      
    } catch(err) {
      if(!err.response){       
        setSnack({ message: 'Encontramos um erro ao ativar o departamento. Entre em contato com o suporte! ' + err, type: 'error', open: true})
      }
      else {        
        let msg = err.response.data.err;
        setSnack({ message: `${msg}`, type: 'error', open: true });
      }
    }
  }

  async function populateTable(){
    const response = await api.get('/department')
    setActiveDepartments(response.data.active)
    setInactiveDepartments(response.data.inactive)
    setLoading(false)
  }


  function status(status) {
    if (status === true)
      return 'Ativo';
    else {
      return 'Inativo';
    }
  }

  return (

    <AccountingDrawer title="Departamentos">
      <div className="master-dashboard">
        <BackgroundCard>

          <BackgroundCardHeader
            title="Departamentos"
          >
            <Link className="buttonLink" to="/acc/create_department"><PrimaryButton variant="contained" size="large"><AddIcon /></PrimaryButton></Link>
          </BackgroundCardHeader>

          <div className="content-table">
            <TableContainer>
              {(loading) ?
                <>
                  <Skeleton animation="wave" width="auto" height="57px" variant="rect" />

                  {[1, 2, 3, 4, 5, 6].map((n) =>
                    <Skeleton key={n} animation="wave" width="auto" height="65px" variant="rect" style={{ marginTop: 5 }} />
                  )}

                </>
                :
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell>E-mail</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeDepartments.map((items) => (
                      <TableRow key={items.id}>
                        <TableCell>{items.name}</TableCell>
                        <TableCell>{items.email}</TableCell>
                        <TableCell>{status(items.active)}</TableCell>
                        <TableCell align="right">
                          <ActionButton
                            variant="contained"
                            size="small"
                            icon="more_vert"
                            actions={
                              [
                                { text: 'Editar', to: `/acc/edit_department/${items.id}` },
                                { text: 'Inativar', onClick: () => handleOpenModal(items.id, 'inactivate') }
                              ]}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {inactiveDepartments.map((items) => (
                      <TableRow key={items.id}>
                        <TableCell>{items.name}</TableCell>
                        <TableCell>{items.email}</TableCell>
                        <TableCell>{status(items.active)}</TableCell>
                        <TableCell align="right">
                          <ActionButton
                            variant="contained"
                            size="small"
                            icon="more_vert"
                            actions={
                              [
                                { text: 'Editar', to: `/acc/edit_department/${items.id}` },
                                { text: 'Ativar', onClick: () => handleOpenModal(items.id, 'activate') }
                              ]}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              }
            </TableContainer>
          </div>
        </BackgroundCard>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          title={`Você deseja ${method === 'inactivate' ? 'inativar' : 'ativar'} esse departamento?`}
          actions={
            <>
              <PrimaryButton onClick={handleCloseModal} color="primary">Cancelar</PrimaryButton>
              <PrimaryButton onClick={method === 'inactivate' ? handleInactivate : handleActivate} color="primary">Sim</PrimaryButton>
            </>
          }
        >       
        </Modal>
      </div>
    </AccountingDrawer>

  );
};

export default Departments;