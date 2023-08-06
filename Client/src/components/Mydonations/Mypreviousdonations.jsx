import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Mydonations.css'
import {useHistory} from "react-router-dom"
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

const Mypreviousdonations = () => {
  const history=useHistory();
  const [donationHistory, setDonationHistory] = useState([]);
  const {handleemailupdate, useremailid } = useContext(AuthContext);

  useEffect(() => {
    // console.log("fetched")
    fetchDonationHistory(useremailid);
  },[]);

  const fetchDonationHistory = async (userEmail) => {
    try {
      const response = await axios.get('https://clothedonationbackend.onrender.com/history', {
        params: {
          email:  useremailid ,
        },
      });
  
      if (response.status === 200) {
        // console.log(response.data);
        setDonationHistory(response.data);
      } else {
        console.error('Failed to fetch donation history.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  


  return (
    <div className="donation-history-container">
      <h1 className="donation-history-title">My Previous Donations</h1>
      {donationHistory.length === 0 ? (
        <p className="no-donation-msg">No donation history found for this user.</p>
      ) : (
        <ul className="donation-list">
          {donationHistory.map((donation) => (
            <li key={donation._id} className="donation-item">
              <span className="donation-data">
                Items donated: {donation.dataArray.join(', ')}
              </span>
              <span className="donation-status">
                <strong>Status:</strong> {donation.status}
              </span>
            </li>
          ))}
        </ul>

       
      )}
      <div style={{display:'flex' , alignItems:'center' , justifyContent:'center'}}>
      <button style={{border:'2px solid black'}} className='custom__button'onClick={()=>{history.push('/')}}>Home</button>
      </div>
    </div>
  );
};

export default Mypreviousdonations;
