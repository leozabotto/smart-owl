import React from 'react';

import {
  Router,
  Switch,
  Route,
} from 'react-router-dom';

import SelecaoModulo from '../pages/public/SelecaoModulo';
import NotFound from '../pages/public/NotFound';
// import CatalogoCursos from '../pages/public/CatalogoCursos';
import Login from '../pages/public/Login';
import CriarConta from '../pages/public/CriarConta';
import PublicRoute from './public.routes';

import PainelAdm from '../pages/adm/PainelAdm';
import Unidades from '../pages/adm/Unidades';
import Cursos from '../pages/adm/Cursos';
import Turmas from '../pages/adm/Turmas';
import BancoRedacao from '../pages/adm/BancoRedacao';
import BancoQuestoes from '../pages/adm/BancoQuestoes';

import PainelCand from '../pages/cand/PainelCand';
import CatalogoCursos from '../pages/public/CatalogoCursos';

import PrivateRoute from './private.routes';
import browserHistory from '../history';
import MeusDados from '../pages/cand/MeusDados';
import HistoricoInscricoes from '../pages/cand/HistoricoInscricoes';
import CatalogoCursosPriv from '../pages/cand/CatalogoCursosPriv';

const Routes = () =>{
  return (
    <Router history={browserHistory}>
      <Switch>

        <PublicRoute 
          exact path="/" 
          component={() => <SelecaoModulo />} 
        />
       
        <PublicRoute 
          exact path="/cursos" 
          component={() => <CatalogoCursos />} 
        />

        <PrivateRoute 
          exact path="/cursos_priv" 
          component={() => <CatalogoCursosPriv />} 
        />
       
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

        {/*

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
        
        <PrivateRoute
          exact path="/adm/banco_redacao" 
          component={() => <BancoRedacao type="ADM" />} 
        />

        <PrivateRoute
          exact path="/adm/banco_questoes" 
          component={() => <BancoQuestoes type="ADM" />} 
        />*/}

        {/* Candidato */}
        
       

        <PrivateRoute
          exact path="/painel" 
          component={() => <PainelCand type="CAN" />} 
        /> 

        <PrivateRoute
          exact path="/meus_dados" 
          component={() => <MeusDados type="CAN" />} 
        /> 

        <PrivateRoute
          exact path="/historico_inscricoes" 
          component={() => <HistoricoInscricoes type="CAN" />} 
        /> 



        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default Routes;