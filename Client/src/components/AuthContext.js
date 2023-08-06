// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [useremailid, setuseremailid] = useState("");

  // Check for the logged-in status and user email in localStorage on component mount
  useEffect(() => {
    const storedLoggedInStatus = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('useremailid');

    if (storedLoggedInStatus === 'true') {
      setIsLoggedIn(true);
    }

    if (userEmail) {
      setuseremailid(userEmail);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // Save the logged-in status in localStorage
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Clear the logged-in status and user email from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('useremailid');
  };

  const handleemailupdate = (email) => {
    setuseremailid(email);
    // Save the user email in localStorage
    localStorage.setItem('useremailid', email);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, handleLoginSuccess, handleLogout, handleemailupdate, useremailid }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
