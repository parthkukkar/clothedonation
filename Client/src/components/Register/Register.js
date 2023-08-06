import React, { useState } from 'react';
import './Register.css';
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const history = useHistory();

  const [user, setUser] = useState({
    name: "",
    email: "",
    Mobile_number: "",
    Address: "",
    password: "",
    reEnterPassword: "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const register = () => {
    const { name, email, Mobile_number, Address, password, reEnterPassword } = user;

    if (name && email && password && Mobile_number && Address) {
      if (Mobile_number.length === 10 && password === reEnterPassword) {
        axios.post("https://clothedonationbackend.onrender.com/register", user)
          .then(res => {
           
            if (res.data.message === "Successfully Registered") {
              toast.success(res.data.message);
              toast.info("Please login now");
              history.push('/login');
            }else{
              toast.error(res.data.message);
            }
          })
          .catch(error => {
            toast.error("Registration failed. Please try again.");
          });
      } else {
        if (Mobile_number.length !== 10) {
          toast.error("Invalid mobile number!");
        } else {
          toast.error("Passwords did not match!");
        }
      }
    } else {
      toast.error("Please fill all fields!");
    }
  };

  return (
    <div className="registerbody">
      <div className="wrapper_register">
        <div className="form-box_register register" >
          <h2>Register</h2>
          <div>
            <div className="input-box_register">
              <input type="text" name="name" value={user.name} onChange={handleChange} placeholder='Name' />
            </div>

            <div className="input-box_register">
              <span className="icon_register"><ion-icon name="mail"></ion-icon></span>
              <input type="text" name="email" value={user.email} onChange={handleChange} placeholder='Email' />
            </div>

            <div className="input-box_register">
              <input type="text" name="Mobile_number" value={user.Mobile_number} onChange={handleChange} placeholder='Mobile Number' />
            </div>

            <div className="input-box_register">
              <input type="text" name="Address" value={user.Address} onChange={handleChange} placeholder='Address' />
            </div>

            <div className="input-box_register">
              <span className="icon_register"><ion-icon name="lock-closed"></ion-icon></span>
              <input type="password" name='password' value={user.password} onChange={handleChange} placeholder='Password' />
            </div>

            <div className="input-box_register">
              <span className="icon_register"><ion-icon name="lock-closed"></ion-icon></span>
              <input type="password" name="reEnterPassword" value={user.reEnterPassword} onChange={handleChange} placeholder='Re Enter Password' />
            </div>

            <button className="btn_register" onClick={register} >Register</button>
            <div className="register-login">
              <p>Already have an account? <button className="loginbtnn" onClick={() => { history.push('/login') }}>Login Here</button></p>
            </div>

            <div className="btnhr">
              <button onClick={() => { history.push('/') }}>Home</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

