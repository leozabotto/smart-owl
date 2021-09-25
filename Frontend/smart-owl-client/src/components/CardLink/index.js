import React from 'react';
import { Link } from 'react-router-dom';

import './index.css';

const CardLink = (props) => {

  return (
   <div className="card">
      <Link to={props.link} className="linkOfCard">
        <div className="cardLink">
          {props.icon}
          <h4>{props.children}</h4>
        </div>
      </Link>
    </div>
  );
};


export default CardLink;