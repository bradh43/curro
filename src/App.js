import React from 'react';
import './App.css';
import { AuthProvider } from './auth';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import { Home } from './pages/Home';
import { Calendar } from './pages/Calendar/Calendar';
import { Feed } from './pages/Feed';
import { Profile } from './pages/Profile/Profile';
import { Team } from './pages/Team/Team';
import { About } from './pages/About';
import { Explore } from './pages/Explore/Explore';
import { Settings } from './pages/Settings';
import { PageNotFound } from './pages/PageNotFound';
import { ProtectedRoute } from './protected.route';
import { Login } from './pages/Login';
import { CreateAccount } from './pages/CreateAccount'
import Header from './components/Header';
import { ApolloClient, createHttpLink, ApolloProvider } from '@apollo/client';
import { ApolloLink } from "apollo-link";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import { onError } from "apollo-link-error";
import jwtDecode from 'jwt-decode'
import { setContext } from '@apollo/client/link/context';
import { cache } from './cache';

let prod_uri_base = "curro-api.herokuapp.com"
// Connect to deployed backend if in production. Else localhost.
let uri = 'http://localhost:4000/graphql';
if (process.env.NODE_ENV === 'production'){
  uri = 'https://' + prod_uri_base + '/graphql';
}

const httpLink = createHttpLink({
  uri: uri,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ?  token : "",
    }
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: "token",
      isTokenValidOrUndefined: () => {
        const token = localStorage.getItem('token');
        if (!token) {
          return true;
        }

        try {
          const { exp } = jwtDecode(token);
          test = jwtDecode(token)
          if (Date.now() >= exp * 1000) {
            return false;
          } else {
            return true;
          }
        } catch {
          return false;
        }
      },
      fetchAccessToken: () => {
        let refresh_uri = 'http://localhost:4000/refresh_token';
        if (process.env.NODE_ENV === 'production'){
          refresh_uri = 'https://' + prod_uri_base + '/refresh_token';
        }
        return fetch(refresh_uri, {
          method: "POST",
          credentials: "include"
        });
      },
      handleFetch: accessToken => {
        if(accessToken){
          localStorage.setItem("token", accessToken)
        } else {
          localStorage.removeItem('token')
        }
      },
      handleError: error => {
        console.error(error);
      }
    }),
    onError(({ graphQLErrors, networkError }) => {
      console.log(graphQLErrors);
      console.log(networkError);
    }),
    authLink,
    httpLink
  ]),
  cache
});

var theme = createMuiTheme({
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
theme = responsiveFontSizes(theme);

function App() {

  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Header/>
            <Switch>
              <ProtectedRoute exact path='/' component={ Feed }/>
              <Route exact path='/home' component={ Home }/>
              <Route exact path='/about' component={ About }/>
              <Route exact path='/login' component={ Login }/>
              <Route exact path='/create' component={ CreateAccount }/>
              <Route exact path='/createAccount' component={ CreateAccount }/>
              <ProtectedRoute exact path='/explore' component={ Explore }/>
              <ProtectedRoute exact path='/search' component={ Explore }/>
              <ProtectedRoute exact path='/calendar' component={ Calendar }/>
              <ProtectedRoute exact path='/cal' component={ Calendar }/>
              <ProtectedRoute exact path='/feed' component={ Feed }/>
              <ProtectedRoute exact path='/newsfeed' component={ Feed }/>
              <ProtectedRoute exact path='/profile' component={ Profile }/>
              <ProtectedRoute exact path='/profile/:userid' component={ Profile }/>
              <ProtectedRoute exact path='/team/:teamid' component={ Team }/>
              <ProtectedRoute exact path='/setting' component={ Settings }/>
              <ProtectedRoute exact path='/settings' component={ Settings }/>
              <Route exact path='/error' component={ PageNotFound }/>
              <Route exact path='/404' component={ PageNotFound }/>
              <Route exact path='*' component={ PageNotFound }/>
            </Switch>
          </BrowserRouter>
        </ThemeProvider>
      </ApolloProvider>
    </AuthProvider>
  );
}
export default App;
