import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import "./Datetime.css"; // Import the CSS file for styling

const Datetime = (props) => {
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date
  const [selectedStartTime, setSelectedStartTime] = useState(""); // State for selected start time
  const [selectedEndTime, setSelectedEndTime] = useState(""); // State for selected end time

  // Function to handle date change
  const handleDateChange = async (date) => {
    setSelectedDate(date);
  };

  // Function to handle start time change
  const handleStartTimeChange = async (event) => {
    const [hours, minutes] = event.target.value.split(":").map(Number);

    if (hours < 8 || hours > 20) {
      toast.error("Plz choose a time slot from 8:00 to 20:00");
    } else if (hours === 20 && minutes > 0) {
      toast.error("Plz choose a time slot from 8:00 to 20:00");
    } else {
      setSelectedStartTime(event.target.value);
    }
  };

  // Function to handle end time change
  const handleEndTimeChange = async (event) => {
    const [starthours, startminutes] = selectedStartTime.split(":").map(Number);
    const [hours, minutes] = event.target.value.split(":").map(Number);
    if (hours < starthours) {
      toast.error("End time should be greater than start time");
    } else if (hours === starthours && minutes < startminutes) {
      toast.error("End time should be greater than start time");
    } else if (hours < 8 || hours > 20) {
      toast.error("Plz choose a time slot from 8:00 to 20:00");
    } else if (hours === 20 && minutes > 0) {
      toast.error("Plz choose a time slot from 8:00 to 20:00");
    } else {
      setSelectedEndTime(event.target.value);
    }
  };

  // useEffect to update props after state change
  useEffect(() => {
    if (selectedDate) {
      // Format selectedDate as dd/mm/yyyy
      const formattedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
      props.setdate1(formattedDate);
    }
    props.setstarttime1(selectedStartTime);
    props.setendtime1(selectedEndTime);
  }, [selectedDate, selectedStartTime, selectedEndTime, props]);

  function fun() {
    if (selectedStartTime === "") {
      return true;
    } else {
      return false;
    }
  }

  // Function to handle the submission
  const handleSubmit = async () => {
    if (selectedDate && selectedStartTime && selectedEndTime) {

      props.dosub();
    } else {
      if (!selectedDate) {
        toast.error("Enter pickup date");

      }
      else if (!selectedStartTime) {
        toast.error("Enter pickup (start)time");

      }
      else if (!selectedEndTime) {
        toast.error("Enter pickup (end)time");

      }

    }
  };

  return (
    <div className="datetime-container">
      <h1 className="datetime-heading">Choose Your Desired Time of Pickup</h1>

      {/* Date Picker */}
      Date:<DatePicker
        selected={selectedDate}
        minDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)} // Set minimum date to tomorrow
        dateFormat="dd/MM/yyyy"
        onChange={handleDateChange}
      />

      {/* Start Time and End Time Inputs */}
      <div className="time-slot">
        <label>Start Time:</label>
        <input
          type="time"
          value={selectedStartTime}
          onChange={handleStartTimeChange}
        />
        <label>End Time:</label>
        <input
          type="time"
          value={selectedEndTime}
          onChange={handleEndTimeChange}
          disabled={fun()}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
        <button id="submitbtn" className="buttonoftodo" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Datetime;
