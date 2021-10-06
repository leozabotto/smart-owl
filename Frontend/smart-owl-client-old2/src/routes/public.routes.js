import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';
import Loading from '../pages/public/Loading';

const PublicRoute = ({ type, ...rest }) => {

  const { signed, loading, role } = useContext(AuthContext);

  if (loading) {
    return <Loading/>;
  }

  if(signed) {
    if(role === 'ADM')
      return <Redirect to="/adm/dashboard" />
  }

  return <Route {...rest} />
}

export default PublicRoute;