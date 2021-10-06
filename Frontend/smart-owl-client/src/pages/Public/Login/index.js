import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Box from '../../../components/Box';
import PrimaryButton from '../../../components/Button';
import { AuthContext } from '../../../contexts/AuthContext'

import './index.css';

const Login = (props) => {
  useEffect(() => {
    document.title = `Login | Smart Owl`
  }, []);

  const { handleLogin } = useContext(AuthContext);

  const validationSchema = yup.object({
    email: yup.string()
      .email('Digite um e-mail válido!')
      .required(true),
    senha: yup.string()
      .required(true),
  });

  const auth = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      email: '',
      senha: '',
    },
    onSubmit: (values) => {
      handleLogin(values.email, values.senha);
    },
  });

  return (
    <div className="login-container">
      <Box link="/">
        <div className="login-form">
          <p><b> Área do&nbsp; 
            {props.type==='ADM' ? 'Administrador' : 'Candidato'}
          </b></p>
          <form className="login-form" onSubmit={auth.handleSubmit}>
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
            <div className="input-block">
              <TextField
                name="senha"
                label="Senha"
                type="senha"
                variant="outlined"
                value={auth.values.senha}
                onChange={auth.handleChange}
                error={auth.touched.senha && Boolean(auth.errors.senha)}
              />
            </div>
            <div className="btn-submit">
              <PrimaryButton variant="contained" size="large" type="submit">Entrar</PrimaryButton>
              <Link to="forgotten_senha">Esqueceu a senha?</Link>
            </div>
          </form>
        </div>
      </Box>
    </div>
  );
};

export default Login;