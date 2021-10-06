import { IconButton } from '@material-ui/core';

const IconsButton = ({...props}) => {
  return (
    <IconButton
      color="primary"
      {...props}
    >
      {props.children}
    </IconButton>
  )
}

export default IconsButton;