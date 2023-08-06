import React, { useState } from 'react';
import TodoList from "./TodoList";
import "./Todoo.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Datetime from '../Datetimeslot/Datetime';
import { AuthContext } from '../AuthContext';
import { useContext } from 'react';

const Todo = () => {
  const history = useHistory();
  const [inputList, setInputList] = useState("");
  const [Items, setItems] = useState([]);
  const [date1, setdate1] = useState("");
  const [time1, settime1] = useState("");
  const {handleemailupdate, useremailid } = useContext(AuthContext);

  const deleteItems = (id) => {
    setItems((oldItems) => {
      return oldItems.filter((arrel, index) => {
        return index !== id;
      });
    });
  };

  const listOfItems = () => {
    if(inputList==="")
    {

    }
    else{

    

    setItems((oldItems) => {
      return [...oldItems, inputList];
    });
    setInputList("");
  }
  };

  const dosub = () => {
    if(Items.length===0)
    {
      toast.error("Plz add some items to donate")
    }
    else{

    
    if(date1===""){
      toast.error("Enter pickup date and time")
    }
    else{

    
    const requestData = {
      email:  useremailid ,
     
      dataArray: Items,
      date: date1,
      time: time1,
      status: 'pending'
    };
    
    

    

    axios.post("https://clothedonationbackend.onrender.com/donate", requestData)
      .then(res => {
        toast.success(res.data.message);
        if (res.data.message === "Thanks for your donation") {
          // history.push('/');
        }
      })
      .catch(error => {
        toast.error("Donation submission failed. Please try again.");
      });
    }
  }
  };

  return (
    <>
      <div className="box1">
        <div className="cont2">
          Let's Donate!
        </div>
      </div>
      <div className="bodybackground">
        <div className="main_div">
          <div className="center_div">
            <br />
            <h1>Add Items to Donate</h1>
            <br />
            <div className="container">
              <input type="string" placeholder='Add Item' value={inputList} onChange={(e) => { setInputList(e.target.value) }} />
              <button id="plus" className='buttonoftodo' onClick={listOfItems}>+</button>
            </div>
            <ol>
              {Items.map((itemval, index) => {  // index is a unique value in map
                return <TodoList itemval={itemval} id={index} deleteItems={deleteItems} />;
              })}
            </ol>
            <div className="subcont" >
              <button id='btntd' onClick={() => { history.push('/') }}>Home</button>
            </div>
          </div>
          <div className="datetimeslot">
            <Datetime dosub={dosub} setdate1={setdate1} settime1={settime1} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Todo;
