import React, { useState } from "react";
import InputEmoji from "react-input-emoji";
import "./Picker.css";

const PickerComp = ({ handleOnEnter }) => {
  const [message, setMessage] = useState("");

  const handleEnter = () => {
    handleOnEnter(message);
    setMessage("");
  };

  return (
    <>
      <InputEmoji
        value={message}
        onChange={setMessage}
        cleanOnEnter
        onEnter={handleEnter}
        placeholder="Type a message"
      />
      <button className="input-button" onClick={handleEnter}>
        <img src="/icons/send.svg" />
      </button>
    </>
  );
};

export default PickerComp;
