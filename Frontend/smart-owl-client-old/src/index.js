import React from 'react';
import ReactDOM from 'react-dom';

import { MuiThemeProvider } from "@material-ui/core";

import UiTheme from './themes';

import Routes from './routes';

import './index.css';

ReactDOM.render(
  <MuiThemeProvider theme={UiTheme}>
    <Routes />
  </MuiThemeProvider>,
  document.getElementById('root')
);