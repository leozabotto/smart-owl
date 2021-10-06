import React, { useContext, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

// Material UI
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
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';

import MenuIcon from '@material-ui/icons/Menu';
import MonetizationIcon from '@material-ui/icons/MonetizationOnOutlined'
import PersonIcon from '@material-ui/icons/Person';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccountOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import BusinessCenterOutlinedIcon from '@material-ui/icons/BusinessCenterOutlined';
import AccountCircle from '@material-ui/icons/AccountCircleOutlined';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DomainIcon from '@material-ui/icons/Domain';
import ExpandLess from '@material-ui/icons/ExpandLess';
import FileIcon 
from '@material-ui/icons/InsertDriveFileOutlined';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AccountBalanceWallet 
from '@material-ui/icons/AccountBalanceWalletOutlined';
import CheckIcon 
from '@material-ui/icons/CheckOutlined';
import DoneAllIcon from '@material-ui/icons/DoneAllOutlined';
import LocalAtmIcon from '@material-ui/icons/LocalAtmOutlined';
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined';
import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

// Custom Components
import { NavContext } from '../../contexts/NavContext';
import { AuthContext } from '../../contexts/AuthContext';

// Assets
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


const AccountingDrawer = (props) => {
  const { user, handleLogout, permissions } = useContext(AuthContext);

  const history = useHistory();

  const { 
    register, 
    handleRegister ,
    cashFlow,
    handleCashFlow
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
          to="/acc/dashboard" 
          selected={location.pathname === "/acc/dashboard"}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Início" />
        </ListItem>

        {permissions.register ?
        <ListItem button onClick={handleRegister} disabled>
          <ListItemIcon>
            <FolderOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Cadastros" />
          {register ? <ExpandLess /> : <ExpandMore />}
        </ListItem> : ''}

        <Collapse in={register} timeout="auto" unmountOnExit>
          
          <List component="div" disablePadding>
            
            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/acc/clients" 
              selected={location.pathname === "/acc/clients"}
            >
              <ListItemIcon>
                <BusinessCenterOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Clientes" />
            </ListItem>

            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" component={Link} to="/acc/in_progress" 
              selected={location.pathname === "/acc/departments"}
            >
              <ListItemIcon>
                <DomainIcon />
              </ListItemIcon>
              <ListItemText primary="Departamentos" />
            </ListItem>
                  
            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" component={Link} 
              to="/acc/operators" 
              selected={location.pathname === "/acc/operators"}
            >
              <ListItemIcon>
                <SupervisorAccountIcon />
              </ListItemIcon>
              <ListItemText primary="Operadores" />
            </ListItem>
          </List>
         
        </Collapse>

        {/* <ListItem classes={{ selected: classes.selected }} button component={Link} to="/acc/calls" selected={location.pathname === '/acc/calls'}>
          <ListItemIcon>
            <PhoneIcon />
          </ListItemIcon>
          <ListItemText primary="Chamados" />
        </ListItem> */}

        <ListItem button onClick={handleCashFlow} disabled>
          <ListItemIcon>
            <AttachMoneyOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Financeiro de Clientes" />
          {cashFlow ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={cashFlow} timeout="auto" unmountOnExit>          
          <List component="div" disablePadding>
            
            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/acc/in_progress" 
              selected={location.pathname === "/acc/payable_accounts"}              
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
              to="/acc/in_progress" 
              selected={location.pathname === "/acc/paid_accounts"}                          
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
              to="/acc/in_progress" 
              selected={location.pathname === "/acc/receivable_accounts"}                           
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
              to="/acc/in_progress" 
              selected={location.pathname === "/acc/received_accounts"}                          
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
              to="acc/in_progress" 
              selected={location.pathname === "/acc/cash_flow"}
        
            >
              <ListItemIcon>
                <BarChartOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Fluxo de Caixa" />
            </ListItem>

            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="acc/in_progress" 
              selected={location.pathname === "/acc/invoices"}
              disabled
            >
              <ListItemIcon>                
                <LocalAtmIcon />
              </ListItemIcon>
              <ListItemText primary="Boletos" />
            </ListItem>

            <ListItem button 
              classes={{ selected: classes.selected }} 
              className="listSpacing" 
              component={Link} 
              to="/acc/in_progress" 
              selected={location.pathname === "/acc/extrato"}
            >
              <ListItemIcon>
                <DescriptionOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Extratos" />
            </ListItem>                                     
          </List>     
        </Collapse> 

        <ListItem button 
          classes={{ selected: classes.selected }} 
          component={Link} 
          to="/acc/in_progress" 
          selected={location.pathname === '/acc/files'}
          disabled
        >
          <ListItemIcon>
            <FileIcon />
          </ListItemIcon>
          <ListItemText primary="Arquivos" />
        
        </ListItem>

        <ListItem button 
          classes={{ selected: classes.selected }} 
          component={Link} 
          to="/acc/in_progress" 
          selected={location.pathname === '/acc/info'}
          disabled
        >
          <ListItemIcon>
            <InfoOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Informações do Escritório" />
        
        </ListItem>

        <ListItem button 
          classes={{ selected: classes.selected }} 
          component={Link} 
          to="/acc/in_progress" 
          selected={location.pathname === '/acc/settings'}
          disabled
        >
          <ListItemIcon>
            <SettingsOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Configurações" />
        
        </ListItem>

        </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <div className="drawer-mobile">
        <Hidden mdUp>
          <CssBaseline />
          <AppBar 
            elevation={0} 
            position="fixed" 
            className={classes.appBar} 
            color="primary"
          >
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
                    <MenuItem onClick={() => history.push('/acc/profile')}>Meu Perfil</MenuItem>
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
                  <h2>Contabilidade</h2>
                </div>
                <Divider />
              </div>
              <div className="user">
                <div className="user-info">
                  <Avatar className="avatar">{ user.name[0] }</Avatar>
                  <h3>{ user.name }</h3>
                </div>
                <div className="actions">
                  <Link to="/acc/profile"><PersonIcon />Meu Perfil</Link>
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


export default AccountingDrawer;