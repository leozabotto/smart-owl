import { useState, useEffect, useContext } from 'react';
import jwt_decode from "jwt-decode";

import moment from "moment";

import { SnackContext } from '../SnackContext';
import history from '../../history';

import api from '../../services/api';

export default function useAuth() {
  const { setSnack } = useContext(SnackContext);
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [permissions, setPermissions] = useState('');

  useEffect(() => {
    async function loadData() {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      await new Promise(resolve => setTimeout(resolve, 2000))

      if (user && token) {
        var token_decoded = jwt_decode(token);

        if (token_decoded.exp < Date.now() / 1000) {
          handleLogout();
          history.push("/");
          setLoading(false);
        }
        
        else {
          setUser(JSON.parse(user));
          api.defaults.headers.Authorization = `Bearer ${token}`;

          setPermissions(token_decoded.permissoes_administrador);
          setRole(token_decoded.tipo);
          setUserId(token_decoded.id);
          setLoading(false);
        }
      }

      setLoading(false);
    }
    loadData();
    
  }, []);

  async function handleLogin(userData, type, redirect) {

    try {

      const response = await api.post('/login', { 
        email: userData.email, 
        senha: userData.senha,
        tipo: type, 
      });   
      
      let token_decoded = jwt_decode(response.data.token);
  
      const user = {
        nome: token_decoded.nome,
        email: token_decoded.email,
        idade: moment().diff(moment(token_decoded.nascimento), 'years'),
        pcd: token_decoded.pcd
      }
      
      setPermissions(token_decoded.permissoes_administrador);
      setRole(token_decoded.tipo);
      setUser(user);

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', response.data.token);     
      
      api.defaults.headers.Authorization = `Bearer ${response.data.token}`;

    } catch (err) {
      console.log(err)
      if(!err.response){       
        setSnack({ message: 'Encontramos um erro ao efetuar o login. Entre em contato com o suporte! ' + err, type: 'error', open: true})
      }
      else {        
        let msg = err.response.data.mensagem;
        setSnack({ message: `${msg}`, type: 'error', open: true });
      }
    }
  }

  function handleLogout() {
    setUser(null);
    setRole(null);
    setPermissions(null);
    localStorage.clear();
    api.defaults.headers.Authorization = undefined;
  }

  return { signed: !!user, user, userId, permissions, loading, role, handleLogin, handleLogout };
}