import React from 'react';
import { images } from "../../constants";
import './Header.css';
import SubHeading from '../../components/SubHeading/SubHeading';
import { useHistory } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../../components/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const history = useHistory();
  const { isLoggedIn } = useContext(AuthContext);

  const handleDonateClick = () => {
    if (isLoggedIn) {
      history.push('/donate');
    } else {
      toast.error("Please login to donate");
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
          {isLoggedIn ?
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
