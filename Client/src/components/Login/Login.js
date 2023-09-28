import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import axios from "axios";

const Login = () => {
  const history = useHistory();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const login = () => {
    const { email, password } = user;
    if (email && password) {
      axios
        .post("http://localhost:3000/login", user, { withCredentials: true })
        .then((res) => {
          if (res.data.message === "Login Successful!") {
            toast.success(res.data.message);
            history.push("/");
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((error) => {
          toast.error("Login failed. Please try again.");
        });
    } else {
      toast.error("Please fill all fields!");
    }
  };

  return (
    <div className="loginbody">
      <div cl assName="wrapper">
        <div className="form-box login">
          <h2>Login</h2>
          <div>
            <div className="input-box">
              <span className="icon">
                <ion-icon name="mail"></ion-icon>
              </span>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div className="input-box">
              <span className="icon">
                <ion-icon name="lock-closed"></ion-icon>
              </span>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>
            <button className="btn" onClick={login}>
              Login
            </button>
            <div className="login-register">
              <p>
                Don't have an account?{" "}
                <button
                  className="registerbtn"
                  onClick={() => {
                    history.push("/register");
                  }}
                >
                  Register Here
                </button>
              </p>
            </div>
            <div className="btnh">
              <button
                onClick={() => {
                  history.push("/");
                }}
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
