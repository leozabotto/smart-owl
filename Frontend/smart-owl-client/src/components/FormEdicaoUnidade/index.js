import React, { 
  useContext, 
  useState, 
  useReducer,
  useEffect
 } from 'react';

import { FormControlLabel, Switch } from '@material-ui/core';

import { 
  TextField, 
  CircularProgress,
  MenuItem,
} from '@material-ui/core';

import PrimaryButton from '../Button';
import Modal from '../Modal';

import { HeaderSubtitle } from '../HeaderTitle';
import { SnackContext } from '../../contexts/SnackContext';

import './index.css';
import api from '../../services/api';


const FormCadastroUnidade = (props) => {

  const { setSnack } = useContext(SnackContext);

  const [loading, setLoading] = useState(false);
  
  const initialState = {   
    nome: "",
    rua: "",
    numero_endereco: "",
    cep: "",
    bairro: "",
    estado: "",
    cidade: "",
    email: "",
    telefone: "",
  }

  const reducer = (state, action) => {
    switch(action.type) {            
      case 'cgNome': 
        return {
          ...state,
          nome: action.value,
        }
      case 'cgRua': 
        return {
          ...state,
          rua: action.value,
        }
      case 'cgNumeroEndereco': 
        return {
          ...state,
          numero_endereco: action.value,
        }
      case 'cgCep': 
        return {
          ...state,
          cep: action.value,
        }
      case 'cgBairro': 
        return {
          ...state,
          bairro: action.value,
        }
      case 'cgEstado': 
        return {
          ...state,
          estado: action.value,
        }
      case 'cgCidade': 
        return {
          ...state,
          cidade: action.value,
        }
      case 'cgEmail': 
        return {
          ...state,
          email: action.value,
        }
      case 'cgTelefone': 
        return {
          ...state,
          telefone: action.value,
        }
      case 'cgAtivo': 
        return {
          ...state,
          ativo: action.value,
        }
      case 'resetForm':       
        return {
          ...initialState,          
        }
      default:
        return { ...state }
    }
  }
  
  const [form, dispatch] = useReducer(reducer, initialState);
 
  const handleSubmit = async () => {  

   if (form.lockedSubmit) {
      setSnack({
        message: 'Aguarde a atualização!',
        type: 'error',
        open: true
      });
      return;
    }

    for (let i = 0; i < Object.keys(form).length; i++) {
      if(form[Object.keys(form)[i]] === '') {
        setSnack({ 
          message: 'Preencha todos os campos!', 
          type: 'error', 
          open: true
        });
        return;
      }
    }    

    setLoading(true);

    try {
      dispatch({ type: 'lockSubmit' });

      const unidade = await api.put(`/unidade/${props.unidadeParaEditar.id}`, { ...form })
      
      setSnack({
        message: 'Unidade atualizada!',
        type: 'success',
        open: true,
      });
      
      dispatch({ type: 'resetForm' });   

      console.log(unidade)
      
      unidade.data.ativo = unidade.data.ativo === true ? "1" : "0";
      
      props.setUnidadeEditada(unidade); 
      props.handleEditModalClose();          
      
      setLoading(false);
    } catch (err) {   
      setSnack({ 
        message: 'Ocorreu um erro ao tentar salvar. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });
      dispatch({ type: 'unlockSubmit' });        
      setLoading(false);
    }
  }

  useEffect(() => {

    async function setUnidade() {   
      try {        
        setLoading(true);
                      
        dispatch({ type: 'cgNome', value: props.unidadeParaEditar.nome });             
        dispatch({ type: 'cgRua', value: props.unidadeParaEditar.rua });             
        dispatch({ type: 'cgNumeroEndereco', value: props.unidadeParaEditar.numero_endereco });             
        dispatch({ type: 'cgCep', value: props.unidadeParaEditar.cep });             
        dispatch({ type: 'cgBairro', value: props.unidadeParaEditar.bairro });             
        dispatch({ type: 'cgEstado', value: props.unidadeParaEditar.estado });             
        dispatch({ type: 'cgCidade', value: props.unidadeParaEditar.cidade });             
        dispatch({ type: 'cgEmail', value: props.unidadeParaEditar.email });             
        dispatch({ type: 'cgTelefone', value: props.unidadeParaEditar.telefone });
        dispatch({ type: 'cgAtivo', value: props.unidadeParaEditar.ativo === "1" ? true : false });
             
        
        setLoading(false);
      } catch (err) {
        console.log(err)
        setSnack({ 
          message: 'Ocorreu um erro ao buscar a conta. ' + err, 
          type: 'error', 
          open: true
        });
        setLoading(false);
        props.handleEditModalClose();
      }
    }

    if (props.unidadeParaEditar !== undefined && props.unidadeParaEditar !== null) {
      setUnidade(); 
    }

  }, [props, setSnack]);

  return (
    <Modal
      open={props.editModal}
      onClose={props.handleEditModalClose}
      title={`Editar Unidade`}
      actions={
        <>        
          <PrimaryButton onClick={props.handleEditModalClose}>CANCELAR</PrimaryButton>
          <PrimaryButton onClick={() => handleSubmit()}>ATUALIZAR</PrimaryButton>
        </>
      }
      > 
        {
          loading
          ?

          <div style=
          {{ 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              alignContent: 'center',
              alignItems: 'center',
          }}>
            <CircularProgress />
          </div>    
          :        
          <div>
            <form               
              onSubmit={handleSubmit} 
            >
              <HeaderSubtitle
                title="Informações da Unidade"
              />
              <div className="file-form-basic" style={{ display: 'flex', flexDirection: 'column', gap: 10}}>                                                                                             

                <div className="input-block">            
                  <TextField                                    
                    label="Nome"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.nome}
                    onChange={(e) => dispatch({
                      type: 'cgNome',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth                 
                  />  
                </div>
                <div className="input-block"> 
                  <TextField                                    
                    label="E-mail"
                    variant="outlined"
                    type="email"
                    autoComplete="off"
                    value={form.email}
                    onChange={(e) => dispatch({
                      type: 'cgEmail',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth                 
                  />  
                </div>
                <div className="input-block"> 
                  <TextField                                    
                    label="Telefone"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.telefone}
                    onChange={(e) => dispatch({
                      type: 'cgTelefone',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth                 
                  />    
                </div>
                <div className="input-block"> 
                  <TextField                                    
                    label="Rua"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.rua}
                    onChange={(e) => dispatch({
                      type: 'cgRua',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth                 
                  />
                </div>
                <div className="input-block"> 
                  <TextField                                    
                    label="Número do Endereço"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.numero_endereco}
                    onChange={(e) => dispatch({
                      type: 'cgNumeroEndereco',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth                 
                  /> 
                </div>
                <div className="input-block"> 
                  <TextField                                    
                    label="CEP"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.cep}
                    onChange={(e) => dispatch({
                      type: 'cgCep',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth                 
                  /> 
                </div>
                <div className="input-block"> 
                  <TextField                                    
                    label="Bairro"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.bairro}
                    onChange={(e) => dispatch({
                      type: 'cgBairro',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth                 
                  /> 
                </div>
                <div className="input-block"> 
                <TextField                                    
                    label="Estado"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.estado}
                    onChange={(e) => dispatch({
                      type: 'cgEstado',
                      value: e.target.value,
                    })}
                    error={null}
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
                    label="Cidade"
                    variant="outlined"
                    type="text"
                    autoComplete="off"
                    value={form.cidade}
                    onChange={(e) => dispatch({
                      type: 'cgCidade',
                      value: e.target.value,
                    })}
                    error={null}
                    fullWidth                 
                  />                 
                </div>
                <div className="input-block">
                <FormControlLabel control={
                  <Switch 
                    checked={form.ativo}
                    onChange={(e) => dispatch({ type: "cgAtivo", value: e.target.checked})}
                  />
                } label="Ativa" /></div>                             
              </div>                                                  
            </form>
          </div>
        }
    </Modal>     
  );
};

export default FormCadastroUnidade;