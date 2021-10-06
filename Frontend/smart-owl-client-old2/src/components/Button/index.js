import { Button } from '@material-ui/core';

import './index.css';

const PrimaryButton = ({...props}) => {
  return (
    <Button 
      color="primary"
      className="button"
      disableRipple
      elevation={1}
      {...props}
    >
      {props.children}
    </Button>
  )
}

export default PrimaryButton;