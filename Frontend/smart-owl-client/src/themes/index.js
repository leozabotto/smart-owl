import { createMuiTheme } from '@material-ui/core/styles';
import { ptBR } from '@material-ui/core/locale';

const UiTheme = createMuiTheme({
  typography: {
    fontFamily: [
      'Roboto',
      'sans-serif',
    ].join(','),
    fontWeight: 400,
  },
  palette: {
    primary: {
      light: '#e78504',
      main: '#e78504',
      nav: "#ffffff",
      contrastText: '#fff',
    },
    secondary: {
      main: '#000',
    },
    danger: {
      main: '#870000',
    },
    textPrimary: {
      main: '#fff'
    }
  },
}, ptBR);

export default UiTheme;