import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState } from "react";
import './Datetime.css'; // Import the CSS file for styling

const Datetime = (props) => {
  const [date, setDate] = useState(null); // Set initial date to null

  // Function to filter the dates before the current date
  const filterPastDates = (date) => {
    const currentDate = new Date();
    return date >= currentDate;
  };

  // Function to filter the times before the current time
  const filterPastTimes = (time) => {
    const selectedDate = new Date(date);
    const currentDate = new Date();

    if (selectedDate.getDate() === currentDate.getDate()) {
      // If it's the current date, disable all times before the current time
      return time >= currentDate.getHours();
    }

    // For other dates, allow all times
    return true;
  };

  return (
    <div className="datetime-container">
      <h1 className="datetime-heading">Choose Your Desired Time of Pickup</h1>
      <DatePicker
        showTimeSelect
        minTime={new Date(0, 0, 0, 9, 0)}
        maxTime={new Date(0, 0, 0, 21, 0)}
        selected={date}
        dateFormat="dd/MM/yyyy"
        onChange={(date) => setDate(date)}
        filterDate={filterPastDates} // Disable past dates
        filterTime={filterPastTimes} // Disable past times
      />
      {date && (
        <React.Fragment>
          <p className="selected-time">{`Pickup Date : ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</p>
          <p className="selected-time">{`Pickup Time : ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`}</p>
          {props.setdate1(` ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`)}
          {props.settime1(` ${date.getHours()}:${date.getMinutes()}`)}
        </React.Fragment>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
        <button id='submitbtn' className='buttonoftodo' onClick={props.dosub}>Submit</button>
      </div>
    </div>
  );
}

export default Datetime;
