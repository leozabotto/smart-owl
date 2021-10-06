import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import CatalogoCursos from '../pages/public/CatalogoCursos';
import Login from '../pages/public/Login';

import SelecaoModulo from '../pages/public/SelecaoModulo';


const Routes = () => {

  return (
    <Router>
      <Switch>

        <Route 
          exact path="/"
          component={() => <SelecaoModulo />}
        />

        <Route
          path="/cursos"
          component={() => <CatalogoCursos/>}
        />

        
        <Route
          path="/login"
          component={() => <Login />}
        />

      </Switch>
    </Router>
  );
}

export default Routes;