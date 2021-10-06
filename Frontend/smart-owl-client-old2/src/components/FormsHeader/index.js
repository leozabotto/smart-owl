import React from 'react';
import { Divider } from '@material-ui/core';

import './index.css';

const FormsHeader = ({title, subtitle}) => {
  return (
    <div className="header">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

const FormSubtitle = ({title}) => {
  return (
    <div className="form-subtitle">
      <h3>{title}</h3>
      <Divider/>
  </div>
  )
}

export {FormsHeader, FormSubtitle};