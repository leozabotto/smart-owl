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

import AdmDashboard from '../pages/adm/Dashboard';

import AdmCourseList from '../pages/adm/Course/CourseList';
import AdmCourseCreate from '../pages/adm/Course/CourseCreate';

import AdmClassList from '../pages/adm/Class/ClassList';
import AdmClassCreate from '../pages/adm/Class/ClassCreate';

import browserHistory from '../history';

const Routes = () =>{
  return (
    <Router history={browserHistory}>
      <Switch>

        {/* Dashboard */}

        <PrivateRoute
          type="ADM" 
          exact path="/adm/dashboard" 
          component={() => <AdmDashboard />}
        /> 
           
        <PublicRoute 
          exact path="/" 
          component={() => <ChooseModule />} 
        />

        {/* Login */}
              
        <PublicRoute 
          exact path="/pub/login" 
          component={() => <Login type="PUB" />} 
        />

        <PublicRoute 
          exact path="/adm/login" 
          component={() => <Login type="ADM" />} 
        />

        {/* Cursos */}

        <PrivateRoute
          type="ADM" 
          exact path="/adm/cursos" 
          component={() => <AdmCourseList />}
        /> 

        <PrivateRoute
          type="ADM" 
          exact path="/adm/novo_curso" 
          component={() => <AdmCourseCreate />}
        /> 
           
        {/* Turmas */}

        <PrivateRoute
          type="ADM" 
          exact path="/adm/turmas" 
          component={() => <AdmClassList />}
        /> 

        <PrivateRoute
          type="ADM" 
          exact path="/adm/nova_turma" 
          component={() => <AdmClassCreate />}
        /> 
        
       
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default Routes;