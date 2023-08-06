import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Adminpanel.css'

const Adminpanel = () => {
  const [userData, setUserData] = useState([]);
  const [viewStatus, setViewStatus] = useState('pending'); // New state for view status

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('https://clothedonationbackend.onrender.com/admin/getUserData');
      setUserData(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const markAsPicked = async (userId) => {
    try {
      
      await axios.put('https://clothedonationbackend.onrender.com/admin/markAsPicked', {
        userId: userId,
        status: 'Picked',
      });
    
      fetchUserData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  const filteredUserData = userData.filter((user) => user.status === viewStatus);

  return (
    <div>
      <h1>Admin Panel</h1>
      <button className='togglebtn' onClick={() => setViewStatus('pending')}>View Pending Requests</button>
      <button className='togglebtn' onClick={() => setViewStatus('Picked')}>View Completed Requests</button>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Address</th>
            <th>Mobile Number</th>
            <th>Items for donation</th>
            <th>Pickup Date</th>
            <th>Pickup Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredUserData.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.Name}</td>
              <td>{user.addressofuser}</td>
              <td>{user.MobileNumber}</td>
              <td>{user.dataArray.join(', ')}</td>
              <td>{user.date}</td>
              <td>{user.time}</td>
              <td>{user.status}</td>
             {user.status==='pending' ?  <button id='readbtn' onClick={() => markAsPicked(user._id)}>Mark as picked</button>:""}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Adminpanel;

