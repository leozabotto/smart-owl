import React from 'react';
import { Link } from 'react-router-dom';

import { Divider } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import './index.css';

const style = {  
  color: '#93B523'
}

const HeaderTitle = ({title, subtitle, showBackButton, previousPage}) => {
  return (
    <div className="header">
      {
        showBackButton 
        ?        
        <div style={{ marginBottom: '10px'}}>
          <Link 
            to={previousPage}
            style={{...style}}
          >
            <ArrowBackIcon style={{color: "orange"}}/>
          </Link>
        </div>
        : ''
      }
      <h2>     
        {title}
      </h2>
      <p>{subtitle}</p>
    </div>
  );
}

const HeaderSubtitle = ({title}) => {
  return (
    <div className="header-subtitle">
      <h3>{title}</h3>
      <Divider/>
  </div>
  )
}

export {HeaderTitle, HeaderSubtitle};