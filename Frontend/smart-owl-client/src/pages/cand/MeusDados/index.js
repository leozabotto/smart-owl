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

import jwtDecode from 'jwt-decode';

const MeusDados = (props) => {
  useEffect(() => {
    document.title = `Meus Dados | Smart Owl`;

    const token = jwtDecode(localStorage.getItem('token'));
    const candidatoId =  token.id;
      
  

   

    async function getCandidato() {
      try {

        const inscricao = await api.get('/inscricao', {
          params: {
            candidatoId,
            encerrada: "0"
          }
        });

        if (inscricao.data.length !== 0) {
          setSnack({ 
            message: 'Você não pode editar seus dados enquanto estiver inscrito numa turma em aberto!', 
            type: 'error', 
            open: true
          });
    
          history.push('/painel')
        }

        const candidato = await api.get(`/candidato/${candidatoId}`);
        candidato.data.senha = undefined;
        setNascimento(candidato.data.nascimento);
        setGenero(candidato.data.genero);
        setCorRaca(candidato.data.cor_raca);
        setEscolaridade(candidato.data.escolaridade);
        setPcd(candidato.data.pcd);
        setInitialValues(candidato.data);
        setUf(candidato.data.uf);

  

      } catch (err) {
        setSnack({ 
          message: 'Ocorreu um erro ao buscar seus dados! ' + err, 
          type: 'error', 
          open: true
        });

        history.push('/');
      }
    }

    getCandidato();

  }, []);


  const [initialValues, setInitialValues] = useState({})

  const query = useQuery();

  const { setSnack } = useContext(SnackContext);
  const { handleLogout } = useContext(AuthContext);

  const [nascimento, setNascimento] = useState(null); 
  const [genero, setGenero] = useState(null);
  const [cor_raca, setCorRaca] = useState(null);
  const [uf, setUf] = useState(null);
  const [escolaridade, setEscolaridade] = useState(null);
  const [pcd, setPcd] = useState(null);

  const { handleLogin } = useContext(AuthContext);

  const history = useHistory();

  const auth = useFormik({
    initialValues,
    onSubmit: (values) => {
      handleEdit(values);
    },
    enableReinitialize: true
  });
  
  const handleEdit = async (values) => {

    const token = jwtDecode(localStorage.getItem('token'));
    const candidatoId =  token.id;

    auth.values.nascimento = nascimento;
    auth.values.uf = uf;
    auth.values.escolarodade = escolaridade;
    auth.values.cor_raca = cor_raca;
    auth.values.pcd = pcd;
    auth.values.genero = genero;

    try {
      const candidato = await api.put(`/candidato/${candidatoId}`, {
        ...auth.values
      });

      setSnack({ 
        message: 'Dados editados com sucesso! Você será desconectado, em seguida, entre novamente. 😉', 
        type: 'success', 
        open: true
      });

      setTimeout(() => {
        handleLogout();
        history.push("/login");
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
          <Link to={'/painel'}><IconsButton size="medium"><ArrowBackIcon /></IconsButton></Link>
        </div>
        <div className="logo-header">
          <img src={mainLogo} alt="Smart Owl" />
          <h4>{props.title}</h4>
        </div>
        <div className="login-form">
          <p><b> Meus Dados </b></p>
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
                disabled
                required
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
                disabled  
                required      
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
                required
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
                value={genero}
                onChange={(e) => setGenero(e.target.value)}              
                select
                fullWidth
                required
              >
                <MenuItem value={"Masculino"} key={"Masculino"}>Masculino</MenuItem>
                <MenuItem value={"Feminino"} key={"Feminino"}>Feminino</MenuItem>
                <MenuItem value={"Outro"} key={"Outro"}>Outro</MenuItem>
              </TextField>
            </div>
            <div className="input-block">
              <TextField
                name="cor_raca"
                label="Cor/Raça"
                type="text"
                variant="outlined"
                value={cor_raca}
                onChange={(e) => setCorRaca(e.target.value)}              
                select
                fullWidth
                required
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
                required
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
                required
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
                required
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
                required
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
                required              
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
                required
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
                required                
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
                required
              />
            </div>
            <div className="input-block"> 
              <TextField  
                name="uf"
                label="UF"
                variant="outlined"
                type="text"
                autoComplete="off"
                value={uf}
                onChange={(e) => setUf(e.target.value)}  
                fullWidth     
                select    
                required        
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
                label="Escolaridade"
                name="escolaridade"
                variant="outlined"
                type="text"
                autoComplete="off"
                value={escolaridade}
                onChange={(e) => setEscolaridade(e.target.value)}              
                fullWidth     
                select     
                required={true}       
              >
                <MenuItem value="Ensino Médio Incompleto" key="Ensino Médio Incompleto">Ensino Médio Incompleto</MenuItem>
                <MenuItem value="Ensino Médio Cursando" key="Ensino Médio Cursando">Ensino Médio Cursando</MenuItem>
                <MenuItem value="Ensino Médio Completo" key="Ensino Médio Completo">Ensino Médio Completo</MenuItem>
                <MenuItem value="Superior Incompleto" key="Superior Incompleto">Superior Incompleto</MenuItem>
                <MenuItem value="Superior Cursando" key="Superior Cursando">Superior Cursando</MenuItem>
                <MenuItem value="Superior Completo" key="Superior Completo">Superior Completo</MenuItem>                         
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
                required
              />
            </div>
            <div className="input-block">
              <TextField
                name="senha"
                label="Senha (Só preencha se desejar alterar!)"
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
                value={pcd}
                onChange={(e) => setPcd(e.target.value)}              
                select
                fullWidth
                required
              >
                <MenuItem value={false} key={1}>Não</MenuItem>
                <MenuItem value={true} key={2}>Sim</MenuItem>              
              </TextField>
            </div>
            
            <div className="btn-submit">
              <PrimaryButton variant="contained" size="large" type="submit">SALVAR</PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MeusDados;