import React from 'react';

import {
  Router,
  Switch,
  Route,
} from 'react-router-dom';

import ChooseModule from '../pages/public/ChooseModule';
import NotFound from '../pages/public/NotFound';
import Login from '../pages/public/Login';
import PublicRoute from './public.routes';
import PrivateRoute from './private.routes';


import browserHistory from '../history';

const Routes = () =>{
  return (
    <Router history={browserHistory}>
      <Switch>

        <PublicRoute 
          exact path="/" 
          component={() => <ChooseModule />} 
        />

        {/* Login */}
              
        <PublicRoute 
          exact path="/login" 
          component={() => <Login type="CAN" />} 
        />

        <PublicRoute 
          exact path="/adm/login" 
          component={() => <Login type="ADM" />} 
        />          

        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default Routes;