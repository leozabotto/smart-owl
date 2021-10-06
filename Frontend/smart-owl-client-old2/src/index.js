import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';

import { MuiThemeProvider } from "@material-ui/core";

import { SnackProvider } from './contexts/SnackContext';
import { AuthProvider } from './contexts/AuthContext';
import { NavProvider } from './contexts/NavContext';

import UiTheme from "./themes";

import './index.css';

ReactDOM.render(
  <MuiThemeProvider theme={UiTheme}>
    <SnackProvider>
      <NavProvider>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </NavProvider>
    </SnackProvider>
  </MuiThemeProvider>,

  document.getElementById('root')
);
