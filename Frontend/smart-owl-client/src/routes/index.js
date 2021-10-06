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

import PainelAdm from '../pages/adm/PainelAdm';
import Unidades from '../pages/adm/Unidades';
import Cursos from '../pages/adm/Cursos';

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

        {/* Administração */}

        <PrivateRoute
          exact path="/adm/painel" 
          component={() => <PainelAdm type="MASTER" />} 
        /> 

        <PrivateRoute
          exact path="/adm/unidades" 
          component={() => <Unidades type="ADM" />} 
        /> 

        <PrivateRoute
          exact path="/adm/cursos" 
          component={() => <Cursos type="ADM" />} 
        /> 

  

        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default Routes;