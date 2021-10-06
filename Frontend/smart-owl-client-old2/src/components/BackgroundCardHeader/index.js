import React from 'react';

import './index.css';

const BackgroundCardHeader = (props) => {

  return (
  
  <div className="background-card-header">
    <h2 className="title">      
      {props.title}
    </h2>
    <div className="action-buttons">
      { props.children }
    </div>
  </div>        
  );
};


export default BackgroundCardHeader;