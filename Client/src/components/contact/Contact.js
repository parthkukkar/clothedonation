import React from "react";
import "./contact.css";
const Contact = () => {
  return (
    <div className="containerofcontact">
      <div className="contactInfo">
        <div className="box">
          <h2 style={{ marginLeft: "6vw" }}>Contact Us</h2>
        </div>

        <div className="box">
          <div className="icon">
            <ion-icon name="navigate"></ion-icon>
          </div>
          <div className="text">
            <h3>Address</h3>
            <p>
              Unikid Showroom,
              <br />
              Gaushala Road,
              <br />
              Fazilka,
              <br />
              Punjab
            </p>
          </div>
        </div>

        <div className="box">
          <div className="icon">
            <ion-icon name="call"></ion-icon>
          </div>
          <div className="text">
            <h3>Phone</h3>
            <p>6283382129</p>
          </div>
        </div>

        <div className="box">
          <div className="icon">
            <ion-icon name="mail"></ion-icon>
          </div>
          <div className="text">
            <h3>Email Id</h3>
            <p>parthkukkar8@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="contactForm">
        <h2>Who Are We</h2>
        <div className="b11">
          <ul>
            <li>
              {" "}
              We are a non profit organisation trying to help those in need
            </li>
            <li> We take your old clothes and give them to the needy</li>
            <li>
              {" "}
              Just place your donation request and we will pick your old clothes
              from your address as per your time slot
            </li>
          </ul>
          .
        </div>
      </div>
    </div>
  );
};

export default Contact;
