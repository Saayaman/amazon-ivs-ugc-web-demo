import React, { useState, useEffect, useRef, createRef } from "react";
import Filter from "bad-words";
import PropTypes from "prop-types";
import PickerList from "./PickerList";
import PickerInput from "./PickerInput";
import * as config from "../../config";
import "./Picker.css";

const PickerGroup = ({ handleOnEnter, setErrorMsg, streamData }) => {
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState(null);
  const [shortcode, setShortcode] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const pickerRef = createRef();
  const inputRef = createRef();

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleEnter();
    }
  };

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
    setPickerOpen(false);
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

  const handleEmojiClick = (emoji) => {
    setMessage((prevState) => {
      if (!!shortcode && prevState.includes(shortcode)) {
        return prevState.replace(":" + shortcode, emoji);
      } else {
        return prevState + emoji;
      }
    });
    setShortcode("");
    inputRef.current.focus();
  };

  const handleChange = (inputValue) => {
    if (inputValue.includes(":")) {
      if (inputValue.charAt(inputValue.length - 1) === ":") {
        setPickerOpen(true);
      } else {
        const text = inputValue.slice(
          inputValue.lastIndexOf(":") + 1,
          inputValue.length
        );
        //check for whitespaces
        if (/\s/g.test(text)) {
          setShortcode("");
        } else {
          setShortcode(text);
        }
      }
    } else {
      setPickerOpen(false);
    }

    setMessage(inputValue);
  };

  return (
    <>
      <PickerList
        ref={pickerRef}
        pickerOpen={pickerOpen}
        handleEmojiClick={handleEmojiClick}
        shortcode={shortcode}
      />
      <PickerInput
        ref={inputRef}
        handleEnter={handleEnter}
        handleKeyDown={handleKeyDown}
        handleChange={(e) => handleChange(e.target.value)}
        setPickerOpen={() => setPickerOpen(!pickerOpen)}
        pickerOpen={pickerOpen}
        message={message}
      />
    </>
  );
};

PickerGroup.propTypes = {
  handleOnEnter: PropTypes.func.isRequired,
  setErrorMsg: PropTypes.func.isRequired,
  streamData: PropTypes.object.isRequired,
};

export default PickerGroup;
