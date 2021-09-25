import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import './index.css';

const ActionButton = ({ ...props }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="primary"
        className="button"
        disableRipple
        disableElevation
        {...props}
        >
        {props.label}
        <i className="material-icons">{props.icon}</i>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.actions.map(action => {
          return (
            <MenuItem key={action.text} component={Link} to={action.to} onClick={action.onClick}>{action.text}</MenuItem>)
         })}
      </Menu>
    </div>
  );
};

export default ActionButton;