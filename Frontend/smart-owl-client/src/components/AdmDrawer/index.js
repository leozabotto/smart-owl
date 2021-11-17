import React, { useContext, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import { Avatar, Collapse, Divider, Grid, Hidden } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ListItemText from '@material-ui/core/ListItemText';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import StorageOutlinedIcon from '@material-ui/icons/StorageOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import AccountCircle from '@material-ui/icons/AccountCircleOutlined';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PlaceIcon from '@material-ui/icons/PlaceOutlined';
import PersonIcon from '@material-ui/icons/PersonOutlined';
import BorderColorOutlinedIcon from '@material-ui/icons/BorderColorOutlined';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { NavContext } from '../../contexts/NavContext';
import { AuthContext } from '../../contexts/AuthContext';

import './index.css';

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      zIndex: theme.zIndex.drawer + 1,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: {
    [theme.breakpoints.down('sm')]: theme.mixins.toolbar,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
    },
  },
  selected: {
    borderRight: '5px solid purple',
  },
}));

const AdmDrawer = (props) => {

  const { user, handleLogout, permissions } = useContext(AuthContext);

  const history = useHistory();

  const { 
    register, 
    handleRegister, 
    selectiveProcess,
    handleSelectiveProcess
  } = useContext(NavContext);
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMenu = Boolean(anchorEl);

  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <div>
      <List
        component="nav"
      >
        <ListItem button 
          classes={{ selected: classes.selected }} 
          component={Link} 
          to="/adm/painel" 
          selected={location.pathname === "/adm/painel"}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Início" />
        </ListItem> 


        {!permissions.super_usuario && !permissions.cadastros
        ? ''
        :
          <>
          <ListItem button onClick={handleRegister}>
            <ListItemIcon>
              <FolderOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Cadastros" />
            {register ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={register} timeout="auto" unmountOnExit>    

            <ListItem button 
              classes={{ selected: classes.selected }} 
              component={Link} 
              className="listSpacing" 
              to="/adm/cursos" 
              selected={location.pathname === "/adm/cursos"}            
            >
              <ListItemIcon>
                <BorderColorOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Cursos" />
            </ListItem> 

            {!permissions.super_usuario ? '' : <>
            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/adm/usuarios" 
              selected={location.pathname === "/adm/usuarios"}
              disabled
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Usuários" />
            </ListItem>
        
           
            <List component="div" disablePadding>                                 
              <ListItem button 
                classes={{ selected: classes.selected }} 
                className="listSpacing" 
                component={Link} 
                to="/adm/unidades" 
                selected={location.pathname === "/adm/unidades"}
              >
                <ListItemIcon>
                  <PlaceIcon />
                </ListItemIcon>
                <ListItemText primary="Unidades" />
              </ListItem>                
            </List>     
            </>}
          </Collapse>          
          </>
        }
       
      {!permissions.super_usuario && !permissions.processo_seletivo
        ? ''
        :
        <>        
        <ListItem button onClick={handleSelectiveProcess}>
          <ListItemIcon>
            <AssignmentTurnedInOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Processo Seletivo" />
          {selectiveProcess ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={selectiveProcess} timeout="auto" unmountOnExit> 
          <ListItem button 
            classes={{ selected: classes.selected }} 
            component={Link} 
            className="listSpacing" 
            to="/adm/turmas" 
            selected={location.pathname === "/adm/turmas"}            
          >
            <ListItemIcon>
              <GroupOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Turmas" />
          </ListItem>   
          <ListItem button 
            classes={{ selected: classes.selected }} 
            component={Link} 
            className="listSpacing" 
            to="/adm/banco_questoes" 
            selected={location.pathname === "/adm/banco_questoes"} 
            disabled           
          >
            <ListItemIcon>
              <CreateOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Questões" />
          </ListItem> 

          <ListItem button 
            classes={{ selected: classes.selected }} 
            component={Link} 
            className="listSpacing" 
            to="/adm/banco_redacao" 
            selected={location.pathname === "/adm/banco_redacao"}   
            disabled         
          >
            <ListItemIcon>
              <DescriptionOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Redação" />
          </ListItem> 
                                   
        </Collapse>  
        </>
      }                        
                      
        <ListItem button 
          classes={{ selected: classes.selected }} 
          onClick={() => handleLogout()} 
        >
          <ListItemIcon>
            <ExitToAppIcon  />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>       
      </List>
    </div>
  );

  const container = window !== undefined ? 
  () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <div className="drawer-mobile">
        <Hidden mdUp>
          <CssBaseline />
          <AppBar 
            elevation={0} 
            position="fixed" 
            className={classes.appBar} 
            color="primary">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Grid
                justify="space-between"
                alignItems="center"
                container
              >
                <Grid item>
                  <Typography variant="h6" noWrap>
                    {props.title}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={openMenu}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => history.push('/cli/profile')}>Meu Perfil</MenuItem>
                    <MenuItem onClick={handleLogout}>Sair</MenuItem>
                  </Menu>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
        </Hidden>
      </div>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden mdUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <div className="drawer">
              {drawer}
            </div>
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <div className="container-info">
              <div className="module-name">
                <div className="name">
                  <h2>ADM</h2>
                </div>
                <Divider />
              </div>
              <div className="user">
                <div className="user-info">
                  <Avatar className="avatar">{ user.nome[0] }</Avatar>
                  <h3>{ user.nome }</h3>
                </div>               
              </div>
            </div>
            <Divider />
            <div className="drawer">
              {drawer}
            </div>
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
}

export default AdmDrawer;