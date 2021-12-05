import React, { 
  useContext, 
  useState 
} from 'react';

import {
   Link, 
   useHistory, 
   useLocation 
} from 'react-router-dom';

import { 
  Avatar, 
  Divider, 
  Grid, 
  Hidden,
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  IconButton,
  ListItem,
  MenuItem,
  Menu,
  ListItemText,
} from '@material-ui/core';

import { 
  makeStyles, 
  useTheme 
} from '@material-ui/core/styles';

import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuBookIcon from '@material-ui/icons/MenuBookOutlined';
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import AccountCircle from '@material-ui/icons/AccountCircleOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';

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
  const history = useHistory();
  
  const { window } = props;
  const { user, handleLogout } = useContext(AuthContext);

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
          to="/painel" 
          selected={location.pathname === "/painel"}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Início" />
        </ListItem> 
                                         
        <ListItem button 
          classes={{ selected: classes.selected }}          
          component={Link} 
          to="/cursos_priv" 
          selected={location.pathname === "/cursos_priv"}
        >
          <ListItemIcon>
            <MenuBookIcon />
          </ListItemIcon>
          <ListItemText primary="Catálogo de Cursos" />
        </ListItem>

        <ListItem button 
          classes={{ selected: classes.selected }}          
          component={Link} 
          to="/historico_inscricoes" 
          selected={location.pathname === "/historico_inscricoes"}
        >
          <ListItemIcon>
            <HistoryOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Histórico de Inscrições" />
        </ListItem>

        <ListItem button 
          classes={{ selected: classes.selected }}          
          component={Link} 
          to="/meus_dados" 
          selected={location.pathname === "/meus_dados"}
        >
          <ListItemIcon>
            <PersonOutlineOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Meus Dados" />
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
              keepMounted: true,
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
                  <h2>CANDIDATO</h2>
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