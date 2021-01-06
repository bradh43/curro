import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const font =  "'Poppins', sans-serif";

var muiTheme = createMuiTheme({
  typography: {
    fontFamily: font,
    button: {
      textTransform: 'none',
      borderRadius: '21px'
    }
  },
  palette: {
    primary: {
      main: '#DC1E65'
    },
    secondary: {
      main: '#8B51FF'
    },
    background: {
      main: '#fafafa',
    }
  },
  overrides: {
    MuiInput: {
      underline: {  
        '&:after': {
          borderBottom: '2px solid #8B51FF',
        },
        '&$focused:after': {
          borderBottomColor: '#8B51FF',
        },
      },
    }
  }
});
export const theme = responsiveFontSizes(muiTheme);