import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Header } from './container';
import { Navbar } from './components';
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import './App.css';
import Todo from "./components/donate/Todo";
import Contact from "./components/contact/Contact";
import Mydonations from "./components/Mydonations/Mypreviousdonations";
import AuthProvider, { AuthContext } from './components/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className='App'>
      <AuthProvider>
        <Router>
          <Switch>
            <Route exact path='/'>
              <Navbar />
              <Header />
            </Route>

            <Route path='/login'>
              <Login />
            </Route>

            <Route path='/register'>
              <Register />
            </Route>

            <PrivateRoute path='/donate'>
              <Todo/>
            </PrivateRoute>

            <Route path='/contact'>
              <Navbar/>
              <Contact />
            </Route>

            <PrivateRoute path='/mydonations'>
              <Mydonations />
            </PrivateRoute>
          </Switch>
          <ToastContainer /> 
        </Router>
      </AuthProvider>
    </div>
  );
};

// Custom PrivateRoute component to conditionally render the component based on isLoggedIn state
const PrivateRoute = ({ children, ...rest }) => {
  const { isLoggedIn } = React.useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

export default App;

