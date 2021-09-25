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
      light: '#f9fbe7',
      main: '#43004E',
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
  }
}, ptBR);

export default UiTheme;