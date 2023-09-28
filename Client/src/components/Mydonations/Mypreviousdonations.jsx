import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Mydonations.css'
import { useHistory } from "react-router-dom"

const Mypreviousdonations = () => {
  const history = useHistory();
  const [donationHistory, setDonationHistory] = useState([]);


  useEffect(() => {

    fetchDonationHistory();
  }, []);

  const fetchDonationHistory = async () => {
    axios.get("http://localhost:3000/history", { withCredentials: true })
      .then(res => {



        setDonationHistory(res.data);


      })
      .catch(error => {
        alert("Error!")
      });

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button style={{ border: '2px solid black' }} className='custom__button' onClick={() => { history.push('/') }}>Home</button>
      </div>
    </div>
  );
};

export default Mypreviousdonations;
