import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Header } from "./container";
import { Navbar } from "./components";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import "./App.css";
import Todo from "./components/donate/Todonate";
import Contact from "./components/contact/Contact";
import Mydonations from "./components/Mydonations/Mypreviousdonations";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Navbar />
            <Header />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/register">
            <Register />
          </Route>

          <Route path="/donate">
            <Todo />
          </Route>

          <Route path="/contact">
            <Navbar />
            <Contact />
          </Route>

          <Route path="/mydonations">
            <Mydonations />
          </Route>
        </Switch>
        <ToastContainer />
      </Router>
    </div>
  );
};

export default App;
