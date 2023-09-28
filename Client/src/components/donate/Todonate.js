import React, { useState } from "react";
import TodoList from "./TodonateList";
import "./Todonate.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Datetime from "../Datetimeslot/Datetime";

const Todo = () => {
  const history = useHistory();
  const [inputList, setInputList] = useState("");
  const [Items, setItems] = useState([]);
  const [date1, setdate1] = useState("");
  const [time1, setstarttime1] = useState("");
  const [time2, setendtime1] = useState("");

  const deleteItems = (id) => {
    setItems((oldItems) => {
      return oldItems.filter((arrel, index) => {
        return index !== id;
      });
    });
  };

  const listOfItems = () => {
    const trimmedValue = inputList.trimStart();
    if (trimmedValue === "") {
    } else {
      setItems((oldItems) => {
        return [...oldItems, trimmedValue];
      });
      setInputList("");
    }
  };

  const dosub = () => {
    if (Items.length === 0) {
      toast.error("Plz add some items to donate");
    } else {
      if (date1 === "") {
        toast.error("Enter pickup date and time");
      } else {
        const requestData = {
          dataArray: Items,
          date: date1,
          sttime: time1,
          endtime: time2,
          status: "pending",
        };

        axios
          .post("http://localhost:3000/donate", requestData, {
            withCredentials: true,
          })
          .then((res) => {
            toast.success(res.data.message);
            if (res.data.message === "Thanks for your donation") {
              history.push("/");
            }
          })
          .catch((error) => {
            toast.error("Donation submission failed. Please try again.");
          });
      }
    }
  };

  return (
    <>
      <div className="box1">
        <div className="cont2">Let's Donate!</div>
      </div>
      <div className="bodybackground">
        <div className="main_div">
          <div className="center_div">
            <br />
            <h1>Add Items to Donate</h1>
            <br />
            <div className="container">
              <input
                type="string"
                placeholder="Add Item"
                value={inputList}
                onChange={(e) => {
                  setInputList(e.target.value);
                }}
              />
              <button id="plus" className="buttonoftodo" onClick={listOfItems}>
                +
              </button>
            </div>
            <ol>
              {Items.map((itemval, index) => {
                // index is a index of element(itemval) in array named Items
                return (
                  <TodoList
                    itemval={itemval}
                    id={index}
                    deleteItems={deleteItems}
                  />
                );
              })}
            </ol>
            <div className="subcont">
              <button
                id="btntd"
                onClick={() => {
                  history.push("/");
                }}
              >
                Home
              </button>
            </div>
          </div>
          <div className="datetimeslot">
            <Datetime
              dosub={dosub}
              setdate1={setdate1}
              setstarttime1={setstarttime1}
              setendtime1={setendtime1}
              date1={date1}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Todo;
