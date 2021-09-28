import React, { useState, useEffect } from "react";
import InputEmoji from "react-input-emoji";
import Filter from "bad-words";
import PropTypes from "prop-types";
import * as config from "../../config";

import "./Picker.css";

const PickerComp = ({ handleOnEnter, setErrorMsg, streamData }) => {
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState(null);

  const handleEnter = () => {
    if (config.USE_MOCK_DATA) {
      if (!filter.isProfane(message)) {
        handleOnEnter(message);
        setMessage("");
      }
    } else {
      handleOnEnter(message);
      setMessage("");
    }
  };

  useEffect(() => {
    let filter = new Filter();
    if (!!streamData.blockedWords) {
      filter.addWords(...streamData.blockedWords);
      setFilter(filter);
    }
  }, [streamData.blockedWords]);

  useEffect(() => {
    if (config.USE_MOCK_DATA) {
      if (!!message && filter.isProfane(message)) {
        setErrorMsg("Cannot send message: message includes inapropriate word");
      } else {
        setErrorMsg(null);
      }
    }
  }, [message]);

  return (
    <>
      <InputEmoji
        value={message}
        onChange={setMessage}
        cleanOnEnter={filter && !filter.isProfane(message)}
        onEnter={handleEnter}
        placeholder="Type a message"
      />
      <button className="input-button" onClick={handleEnter}>
        <img src="/icons/send.svg" />
      </button>
    </>
  );
};

PickerComp.propTypes = {
  handleOnEnter: PropTypes.func.isRequired,
  setErrorMsg: PropTypes.func.isRequired,
  streamData: PropTypes.object.isRequired,
};

export default PickerComp;
