import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import SelecaoModulo from '../pages/public/SelecaoModulo';
import Login from '../pages/public/Login';

import PainelAdm from '../pages/adm/PainelAdm';

const Routes = () => {
  return (
    <Router>
      <Switch>

        <Route exact 
          path="/" 
          component={() => <SelecaoModulo />}
        />

        <Route 
          path="/login" 
          component={() => <Login />}
        />

        <Route 
          path="/adm/painel" 
          component={() => <PainelAdm />} 
        />

      </Switch>
    </Router>
  );
}

export default Routes;