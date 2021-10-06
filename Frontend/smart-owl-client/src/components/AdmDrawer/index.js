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
import MenuIcon from '@material-ui/icons/Menu';
import LocalShippingIcon from '@material-ui/icons/LocalShippingOutlined';
import AccountBalanceOutlinedIcon 
from '@material-ui/icons/AccountBalanceOutlined';
import SupervisorAccountIcon 
from '@material-ui/icons/SupervisorAccountOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import BusinessCenterOutlinedIcon
from '@material-ui/icons/BusinessCenterOutlined';
import AccountCircle from '@material-ui/icons/AccountCircleOutlined';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CategoryOutlinedIcon from '@material-ui/icons/CategoryOutlined';
import PlaceIcon from '@material-ui/icons/PlaceOutlined';
import PersonIcon from '@material-ui/icons/PersonOutlined';
import BorderColorOutlinedIcon from '@material-ui/icons/BorderColorOutlined';
import SupervisorAccount from '@material-ui/icons/SupervisorAccountOutlined';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { NavContext } from '../../contexts/NavContext';
import { AuthContext } from '../../contexts/AuthContext';

import './index.css';
import jwtDecode from 'jwt-decode';

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
  const [userType, setUserType] = useState();

  const history = useHistory();

  const { 
    register, 
    handleRegister,
    cashFlow,
    handleCashFlow,
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
       
        <ListItem button 
          classes={{ selected: classes.selected }} 
          component={Link} 
          to="/adm/cursos" 
          selected={location.pathname === "/adm/cursos"}
        >
          <ListItemIcon>
            <BorderColorOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Cursos" />
        </ListItem> 

        <ListItem button 
          classes={{ selected: classes.selected }} 
          component={Link} 
          to="/adm/turmas" 
          selected={location.pathname === "/adm/turmas"}
        >
          <ListItemIcon>
            <SupervisorAccount />
          </ListItemIcon>
          <ListItemText primary="Turmas" />
        </ListItem> 

        <ListItem button 
          classes={{ selected: classes.selected }} 
          component={Link} 
          to="/adm/unidades" 
          selected={location.pathname === "/adm/unidades"}
        >
          <ListItemIcon>
            <PlaceIcon />
          </ListItemIcon>
          <ListItemText primary="Unidades" />
        </ListItem>
        
        <ListItem button 
          classes={{ selected: classes.selected }} 
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
        
        <ListItem button 
          classes={{ selected: classes.selected }} 
          onClick={() => handleLogout()} 
        >
          <ListItemIcon>
            <ExitToAppIcon  />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>

        <ListItem button onClick={handleRegister} disabled>
          <ListItemIcon>
            <FolderOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Cadastros" />
          {register ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={register} timeout="auto" unmountOnExit>          
          <List component="div" disablePadding>
            
            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/cli/customers" 
              selected={location.pathname === "/cli/customers"}                         
            >
              <ListItemIcon>
                <BusinessCenterOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Clientes" />
            </ListItem>

            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/cli/suppliers" 
              selected={location.pathname === "/cli/suppliers"}             
            >
              <ListItemIcon>
                <LocalShippingIcon />
              </ListItemIcon>
              <ListItemText primary="Fornecedores" />
            </ListItem>

            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/cli/banks" 
              selected={location.pathname === "/cli/banks"}             
            >
              <ListItemIcon>
                <AccountBalanceOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Contas Bancárias" />
            </ListItem>                                            

            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/cli/operators" 
              selected={location.pathname === "/cli/operators"}              
            >
              <ListItemIcon>
                <SupervisorAccountIcon />
              </ListItemIcon>
              <ListItemText primary="Operadores" />
            </ListItem> 

            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/cli/categories" 
              selected={location.pathname === "/cli/categories"}                      
            >
              <ListItemIcon>
                <CategoryOutlinedIcon />
              </ListItemIcon> 
              <ListItemText primary="Categorias de Contas" />
            </ListItem> 
                       
          </List>     
        </Collapse>
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