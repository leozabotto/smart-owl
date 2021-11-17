import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';
import useQuery from '../contexts/hooks/useQuery';
import Loading from '../pages/public/Loading';

const PublicRoute = ({ type, ...rest }) => {

  const { signed, loading, role } = useContext(AuthContext);

  const query = useQuery();

  if (loading) {
    return <Loading/>;
  }

  if(signed) {
    if(role === 'MASTER' || role === 'ADM')
      return <Redirect to="/adm/painel" />
    if(role === 'CAND')
      return <Redirect to="/painel" />
  }

  return <Route {...rest} />
}

export default PublicRoute;