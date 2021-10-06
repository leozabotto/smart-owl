import React, { useContext, useEffect, useState } from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { Switch, FormControlLabel } from '@material-ui/core';
import { Alert, AlertTitle }from '@material-ui/lab';
import MaskedInput from 'react-text-mask';
import { useFormik } from 'formik';
import * as yup from 'yup';
import cep from 'cep-promise'

import BackgroundCard from '../../../../components/BackgroundCard';
import AccountingDrawer from '../../../../components/AccountingDrawer';
import PrimaryButton from '../../../../components/Button';
import Calendar from '../../../../components/Calendar';
import { HeaderTitle, HeaderSubtitle } from '../../../../components/HeaderTitle';

import { SnackContext } from '../../../../contexts/SnackContext';
import api from '../../../../services/api';
import './index.css';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import LoadingProgress from '../../../../components/LoadingProgress';

// Documentação MaskedInput = https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md#readme

const TelephoneMask = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      guide={false}
    />
  );
}

const CepMask = (props) => {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/,]}
      placeholderChar={'\u2000'}
      guide={false}
    />
  );
}

function formatDate(val) {
  let d = new Date(val),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}


const CpfMask = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/,]}
      placeholderChar={'\u2000'}
      guide={false}
    />
  );
}

const ClientsEdit = () => {
  const { setSnack } = useContext(SnackContext);

  const { id } = useParams();

  const [openingCalendar, setOpeningCalendar] = useState(new Date());
  const [birthdayCalendar, setBirthdayCalendar] = useState(new Date());
  const [cepNotFound, setCepNotFound] = useState(false);
  const [financialAutonomy, setFinancialAutonomy] = useState(false);
  const [initialValues, setInitialValues] = useState('');
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  useEffect(() => {
    document.title = 'Edição de Cliente | GestFacil'
  }, []);

  useEffect(() => {
    async function getClient() {
      try {
        const client = await api.get(`/client/${id}`);
        setInitialValues(client.data);
        setFinancialAutonomy(client.data.financialAutonomy);
        setLoading(false);
      }
      catch(err) {
        setSnack({ 
          message: 'Falha ao editar operador, contate o suporte. Erro: ' + err.message, 
          type: 'error', 
          open: true
        });
        history.push('/acc/clients');
      }
    }
    getClient();
  }, [id, setSnack]);

  const validationSchema = yup.object({
    companyName: yup.string()
      .required(true),
    tradingName: yup.string()
      .required(true),
    cpfCnpj: yup.string()
      .required(true),  
    im: yup.string()
      .required(true),
    email: yup.string()
      .email('Digite um e-mail válido!')
      .required(true),
    mainPhone: yup.string()
      .required(true),
    size: yup.string()
      .required(true),
    legalNature: yup.string()
      .required(true),
    taxRegime: yup.string()
      .required(true),
    nire: yup.string()
      .required(true),  
    unityType: yup.string()
      .required(true),
    state: yup.string()
      .required(true),
    city: yup.string()
      .required(true),
    cep: yup.string()
      .required(true),
    street: yup.string()
      .required(true),
    neighborhood: yup.string()
      .required(true),
    addressNumber: yup.string()
      .required(true),   
    ownerName: yup.string()
      .required(true),
    ownerCpf: yup.string()
      .required(true),
    ownerPhone: yup.string()
      .required(true),
    ownerEmail: yup.string()
      .email('Digite um e-mail válido!')
      .required(true),
  });

  const create = useFormik({
    validationSchema: validationSchema,
    enableReinitialize: true,
    initialValues: {
      cpfCnpj: loading ? '' : initialValues.cpfCnpj || '',
      companyName: loading ? '' : initialValues.companyName || '',
      tradingName: loading ? '' : initialValues.tradingName || '',
      ie: loading ? '' : initialValues.ie || '',
      im: loading ? '' : initialValues.im || '',
      nire: loading ? '' : initialValues.nire || '',
      email: loading ? '' : initialValues.email || '',
      mainPhone: loading ? '' : initialValues.mainPhone || '',
      size: loading ? '' : initialValues.size || '',
      legalNature: loading ? '' : initialValues.legalNature || '',
      taxRegime: loading ? '' : initialValues.taxRegime || '',     
      unityType:loading ? '' : initialValues.unityType || '',
      cep: loading ? '' : initialValues.cep || '',
      state: loading ? '' : initialValues.state || '',
      neighborhood: loading ? '' : initialValues.neighborhood || '',
      city: loading ? '' : initialValues.city || '',
      street: loading ? '' : initialValues.street || '',
      addressNumber: loading ? '' : initialValues.addressNumber || '',
      complement: loading ? '' : initialValues.complement || '',
      ownerName: loading ? '' : initialValues.ownerName || '',
      ownerEmail: loading ? '' : initialValues.ownerEmail || '',
      ownerCpf: loading ? '' : initialValues.ownerCpf || '',
      ownerPhone: loading ? '' : initialValues.ownerPhone || '',
    },
    onSubmit: (values) => {
      handleEdit(values);
    },
  });

  async function handleEdit(values) {
    try {   
      values.openingDate = formatDate(openingCalendar);
      values.ownerBirthday = formatDate(birthdayCalendar); 
      values.financialAutonomy = financialAutonomy;     
      await api.put(`/client/${id}`, {
        ...values
      });
      setSnack({ message: 'Cliente atualizado com sucesso!', type: 'success', open: true })
      create.resetForm();
      history.push('/acc/clients');
    } catch (err) {
      if(!err.response){       
        setSnack({ message: 'Encontramos um erro ao atualizar o cliente. Entre em contato com o suporte! ' + err, type: 'error', open: true})
      }
      else {        
        let msg = err.response.data.message;
        setSnack({ message: `${msg}`, type: 'error', open: true });
      }
    }
  } 

  function checkCep(val) {
    const { value } = val.target;

    if (value.length > 8) {
     
      cep(value, { providers: ['viacep'] })
        .then((data) => {
          setCepNotFound(false)

          // RESETA VALORES ANTIGOS
          create.setFieldValue('state', '')
          create.setFieldValue('city', '')
          create.setFieldValue('street', '')
          create.setFieldValue('neighborhood', '')
         
          // VERIFICA SE O CEP POSSUI LOGRADOURO REGISTRADO
          if (data.street.length !== 0) {
            create.setFieldValue('street', data.street)
          }

          // VERIFICA SE O CEP POSSUI BAIRRO REGISTRADO
          if (data.neighborhood.length !== 0) {
            create.setFieldValue('neighborhood', data.neighborhood)
          }

          create.setFieldValue('state', data.state)
          create.setFieldValue('city', data.city)

        })
        .catch((data) => {
          if(data !== undefined){
            setCepNotFound(true);
            create.setFieldValue('state', '');
            create.setFieldValue('city', '');
          }
        })
     
    }
  }

  return (
    <AccountingDrawer title="Clientes / Edição">
      <BackgroundCard>
        <HeaderTitle
          title="Edição de Cliente"
          subtitle="Atenção: mantenha todos os campos obrigatórios (*) preenchidos para a edição."
        />

        <div className="accounting-form-container">
          <form className="accounting-form" onSubmit={create.handleSubmit}>
            { loading ? 
              <LoadingProgress />
              :
            <>
            <HeaderSubtitle
              title="Dados da Empresa"
            />
            <div className="accounting-form-company">
              
               
                <div className="input-block">
                  <TextField
                    name="companyName"
                    label="Razão Social"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.companyName}
                    onChange={create.handleChange}
                    error={create.touched.companyName && Boolean(create.errors.companyName)}
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="tradingName"
                    label="Nome Fantasia"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.tradingName}
                    onChange={create.handleChange}
                    error={create.touched.tradingName && Boolean(create.errors.tradingName)}
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="cpfCnpj"
                    label="CPF/CNPJ"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.cpfCnpj}
                    onChange={create.handleChange}
                    error={create.touched.cpfCnpj && Boolean(create.errors.cpfCnpj)}                  
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="ie"
                    label="Inscrição Estadual"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.ie}
                    onChange={create.handleChange}
                    error={create.touched.ie && Boolean(create.errors.ie)}
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="im"
                    label="Inscrição Municipal"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.im}
                    onChange={create.handleChange}
                    error={create.touched.im && Boolean(create.errors.im)}
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
                <div className="input-block">
                  <TextField
                    name="mainPhone"
                    label="Telefone"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.mainPhone}
                    onChange={create.handleChange}
                    error={create.touched.mainPhone && Boolean(create.errors.mainPhone)}
                    fullWidth
                    InputProps={{
                      inputComponent: TelephoneMask,
                    }}
                  />
                </div>
                <div className="input-block">            
                  <TextField
                    select
                    name="size"
                    label="Porte"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.size}
                    onChange={create.handleChange}
                    error={create.touched.size && Boolean(create.errors.size)}
                    fullWidth
                  >
                    <MenuItem value="MEI">MEI</MenuItem>
                    <MenuItem value="EPP">EPP</MenuItem>
                    <MenuItem value="ME">ME</MenuItem>
                    <MenuItem value="EPP">Demais</MenuItem>
                  </TextField>
                </div>
                <div className="input-block">
                  <TextField
                    select
                    name="legalNature"
                    label="Natureza Juridica"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.legalNature}
                    onChange={create.handleChange}
                    error={create.touched.legalNature && Boolean(create.errors.legalNature)}
                    fullWidth
                  >
                    <MenuItem value="EI - Empresário Individual">EI - Empresário Individual</MenuItem>
                    <MenuItem value="LTDA - Sociedade Limitada">LTDA - Sociedade Limitada</MenuItem>
                    <MenuItem value="EIRELI - Emp. Ind. Resp. Limitada">EIRELI - Emp. Ind. Resp. Limitada</MenuItem>
                    <MenuItem value="Assosiação Privada">Assosiação Privada</MenuItem>
                    <MenuItem value="Sociedade Anônima Fechada">Sociedade Anônima Fechada</MenuItem>
                    <MenuItem value="Sociedade Simples Pura">Sociedade Simples Pura</MenuItem>
                  </TextField>
                </div>
                <div className="input-block">
                  <TextField
                    select
                    name="taxRegime"
                    label="Regime de Tributação"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.taxRegime}
                    onChange={create.handleChange}
                    error={create.touched.taxRegime && Boolean(create.errors.taxRegime)}
                    fullWidth
                  >
                    <MenuItem value="Regime Normal">Regime Normal</MenuItem>
                    <MenuItem value="Simples Nacional">Simples Nacional</MenuItem>
                  </TextField>
                </div>
                <div className="input-block">
                  <Calendar
                    name="openingDate"
                    label="Data de Abertura"
                    value={openingCalendar}
                    onChange={setOpeningCalendar}
                    inputVariant="outlined"
                    type="text"
                    autoComplete="off"
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="nire"
                    label="NIRE"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.nire}
                    onChange={create.handleChange}
                    error={create.touched.nire && Boolean(create.errors.nire)}
                    fullWidth
                  />
                </div>            
                <div className="input-block">
                  <TextField
                    select
                    name="unityType"
                    label="Tipo de Unidade"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.unityType}
                    onChange={create.handleChange}
                    error={create.touched.unityType && Boolean(create.errors.unityType)}
                    fullWidth
                  >
                    <MenuItem value="Matriz">Matriz</MenuItem>
                    <MenuItem value="Filial">Filial</MenuItem>
                  </TextField>
                </div>

              </div>

              <HeaderSubtitle
                title="Endereço da Empresa"
              />
              
              {cepNotFound ?
                <Alert className="cep-warning" variant="outlined" severity="warning">
                  <AlertTitle>Atenção</AlertTitle>
                  O cep informado não foi encontrado!
                </Alert>
                : null
              }
              <div className="accounting-form-address">
                <div className="input-block">
                  <TextField
                    name="cep"
                    label="CEP"
                    variant="outlined"
                    type="text"
                    value={create.values.cep}
                    onChange={(val) => { create.handleChange(val); checkCep(val) }}
                    error={create.touched.cep && Boolean(create.errors.cep)}
                    helperText={create.touched.cep && create.errors.cep}
                    autoComplete="off"
                    fullWidth
                    InputProps={{
                      inputComponent: CepMask,
                    }}
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="street"
                    label="Logradouro"
                    variant="outlined"
                    autoComplete="off"
                    type="text"
                    value={create.values.street}
                    onChange={create.handleChange}
                    error={create.touched.street && Boolean(create.errors.street)}
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="addressNumber"
                    label="Número"
                    type="text"
                    variant="outlined"
                    autoComplete="off"
                    fullWidth
                    value={create.values.addressNumber}
                    onChange={create.handleChange}
                    error={create.touched.addressNumber && Boolean(create.errors.addressNumber)}
                    inputProps={{ maxLength: 5 }}
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="neighborhood"
                    label="Bairro"
                    variant="outlined"
                    autoComplete="off"
                    type="text"
                    value={create.values.neighborhood}
                    onChange={create.handleChange}
                    error={create.touched.neighborhood && Boolean(create.errors.neighborhood)}
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="complement"
                    label="Complemento"
                    variant="outlined"
                    autoComplete="off"
                    type="text"
                    value={create.values.complement}
                    onChange={create.handleChange}
                    error={create.touched.complement && Boolean(create.errors.complement)}
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="city"
                    label="Município"
                    variant="outlined"
                    autoComplete="off"
                    value={create.values.city}
                    onChange={create.handleChange}
                    error={create.touched.city && Boolean(create.errors.city)}
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="state"
                    label="UF"
                    variant="outlined"
                    autoComplete="off"
                    type="text"
                    value={create.values.state}
                    onChange={create.handleChange}
                    error={create.touched.state && Boolean(create.errors.state)}
                    fullWidth
                  />
                </div>
              </div>

              <HeaderSubtitle
                title="Responsável pela Empresa"
              />

              <div className="accounting-form-owner">
                <div className="input-block">
                  <TextField
                    name="ownerName"
                    label="Nome"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.ownerName}
                    onChange={create.handleChange}
                    error={create.touched.ownerName && Boolean(create.errors.ownerName)}
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="ownerCpf"
                    label="CPF"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.ownerCpf}
                    onChange={create.handleChange}
                    error={create.touched.ownerCpf && Boolean(create.errors.ownerCpf)}
                    helperText={create.touched.ownerCpf && create.errors.ownerCpf}
                    fullWidth
                    InputProps={{
                      inputComponent: CpfMask,
                    }}
                  />
                </div>
                <div className="input-block">
                  <Calendar
                    name="ownerBirthday"
                    label="Data de Nascimento"
                    inputVariant="outlined"
                    autoComplete="off"
                    value={birthdayCalendar}
                    onChange={setBirthdayCalendar}
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="ownerPhone"
                    label="Telefone"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.ownerPhone}
                    onChange={create.handleChange}
                    error={create.touched.ownerPhone && Boolean(create.errors.ownerPhone)}
                    fullWidth
                    InputProps={{
                      inputComponent: TelephoneMask,
                    }}
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="ownerEmail"
                    label="Email"
                    variant="outlined"
                    type="email"
                    autoComplete="off"
                    value={create.values.ownerEmail}
                    onChange={create.handleChange}
                    error={create.touched.ownerEmail && Boolean(create.errors.ownerEmail)}
                    helperText={create.touched.ownerEmail && create.errors.ownerEmail}
                    fullWidth
                  />
                </div>
              </div>

              <HeaderSubtitle
                title="Permissões da Empresa"
              />

              <div className="input-block">
                <FormControlLabel control={
                  <Switch 
                    checked={financialAutonomy}
                    onChange={(e) => setFinancialAutonomy(e.target.checked)}
                  />
                  } label="Autonomia Financeira" />
              </div>

              {/* <HeaderSubtitle
                title="Usuário Administrador do Sistema"
              />

              <div className="accounting-form-admin">
                <div className="input-block">
                  <TextField
                    name="userName"
                    label="Nome"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.userName}
                    onChange={create.handleChange}
                    error={create.touched.userName && Boolean(create.errors.userName)}
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="userLastName"
                    label="Sobrenome"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={create.values.userLastName}
                    onChange={create.handleChange}
                    error={create.touched.userLastName && Boolean(create.errors.userLastName)}
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="userEmail"
                    label="Email"
                    variant="outlined"
                    type="email"
                    autoComplete="off"
                    value={create.values.userEmail}
                    onChange={create.handleChange}
                    error={create.touched.userEmail && Boolean(create.errors.userEmail)}
                    helperText={create.touched.userEmail && create.errors.userEmail}
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="userPassword"
                    label="Senha"
                    variant="outlined"
                    type="password"
                    autoComplete="off"
                    value={create.values.userPassword}
                    onChange={create.handleChange}
                    error={create.touched.userPassword && Boolean(create.errors.userPassword)}
                    helperText={create.touched.userPassword && create.errors.userPassword}
                    fullWidth
                  />
                </div>
                <div className="input-block">
                  <TextField
                    name="confirmPassword"
                    label="Confirme a Senha"
                    variant="outlined"
                    type="password"
                    autoComplete="off"
                    value={create.values.confirmPassword}
                    onChange={create.handleChange}
                    error={create.touched.confirmPassword && Boolean(create.errors.confirmPassword)}
                    helperText={create.touched.confirmPassword && create.errors.confirmPassword}
                    fullWidth
                  />
                </div>
              </div> */}
              </>
            }
            <div className="accounting-form-button">
              <PrimaryButton size="large" variant="contained" type="submit" >Atualizar</PrimaryButton>
            </div>
          </form>
        </div>
      </BackgroundCard>
    </AccountingDrawer>
  );
};

export default ClientsEdit;