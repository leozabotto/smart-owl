import React from 'react';

import {
  Router,
  Switch,
  Route,
} from 'react-router-dom';

import ChooseModule from '../pages/public/ChooseModule';
import NotFound from '../pages/public/NotFound';
// import CatalogoCursos from '../pages/public/CatalogoCursos';
import Login from '../pages/public/Login';
import CriarConta from '../pages/public/CriarConta';
import PublicRoute from './public.routes';

import PainelAdm from '../pages/adm/PainelAdm';
import Unidades from '../pages/adm/Unidades';
import Cursos from '../pages/adm/Cursos';
import Turmas from '../pages/adm/Turmas';

import PainelCand from '../pages/cand/PainelCand';
import CatalogoCursos from '../pages/cand/CatalogoCursos';

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

        {/* <PublicRoute 
          exact path="/cursos" 
          component={() => <CatalogoCursos />} 
        /> */}
       
        {/* Login */}
              
        <PublicRoute 
          exact path="/login" 
          component={() => <Login type="CAN" />} 
        />

        <PublicRoute 
          exact path="/criar_conta" 
          component={() => <CriarConta />} 
        />

        <PublicRoute 
          exact path="/adm/login" 
          component={() => <Login type="ADM" />} 
        />    

        {/* Administração */}

        <PrivateRoute
          exact path="/adm/painel" 
          component={() => <PainelAdm type="ADM" />} 
        /> 

        <PrivateRoute
          exact path="/adm/unidades" 
          component={() => <Unidades type="ADM" />} 
        /> 

        <PrivateRoute
          exact path="/adm/cursos" 
          component={() => <Cursos type="ADM" />} 
          permission="cadastros"
        />

        <PrivateRoute
          exact path="/adm/turmas" 
          component={() => <Turmas type="ADM" />} 
        />

        {/* Candidato */}
        
        <PrivateRoute
          exact path="/painel" 
          component={() => <PainelCand type="CAN" />} 
        /> 

        <PrivateRoute
          exact path="/cursos" 
          component={() => <CatalogoCursos ype="CAN" />} 
        />

        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default Routes;