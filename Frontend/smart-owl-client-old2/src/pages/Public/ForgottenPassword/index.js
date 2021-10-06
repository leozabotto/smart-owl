import React, { useEffect } from 'react';

// Material UI
import { TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

// Custom Components
import PrimaryButton from '../../../components/Button';
import Box from '../../../components/Box';

// Assets

import './index.css';

const ForgottenPassword = (props) => {
  
  useEffect(() => {
    document.title = `GestFacil | ${props.type} - Recuperar Senha`
  }, [props.type])

  const validationSchema = yup.object({
    email: yup.string()
      .email('Digite um e-mail válido!')
      .required(true),
  });

  const auth = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      email: '',
    },
    onSubmit: (values) => {

    },
  });

  return (
    <div className="forgotten-container">
      <Box
        title={`${props.type} - Recuperação de Senha`}
        link="login"
      >
        <div className="forgotten-form">
          <form className="forgotten-form" onSubmit={auth.handleSubmit}>
            <div className="header-text">
              <p>Insira seu e-mail abaixo para procurar a sua conta:</p>
            </div>
            <div className="input-block">
              <TextField
                name="email"
                label="E-mail"
                type="email"
                variant="outlined"
                value={auth.values.email}
                onChange={auth.handleChange}
                error={auth.touched.email && Boolean(auth.errors.email)}
                helperText={auth.touched.email && auth.errors.email}
              />
            </div>
            <div className="btn-submit">
              <PrimaryButton variant="contained" size="large" type="submit" fullWidth>Enviar</PrimaryButton>
            </div>
          </form>
        </div>
      </Box>
    </div>
  );
};

export default ForgottenPassword;