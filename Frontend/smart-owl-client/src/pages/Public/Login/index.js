import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Box from '../../../components/Box';
import PrimaryButton from '../../../components/Button';
import { AuthContext } from '../../../contexts/AuthContext'

import './index.css';

import useQuery from '../../../contexts/hooks/useQuery';

const Login = (props) => {
  
  useEffect(() => {
    document.title = `Login | Smart Owl`; 
  }, []);

  const query = useQuery();

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
      type: props.type
    },
    onSubmit: (values) => {
      const origem = query.get('origem');
      const turma = query.get('turma');

      let redirect = false;

      if (origem === 'catalogo') {
        redirect = {
          turma,
        }
      }

      handleLogin({email: values.email, senha: values.senha }, props.type, redirect);
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
                type="password"
                variant="outlined"
                value={auth.values.senha}
                onChange={auth.handleChange}
                error={auth.touched.senha && Boolean(auth.errors.senha)}
              />
            </div>
            <div className="btn-submit">
              <PrimaryButton variant="contained" size="large" type="submit">Entrar</PrimaryButton>
              {props.type==='ADM' ? '' : <Link to={`criar_conta${query.get('turma') ? `?turma=${query.get('turma')}` : ''}`}>Não tem cadastro? <span style={{
                textDecoration: 'underline',
                color: 'blue'
              }}>Criar Conta</span></Link>}
            </div>
          </form>
        </div>
      </Box>
    </div>
  );
};

export default Login;