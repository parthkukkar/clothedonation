import { images } from "../../constants";
import React, { useEffect, useState } from 'react';
import './Header.css';
import SubHeading from '../../components/SubHeading/SubHeading';
import { useHistory } from "react-router-dom";
import { useContext } from 'react';
// import { AuthContext } from '../../components/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const [cookieValue, setCookieValue] = useState(null);
  useEffect(() => {
    // Retrieve the cookie when the component is mounted
    const myCookieValue = getCookie('id');
    console.log('My Cookie Value:', myCookieValue);

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
  // const { isLoggedIn } = useContext(AuthContext);

  const handleDonateClick = () => {

    if (!cookieValue) {
      toast.error("Please log in to donate!");
    }else{
      history.push('/donate')
    }
  
  };
  
  

  return (
    <div className='app__header app__wrapper section__padding' id='home'>
      <div className="app__wrapper_info">
        <SubHeading title="Let's Donate" />
        
        
        <h2 className='app__header-h1'>Happiness doesn’t result from what we get, but from what we give</h2>
        <h2 className='app__header-h1'>Place your donation request and we will pick your old clothes from your address and give them to the needy</h2>

        <div className="headerbuttonscont">
          <button style={{ marginRight: '30px' }} className="custom__button" onClick={handleDonateClick}>Donate Now</button>
          {cookieValue?
            <button className="custom__button" onClick={() => { history.push('/mydonations') }}>My previous donations</button>
            : ""}
        </div>
      </div>
     
      
		

      <div className="app__wrapper_img">
        <img src={images.donationimg} alt="" />
      </div>
    </div>
  );
};

export default Header;
