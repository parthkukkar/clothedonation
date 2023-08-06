import React, { useContext } from 'react';
import images from "../../constants/images";
import { useHistory } from "react-router-dom";
import { AuthContext } from '../AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./Navbar.css";

const Navbar = () => {
  const history = useHistory();
  const { isLoggedIn, handleLogout } = useContext(AuthContext);

  const handleLogoutClick = () => {
    handleLogout();
    toast.success("Logged out successfully");
    history.push('/');
  };

  return (
    <div className="app__navbar">
      <div className="app__navbar-logo">
        <img src={images.logo2} alt="logo" />
      </div>

      <ul className="app__navbar-links">
        <li className="p__opensans">
          <button className='navbarbuttons' onClick={() => { history.push('/') }}>Home</button>
        </li>

        <li className="p__opensans">
          <button className='navbarbuttons' onClick={() => { history.push('/contact') }}>About & Contact</button>
        </li>
      </ul>

      {!isLoggedIn ?
        <div className="app__navbar-login">
          <button className=' navbarbuttons p__opensans' onClick={() => { history.push('/login') }}>
            Log In/Sign Up
          </button>
        </div>
        :
        <div className="app__navbar-login">
          <button className="navbarbuttons p__opensans" onClick={handleLogoutClick}>
            Log Out
          </button>
        </div>
      }
    </div>
  );
}

export default Navbar;
