import React, { 
  useContext, 
  useState, 
  useReducer 
 } from 'react';

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
        message: 'Aguarde o cadastro!',
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

      const unidade = await api.post('/unidade', { ...form })
      
      setSnack({
        message: 'Unidade cadastrada!',
        type: 'success',
        open: true,
      });
      
      dispatch({ type: 'resetForm' });     
      props.setUnidadeCriada(unidade);
      props.handleCreateModalClose();           
      
      setLoading(false);
    } catch (err) {   
      setSnack({ 
        message: 'Ocorreu um erro ao tentar cadastrar. Caso persista, contate o suporte! ' + err, 
        type: 'error', 
        open: true
      });
      console.log(err);
      dispatch({ type: 'unlockSubmit' });        
      setLoading(false);
    }
  }

  return (
    <Modal
      open={props.createModal}
      onClose={props.handleCreateModalClose}
      title={`Nova Unidade`}
      actions={
        <>        
          <PrimaryButton onClick={props.handleCreateModalClose}>CANCELAR</PrimaryButton>
          <PrimaryButton onClick={() => handleSubmit()}>CADASTRAR</PrimaryButton>
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
              </div>                                                  
            </form>
          </div>
        }
    </Modal>     
  );
};

export default FormCadastroUnidade;