import React, { useContext, useEffect } from 'react';

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

import api from '../../../services/api';

// Assets
import './index.css';

const DepartmentsCreate = () => {
  const { setSnack } = useContext(SnackContext);

   useEffect(() => {
    document.title = 'GestFacil | Cadastro de Departamento';
  }, [])

  const validationSchema = yup.object({
    name: yup.string()
      .required(true),
    email: yup.string()
      .required(true),
  });

  const create = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      name: '',
      email: '',       
    },
    onSubmit: (values) => {
      handleCreate(values);
    },
  });

  async function handleCreate(values) {
    try {
      await api.post('/department', {
        ...values
      });
      setSnack({ message: 'Departamento cadastrado com sucesso!', type: 'success', open: true })
      create.resetForm()
    } catch (err) {
      if(!err.response){       
        setSnack({ message: 'Encontramos um erro ao cadastrar o departamento. Entre em contato com o suporte! ' + err, type: 'error', open: true})
      }
      else {        
        let msg = err.response.data.err;
        setSnack({ message: `${msg}`, type: 'error', open: true });
      }
    }
  }

  return (
    <AccountingDrawer title="Departamentos / Cadastro">
      <BackgroundCard>
        <HeaderTitle
          title="Cadastro de Departamento"
          subtitle="Atenção: preecha todos os campos para o cadastro."
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
              <PrimaryButton size="large" variant="contained" type="submit">Cadastrar</PrimaryButton>
            </div>
          </form>
        </div>
      </BackgroundCard>
    </AccountingDrawer>
  );
};

export default DepartmentsCreate;