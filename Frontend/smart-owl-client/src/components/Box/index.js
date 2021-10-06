import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import IconsButton from '../IconButton';
import mainLogo from '../../assets/img/mainLogo.png';

import './index.css';

const Box = ({ ...props }) => {
  return (
    <div className="box">
      <div className="page-return">
        <Link to={props.link}><IconsButton size="medium"><ArrowBackIcon /></IconsButton></Link>
      </div>
      <div className="logo-header">
        <img src={mainLogo} alt="Smart Owl" />
        <h4>{props.title}</h4>
      </div>
      {props.children}
    </div>
  );
}

export default Box;