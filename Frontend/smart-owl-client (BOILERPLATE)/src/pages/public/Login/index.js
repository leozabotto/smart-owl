import React, { useEffect, useState } from 'react';

import {
  TextField,
  Button,
} from '@mui/material';

import './index.css';

import api from '../../../services/api';

import useQuery from '../../../hooks/useQuery';
import { useFormik } from 'formik';

const Login = () => {

  const query = useQuery();

  const formik = useFormik({
    initialValues: {
      email: '',
      senha: '',
    },
    onSubmit: values => handleSubmit(values)
  })

  const handleSubmit = async (values) => {
    try {
      const res = await api.post('/login', {...values});
      alert("OK");
    } catch (err) {
      alert("Erro!");
    }
  }

  useEffect(() => {
    window.title = "Login | Smart Owl"
  }, []);

  return (
    <div className="login-flex-container">
      <div className="login-box">
        <div className="logo">
          <b>LOGO SMART OWL</b>
        </div>
        <p>Área do {query.get("type") === 'adm' ? "Administrador" : "Candidato" } </p>
        <div className="form">
          <form method="POST" onSubmit={formik.handleSubmit}>
            <TextField 
              id="email" 
              label="E-mail" 
              type="email" 
              variant="outlined" 
              value={formik.email}
              onChange={formik.handleChange}
              fullWidth
              required
            />

            <TextField 
              id="senha" 
              label="Senha" 
              type="password"
              value={formik.senha} 
              onChange={formik.handleChange}
              variant="outlined"
              fullWidth
              required 
            />
            <div className="login-actions">
              <Button variant="contained" size="large" type="submit">Entrar</Button>
              <Button variant="text">Esqueci a Senha</Button>              
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;