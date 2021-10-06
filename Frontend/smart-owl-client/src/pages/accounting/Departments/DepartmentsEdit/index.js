import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';

// Material UI
import { TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

// Custom Components
import BackgroundCard from '../../../components/BackgroundCard';
import AccountingDrawer from '../../../components/AccountingDrawer';
import PrimaryButton from '../../../components/Button';
import { HeaderTitle, HeaderSubtitle } from '../../../components/HeaderTitle';
import { SnackContext } from '../../../contexts/SnackContext';
import LoadingProgress from '../../../components/LoadingProgress';

import history from '../../../history';
import api from '../../../services/api';

// Assets
import './index.css';

const DepartmentsEdit = () => {
  const { id } = useParams();

  const { setSnack } = useContext(SnackContext);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState('Carregando informações...');

  useEffect(() => {
    document.title = 'GestFacil | Edição de Departamento';

    setTimeout(async () => {
      try {
        const response = await api.get(`/department/${id}`);
        setInitialValues(response.data.department)
      } catch (err) {
        if (err !== undefined) {
          setSnack({ message: 'Encontramos um erro ao buscar os dados do departamento. Entre em contato com o suporte!', type: 'error', open: true })
        }
        else {
          let msg = '';
          setSnack({ message: `${msg}`, type: 'error', open: true });
        }
      }
      setLoading(false)
    }, 100);

  }, [])

  const validationSchema = yup.object({
    name: yup.string()
      .required(true),
    email: yup.string()
      .required(true),
  });

  const create = useFormik({
    validationSchema: validationSchema,
    enableReinitialize: true,
    initialValues: {
      name: loading ? '' : initialValues.name,
      email: loading ? '' : initialValues.email
    },
    onSubmit: (values) => {
      handleCreate(values);
    },
  });

  async function handleCreate(values) {
    try {
      await api.post(`/department/${id}`, {
        ...values
      });
      setSnack({ message: 'Departamento atualizado com sucesso!', type: 'success', open: true })
      create.resetForm()
      history.push('/acc/departments')
    } catch (err) {
      if (!err.response) {
        setSnack({ message: 'Encontramos um erro ao atualizar o departamento. Entre em contato com o suporte! ' + err, type: 'error', open: true })
      }
      else {
        let msg = err.response.data.err;
        setSnack({ message: `${msg}`, type: 'error', open: true });
      }
    }
  }

  return (
    <AccountingDrawer title="Departamentos / Edição">
      <BackgroundCard>
        {loading
          ?
          <LoadingProgress />
          :
          <>
            <HeaderTitle
              title="Edição de Departamento"
              subtitle="Altere os campos desejados"
            />

            <div className="accounting-form-container">
              <form className="accounting-form" onSubmit={create.handleSubmit}>
                <HeaderSubtitle
                  title="Dados do Departamento"
                />

                <div className="accounting-form-admin">
                  <div className="input-block">
                    <TextField
                      name="name"
                      label="Nome"
                      variant="outlined"
                      type="text"
                      autoComplete="off"
                      value={create.values.name}
                      onChange={create.handleChange}
                      error={create.touched.name && Boolean(create.errors.name)}
                      fullWidth
                    />
                  </div>
                  <div className="input-block">
                    <TextField
                      name="email"
                      label="Email"
                      variant="outlined"
                      type="email"
                      autoComplete="off"
                      value={create.values.email}
                      onChange={create.handleChange}
                      error={create.touched.email && Boolean(create.errors.email)}
                      helperText={create.touched.email && create.errors.email}
                      fullWidth
                    />
                  </div>
                </div>

                <div className="accounting-form-button">
                  <PrimaryButton size="large" variant="contained" type="submit">Salvar</PrimaryButton>
                </div>
              </form>
            </div>
          </>
        }
      </BackgroundCard>
    </AccountingDrawer>
  );
};

export default DepartmentsEdit;