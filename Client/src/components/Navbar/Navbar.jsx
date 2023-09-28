import React, { useEffect, useState } from 'react';
import images from "../../constants/images";
import { useHistory } from "react-router-dom";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import "./Navbar.css";

const Navbar = () => {
  const [cookieValue, setCookieValue] = useState(null);

  useEffect(() => {
    // Retrieve the cookie when the component is mounted
    const myCookieValue = getCookie('id');
    // console.log('My Cookie Value:', myCookieValue);

    // Update the state with the cookie value
    setCookieValue(myCookieValue);
  }, []); // Empty dependency array ensures this effect runs once on mount

  function getCookie(cookieName) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === cookieName) {
        return decodeURIComponent(value);
      }
    }
    return null; // Return null if the cookie is not found
  }


  const history = useHistory();

  const handleloggoutClick = () => {
    axios.get("http://localhost:3000/logout", { withCredentials: true })
      .then((response) => {

        console.log('Response:', response);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    window.location.reload()
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


      {cookieValue ?
        <button className=' navbarbuttons p__opensans' onClick={handleloggoutClick}>
          Log Out
        </button>
        : <div className="app__navbar-login">
          <button className=' navbarbuttons p__opensans' onClick={() => { history.push('/login') }}>
            Log In/Sign Up
          </button>
        </div>}



    </div>
  );
}

export default Navbar;
