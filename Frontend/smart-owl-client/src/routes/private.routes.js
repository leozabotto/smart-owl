import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';
import Loading from '../pages/public/Loading';

const PrivateRoute = ({ ...rest }) => {

  const { signed, loading, permissions, role } = useContext(AuthContext);

  if (loading) {
    return <Loading/>;
  }

  if(!signed || rest.type !== role) {
    return <Redirect to="/"/>
  } 
  
  return <Route {...rest}/>
}

export default PrivateRoute;