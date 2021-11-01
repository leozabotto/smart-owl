import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';
//import { SnackContext } from '../contexts/SnackContext';
import Loading from '../pages/public/Loading';

const PrivateRoute = ({ ...rest }) => {

  // permissions, role
  const { signed, loading,  } = useContext(AuthContext);
  // const { setSnack } = useContext(SnackContext);
  
  if (loading) {
    return <Loading/>;
  }

  if(!signed) {
    return <Redirect to="/"/>
  }

  // if(rest.permission && !permissions[rest.permission]) {
  //   setSnack({ 
  //     message: 'Sem permissão!', 
  //     type: 'error', 
  //     open: true
  //   });
  //   return <Redirect to="/"/>
  // }
  
  return <Route {...rest}/>
}

export default PrivateRoute;