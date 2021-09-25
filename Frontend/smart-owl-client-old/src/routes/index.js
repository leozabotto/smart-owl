import React from 'react';
import {
  Switch,
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import ChooseModule from '../pages/Public/ChooseModule';
import InDevelopment from '../pages/Public/InDevelopment';
import NotFound from '../pages/Public/NotFound';

const Routes = (props) => {

  return (
    <Router>
      <Switch>
        <Route 
          exact path="/" 
          component={() => <ChooseModule/>}         
        />

        <Route 
          exact path="/adm/login" 
          component={() => <h1>Login Adm</h1>} 
        />

        <Route 
          exact path="/pub/login" 
          component={() => <InDevelopment />} 
        />

        <Route      
          component={() => <NotFound />} 
        />
      </Switch>
    </Router>
  )

}

export default Routes;