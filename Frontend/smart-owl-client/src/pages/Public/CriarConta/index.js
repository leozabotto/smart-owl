import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { 
  TextField,  
  RadioGroup, 
  FormControlLabel, 
  Radio,
  MenuItem,} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Box from '../../../components/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconsButton from '../../../components/IconButton';
import PrimaryButton from '../../../components/Button';
import { AuthContext } from '../../../contexts/AuthContext';
import { SnackContext } from '../../../contexts/SnackContext';

import FutureCalendar from '../../../components/FutureCalendar';

import mainLogo from '../../../assets/img/mainLogo.png';

import './index.css';
import api from '../../../services/api';

import useQuery from '../../../contexts/hooks/useQuery';

const Login = (props) => {
  useEffect(() => {
    document.title = `Criar Conta | Smart Owl`
  }, []);

  const query = useQuery();

  const { setSnack } = useContext(SnackContext);

  const [nascimento, setNascimento] = useState(null); 

  const { handleLogin } = useContext(AuthContext);

  const history = useHistory();

  const validationSchema = yup.object({
    email: yup.string()
      .email('Digite um e-mail válido!')
      .required(true),
    senha: yup.string()
      .required(true),     
    genero: yup.string()
    .required(true),
    nome: yup.string()
    .required(true),
  });

  const auth = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      email: '',
      senha: '',     
      nascimento: '',
      genero: 'Masculino',
      nome: '',
    },
    onSubmit: (values) => {
      handleCreate(values);
    },
  });
  
  const handleCreate = async (values) => {

    auth.values.nascimento = nascimento;

    try {
      const candidato = await api.post('/candidato', {
        ...auth.values
      });

      setSnack({ 
        message: 'Conta criada com sucesso! Você será redirecionado para o login...', 
        type: 'success', 
        open: true
      });

      setTimeout(() => {
        history.push(`/login${query.get('turma') ? `?turma=${query.get('turma')}` : ''}`);
      }, 1500)

    } catch (err) {
      console.log(err.response.data)
      setSnack({ 
        message: 'Ocorreu um erro ao criar sua conta! ' + err, 
        type: 'error', 
        open: true
      });
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">

      
        <div className="page-return">
          <Link to={'/login'}><IconsButton size="medium"><ArrowBackIcon /></IconsButton></Link>
        </div>
        <div className="logo-header">
          <img src={mainLogo} alt="Smart Owl" />
          <h4>{props.title}</h4>
        </div>
        <div className="login-form">
          <p><b> Criar Conta </b></p>
          <form className="login-form" onSubmit={auth.handleSubmit}>            
            <div className="input-block">
              <TextField
                name="cpf"
                label="CPF"
                type="text"
                variant="outlined"
                value={auth.values.cpf}
                onChange={auth.handleChange}
                error={auth.touched.cpf && Boolean(auth.errors.cpf)}
                helperText={auth.touched.cpf && auth.errors.cpf}
                fullWidth
              />
            </div>
            <div className="input-block">
              <TextField
                name="rg"
                label="RG"
                type="text"
                variant="outlined"
                value={auth.values.rg}
                onChange={auth.handleChange}
                error={auth.touched.rg && Boolean(auth.errors.rg)}
                helperText={auth.touched.rg && auth.errors.rg}  
                fullWidth            
              />
            </div>
            <div className="input-block">
              <TextField
                name="nome"
                label="Nome Completo"
                type="text"
                variant="outlined"
                value={auth.values.nome}
                onChange={auth.handleChange}
                error={auth.touched.nome && Boolean(auth.errors.nome)}
                helperText={auth.touched.nome && auth.errors.nome}
                fullWidth
              />
            </div>
            <div className="input-block">
             <FutureCalendar
                name="nascimento"
                label="Data de Nascimento"
                inputVariant="outlined"
                autoComplete="off"
                value={nascimento}
                onChange={setNascimento}
                fullWidth
                required
            />
            </div>
            <div className="input-block">
              <TextField
                name="genero"
                label="Gênero"
                type="text"
                variant="outlined"
                value={auth.values.genero}
                onChange={auth.handleChange}
                error={auth.touched.genero && Boolean(auth.errors.genero)}
                helperText={auth.touched.genero && auth.errors.genero}
                select
                fullWidth
              >
                <MenuItem value={"Masculino"} key={1}>Masculino</MenuItem>
                <MenuItem value={"Feminino"} key={2}>Feminino</MenuItem>
                <MenuItem value={"Outro"} key={3}>Outro</MenuItem>
              </TextField>
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
                fullWidth
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
                fullWidth
              />
            </div>
            
            <div className="btn-submit">
              <PrimaryButton variant="contained" size="large" type="submit">CADASTRAR</PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;