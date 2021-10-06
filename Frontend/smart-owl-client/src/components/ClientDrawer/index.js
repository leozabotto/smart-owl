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
import PersonIcon from '@material-ui/icons/Person';
import LocalShippingIcon from '@material-ui/icons/LocalShippingOutlined';
import AccountBalanceOutlinedIcon 
from '@material-ui/icons/AccountBalanceOutlined';
import SupervisorAccountIcon 
from '@material-ui/icons/SupervisorAccountOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import BusinessCenterOutlinedIcon
from '@material-ui/icons/BusinessCenterOutlined';
import AccountCircle from '@material-ui/icons/AccountCircleOutlined';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CategoryOutlinedIcon from '@material-ui/icons/CategoryOutlined';
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined';
import AccountBalanceWallet 
from '@material-ui/icons/AccountBalanceWalletOutlined';
import CheckIcon 
from '@material-ui/icons/CheckOutlined';
import MonetizationIcon 
from '@material-ui/icons/MonetizationOnOutlined';
import DoneAllIcon from '@material-ui/icons/DoneAllOutlined';
import PublishIcon from '@material-ui/icons/PublishOutlined';

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
    borderRight: '5px solid var(--green)',
  },
}));

const ClientDrawer = (props) => {
  const { user, handleLogout, permissions } = useContext(AuthContext);

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
          to="/cli/dashboard" 
          selected={location.pathname === "/cli/dashboard"}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Início" />
        </ListItem>

        {permissions.register ? <>
        <ListItem button onClick={handleRegister}>
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
        </Collapse> </>: ''}

        {permissions.financial ?
        <>
        <ListItem button onClick={handleCashFlow}>
          <ListItemIcon>
            <AttachMoneyOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Financeiro" />
          {cashFlow ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={cashFlow} timeout="auto" unmountOnExit>          
          <List component="div" disablePadding>
            
            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/cli/payable_accounts" 
              selected={location.pathname === "/cli/payable_accounts"}              
            >
              <ListItemIcon>
                <AccountBalanceWallet />
              </ListItemIcon>
              <ListItemText primary="Contas a Pagar" />
            </ListItem>

            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/cli/paid_accounts" 
              selected={location.pathname === "/cli/paid_accounts"}                          
            >
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              <ListItemText primary="Contas Pagas" />
            </ListItem>

            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/cli/receivable_accounts" 
              selected={location.pathname === "/cli/receivable_accounts"}                           
            >
              <ListItemIcon>
                <MonetizationIcon />
              </ListItemIcon>
              <ListItemText primary="Contas a Receber" />
            </ListItem>
            
            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/cli/received_accounts" 
              selected={location.pathname === "/cli/received_accounts"}                          
            >
              <ListItemIcon>
                <DoneAllIcon />
              </ListItemIcon>
              <ListItemText primary="Contas Recebidas" />
            </ListItem>
            
            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/cli/statement" 
              selected={location.pathname === "/cli/statement"}          
            >
              <ListItemIcon>
                <DescriptionOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Extrato" />
            </ListItem>

            {/* <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/cli/in_progress" 
              selected={location.pathname === "/cli/cash_flow"}
              disabled
            >
              <ListItemIcon>
                <BarChartOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Fluxo de Caixa" />
            </ListItem> */}

            {/*<ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/cli/in_progress" 
              selected={location.pathname === "/cli/invoices"}
              disabled
            >
              <ListItemIcon>                
                <LocalAtmIcon />
              </ListItemIcon>
              <ListItemText primary="Boletos" />
            </ListItem>

            */}                                    
            </List> 
        </Collapse>
        </>   
        : '' } 

        {permissions.accountPosting ? 
        <ListItem button 
          classes={{ selected: classes.selected }} 
          component={Link} 
          to="/cli/account_posting" 
          selected={location.pathname === "/cli/account_posting"}
        >
          <ListItemIcon>
            <PublishIcon />
          </ListItemIcon>
          <ListItemText primary="Lançamento" />
        </ListItem>
        : ''}
      
        {/*<ListItem button 
          classes={{ selected: classes.selected }} 
          component={Link} 
          to="/cli/in_progress" 
          selected={location.pathname === '/cli/settings'}
          disabled
        >
          <ListItemIcon>
            <FileIcon />
          </ListItemIcon>
          <ListItemText primary="Arquivos" />
        </ListItem>*/}

        {/*<ListItem button 
          classes={{ selected: classes.selected }} 
          component={Link} 
          to="/cli/in_progress" 
          selected={location.pathname === '/cli/settings'}
          disabled
        >
          <ListItemIcon>
            <SettingsOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Configurações" />
        </ListItem>*/}
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
                  <h2>Cliente</h2>
                </div>
                <Divider />
              </div>
              <div className="user">
                <div className="user-info">
                  <Avatar className="avatar">{ user.name[0] }</Avatar>
                  <h3>{ user.name } { user.lastName }</h3>
                </div>
                <div className="actions">
                  <Link to="/cli/profile/"><PersonIcon />Meu Perfil</Link>
                  <p>/</p>
                  <button onClick={handleLogout}><ExitToAppIcon />Sair</button>
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

export default ClientDrawer;