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
    cor_raca: yup.string()
    .required(true),
    nome: yup.string()
    .required(true),
    nome_mae: yup.string()
    .required(true),
    nome_pai: yup.string()
    .required(true),
    celular: yup.string()
    .required(true),
    telefone_residencial: yup.string()
    .required(true),
    cep: yup.string()
    .required(true),
    logradouro: yup.string()
    .required(true),
    numero: yup.string()
    .required(true),
    complemento: yup.string()
    .required(true),
    bairro: yup.string()
    .required(true),
    municipio: yup.string()
    .required(true),
    uf: yup.string()
    .required(true),
    escolaridade: yup.string()
    .required(true),
    pcd: yup.boolean()
    .required(true),
  });

  const auth = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      email: '',
      senha: '',     
      nascimento: '',
      genero: '',
      nome: '',
      cor_raca: '',
      nome_mae: '',
      nome_pai: '',
      celular: '',
      telefone_residencial: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      municipio: '',
      uf: '',
      escolaridade: '',
      pcd: false,
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
                name="cor_raca"
                label="Cor/Raça"
                type="text"
                variant="outlined"
                value={auth.values.cor_raca}
                onChange={auth.handleChange}
                error={auth.touched.cor_raca && Boolean(auth.errors.cor_raca)}
                helperText={auth.touched.cor_raca && auth.errors.cor_raca}
                select
                fullWidth
              >
                <MenuItem value={"Branca"} key={1}>Branca</MenuItem>
                <MenuItem value={"Preta"} key={2}>Preta</MenuItem>
                <MenuItem value={"Parda"} key={3}>Parda</MenuItem>
                <MenuItem value={"Amarela"} key={4}>Amarela</MenuItem>
                <MenuItem value={"Indígena"} key={5}>Indígena</MenuItem>
              </TextField>
            </div>
            <div className="input-block">
              <TextField
                name="nome_mae"
                label="Nome da Mãe"
                type="text"
                variant="outlined"
                value={auth.values.nome_mae}
                onChange={auth.handleChange}
                error={auth.touched.nome_mae && Boolean(auth.errors.nome_mae)}
                helperText={auth.touched.nome_mae && auth.errors.nome_mae}
                fullWidth
              />
            </div>
            <div className="input-block">
              <TextField
                name="nome_pai"
                label="Nome do Pai"
                type="text"
                variant="outlined"
                value={auth.values.nome_pai}
                onChange={auth.handleChange}
                error={auth.touched.nome_pai && Boolean(auth.errors.nome_pai)}
                helperText={auth.touched.nome_pai && auth.errors.nome_pai}
                fullWidth
              />
            </div>
            <div className="input-block">
              <TextField
                name="celular"
                label="Celular"
                type="text"
                variant="outlined"
                value={auth.values.celular}
                onChange={auth.handleChange}
                error={auth.touched.celular && Boolean(auth.errors.celular)}
                helperText={auth.touched.celular && auth.errors.celular}
                fullWidth
              />
            </div>
            <div className="input-block">
              <TextField
                name="telefone_residencial"
                label="Telefone Residencial"
                type="text"
                variant="outlined"
                value={auth.values.telefone_residencial}
                onChange={auth.handleChange}
                error={auth.touched.telefone_residencial && Boolean(auth.errors.telefone_residencial)}
                helperText={auth.touched.telefone_residencial && auth.errors.telefone_residencial}
                fullWidth
              />
            </div>
            <div className="input-block">
              <TextField
                name="cep"
                label="CEP"
                type="text"
                variant="outlined"
                value={auth.values.cep}
                onChange={auth.handleChange}
                error={auth.touched.cep && Boolean(auth.errors.cep)}
                helperText={auth.touched.cep && auth.errors.cep}
                fullWidth
              />
            </div>
            <div className="input-block">
              <TextField
                name="logradouro"
                label="Logradouro"
                type="text"
                variant="outlined"
                value={auth.values.logradouro}
                onChange={auth.handleChange}
                error={auth.touched.logradouro && Boolean(auth.errors.logradouro)}
                helperText={auth.touched.logradouro && auth.errors.logradouro}
                fullWidth
              />
            </div>
            <div className="input-block">
              <TextField
                name="numero"
                label="Núm. Endereço"
                type="text"
                variant="outlined"
                value={auth.values.numero}
                onChange={auth.handleChange}
                error={auth.touched.numero && Boolean(auth.errors.numero)}
                helperText={auth.touched.numero && auth.errors.numero}
                fullWidth
              />
            </div>
            <div className="input-block">
              <TextField
                name="complemento"
                label="Complemento"
                type="text"
                variant="outlined"
                value={auth.values.complemento}
                onChange={auth.handleChange}
                error={auth.touched.complemento && Boolean(auth.errors.complemento)}
                helperText={auth.touched.complemento && auth.errors.complemento}
                fullWidth
              />
            </div>
            <div className="input-block">
              <TextField
                name="bairro"
                label="Bairro"
                type="text"
                variant="outlined"
                value={auth.values.bairro}
                onChange={auth.handleChange}
                error={auth.touched.bairro && Boolean(auth.errors.bairro)}
                helperText={auth.touched.bairro && auth.errors.bairro}
                fullWidth
              />
            </div>
            <div className="input-block">
              <TextField
                name="municipio"
                label="Município"
                type="text"
                variant="outlined"
                value={auth.values.municipio}
                onChange={auth.handleChange}
                error={auth.touched.municipio && Boolean(auth.errors.municipio)}
                helperText={auth.touched.municipio && auth.errors.municipio}
                fullWidth
              />
            </div>
            <div className="input-block"> 
              <TextField                                    
                label="UF"
                variant="outlined"
                type="text"
                autoComplete="off"
                value={auth.values.uf}
                onChange={auth.handleChange}
                error={auth.touched.uf && Boolean(auth.errors.uf)}
                helperText={auth.touched.uf && auth.errors.uf}
                fullWidth     
                select            
              >
                <MenuItem value="AC" key="AC">AC</MenuItem>
                <MenuItem value="AL" key="AL">AL</MenuItem>
                <MenuItem value="AP" key="AP">AP</MenuItem>
                <MenuItem value="AM" key="AM">AM</MenuItem>
                <MenuItem value="BA" key="BA">BA</MenuItem>
                <MenuItem value="CE" key="CE">CE</MenuItem>
                <MenuItem value="DF" key="DF">DF</MenuItem>
                <MenuItem value="ES" key="ES">ES</MenuItem>
                <MenuItem value="GO" key="GO">GO</MenuItem>
                <MenuItem value="MA" key="MA">MA</MenuItem>
                <MenuItem value="MT" key="MT">MT</MenuItem>
                <MenuItem value="MS" key="MS">MS</MenuItem>
                <MenuItem value="MG" key="MG">MG</MenuItem>
                <MenuItem value="PA" key="PA">PA</MenuItem>
                <MenuItem value="PB" key="PB">PB</MenuItem>
                <MenuItem value="PE" key="PE">PE</MenuItem>
                <MenuItem value="PI" key="PI">PI</MenuItem>
                <MenuItem value="RJ" key="RJ">RJ</MenuItem>
                <MenuItem value="RN" key="RN">RN</MenuItem>
                <MenuItem value="RS" key="RS">RS</MenuItem>
                <MenuItem value="RO" key="RO">RO</MenuItem>
                <MenuItem value="RR" key="RR">RR</MenuItem>
                <MenuItem value="SC" key="SC">SC</MenuItem>
                <MenuItem value="SP" key="SP">SP</MenuItem>
                <MenuItem value="SE" key="SE">SE</MenuItem>
                <MenuItem value="TO" key="TO">TO</MenuItem>
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
            <div className="input-block">
              <TextField
                name="pcd"
                label="Você é uma Pessoa com Deficiência (PCD)?"
                type="text"
                variant="outlined"
                value={auth.values.pcd}
                onChange={auth.handleChange}
                error={auth.touched.pcd && Boolean(auth.errors.pcd)}
                helperText={auth.touched.pcd && auth.errors.pcd}
                select
                fullWidth
              >
                <MenuItem value={false} key={1}>Não</MenuItem>
                <MenuItem value={true} key={2}>Sim</MenuItem>              
              </TextField>
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