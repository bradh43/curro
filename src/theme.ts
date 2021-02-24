import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const font =  "'Poppins', Helvetica, sans-serif";

const muiTheme = createMuiTheme({
  typography: {
    fontFamily: font,
  },
  palette: {
    primary: {
      main: '#DC1E65'
    },
    secondary: {
      main: '#DC1E65'
    },
    background: {
      default: '#F3F3F5',
    },
    text: {
      primary: '#000000',
      secondary: '#8AA0BD'
    },
  },
  overrides: {
    MuiInput: {
      underline: {  
        '&:after': {
          borderBottom: '2px solid #8AA0BD',
        },
        '&$focused:after': {
          borderBottomColor: '#8AA0BD',
        },
      },
    },
    MuiTypography: {
      body1: {
        fontFamily: "Helvetica, sans-serif",
      },
      body2: {
        fontFamily: "Helvetica, sans-serif",
      },
      paragraph: {
        fontFamily: "Helvetica, sans-serif",
      }
    }
  }
});
export const theme = responsiveFontSizes(muiTheme);