import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Todonate.css";
const TodoList = (props) => {
  return (
    <>
      <div className="todo_style">
        <li>{props.itemval}</li>
        <button
          className="buttonoftodo2"
          onClick={() => {
            props.deleteItems(props.id);
          }}
        >
          
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </>
  );
};

export default TodoList;
