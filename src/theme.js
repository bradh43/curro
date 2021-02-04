import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const font =  "'Poppins', Helvetica, sans-serif";

var muiTheme = createMuiTheme({
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
      main: '#F3F3F5',
    },
    text: {
      main: '#8AA0BD'
    }
  },
  font: {
    title: {
      main: "'Poppins', Helvetica, sans-serif",
    },
    body: {
      main: "Helvetica, sans-serif",
    }
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