import React, { useEffect } from 'react';
import './App.css';
import { AuthProvider } from './auth';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { Home } from './pages/Home/Home';
import { UserCalendar } from './pages/Calendar/UserCalendar';
import { TeamCalendar } from './pages/Calendar/TeamCalendar';
import { Feed } from './pages/Feed/Feed';
import { About } from './pages/About/About';
import { Explore } from './pages/Explore/Explore';
import { Settings } from './pages/Settings/Settings';
import { PageNotFound } from './pages/PageNotFound/PageNotFound';
import { ProtectedRoute } from './protected.route';
import { Login } from './pages/Login/Login';
import { CreateAccount } from './pages/CreateAccount/CreateAccount'
import Header from './components/Header/Header';
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloLink } from "apollo-link";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import { onError } from "apollo-link-error";
import jwtDecode from 'jwt-decode'
import { setContext } from '@apollo/client/link/context';
import { cache } from './cache';
import { theme } from './theme';

let prod_uri_base = "devcloud.curro.us"
// let prod_uri_base = "curro-api.herokuapp.com"
// Connect to deployed backend if in production. Else localhost.
let uri = 'http://localhost:4000/graphql';
if (process.env.NODE_ENV === 'production'){
  uri = 'https://' + prod_uri_base + '/graphql';
}

const httpLink = createUploadLink({
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
  credentials: 'include',
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

function App() {

  useEffect(() => {
    let refresh_uri = 'http://localhost:4000/refresh_token';
    if (process.env.NODE_ENV === 'production'){
      refresh_uri = 'https://' + prod_uri_base + '/refresh_token';
    }
    fetch(refresh_uri, {
      method: "POST",
      credentials: "include"
    }).then(async response => {
      const response_json = await response.json();
      if(response_json.success && response_json.token){
        localStorage.setItem("token", response_json.token)
      }
    });
  }, []);

  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Header/>
            <Switch>
              <ProtectedRoute exact path='/' component={ UserCalendar }/>
              <Route exact path='/home' component={ Home }/>
              <Route exact path='/about' component={ About }/>
              <Route exact path='/login' component={ Login }/>
              <Route exact path='/create' component={ CreateAccount }/>
              <Route exact path='/createAccount' component={ CreateAccount }/>
              <ProtectedRoute exact path='/explore' component={ Explore }/>
              <ProtectedRoute exact path='/search' component={ Explore }/>
              <ProtectedRoute exact path='/calendar' component={ UserCalendar }/>
              <ProtectedRoute exact path='/user/:userid' component={ UserCalendar }/>
              <ProtectedRoute exact path='/team/:teamid' component={ TeamCalendar }/>
              <ProtectedRoute exact path='/feed' component={ Feed }/>
              <ProtectedRoute exact path='/newsfeed' component={ Feed }/>
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
