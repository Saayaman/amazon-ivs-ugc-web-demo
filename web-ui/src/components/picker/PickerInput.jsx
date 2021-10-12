import React, { forwardRef } from "react";
import { ReactComponent as SendIcon } from "../../assets/send.svg";
import { ReactComponent as SmilyIcon } from "../../assets/smily.svg";

import "./PickerInput.css";

const PickerInput = forwardRef(
  (
    {
      handleEnter,
      handleKeyDown,
      handleChange,
      pickerOpen,
      setPickerOpen,
      message,
    },
    ref
  ) => (
    <div className="emoji-picker-input">
      <button
        className={`emoji-picker-open-button ${!!pickerOpen ? "open" : ""}`}
        onClick={setPickerOpen}
      >
        <SmilyIcon />
      </button>
      <input
        ref={ref}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
      />
      <button className="emoji-picker-send-button" onClick={handleEnter}>
        <SendIcon />
      </button>
    </div>
  )
);

PickerInput.displayName = "PickerInput";

export default PickerInput;
