import React from 'react';
import './index.css';

import {
  TextField
} from '@mui/material';

import { Link } from 'react-router-dom';

const Login = (props) => {

  return (<>
  <div className="login-container">
   <div className="login-box">

     <div className="logo">
        <h1>SMART OWL</h1>
     </div>

     <div className="titulo">
        <h2>Login</h2>
     </div>

     <div className="form">
      <TextField />
     </div>
   </div>
  </div>
  </>)
}

export default Login;