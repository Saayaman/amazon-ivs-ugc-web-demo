import React, { useState, useEffect, createRef } from "react";
import Filter from "bad-words";
import PropTypes from "prop-types";
import PickerList from "./PickerList";
import PickerInput from "./PickerInput";
import * as config from "../../config";

const PickerGroup = ({ handleOnEnter, setErrorMsg, streamData }) => {
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState(null);
  const [shortcode, setShortcode] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searchedPickerList, setSearchedPickerList] = useState(null);

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
    const split = inputValue.split(" ");
    const lastInputWord = split[split.length - 1];
    const lastChar = inputValue.charAt(inputValue.length - 1);

    if (lastInputWord.includes(":")) {
      const shortcodeText = lastInputWord.slice(
        lastInputWord.indexOf(":") + 1,
        lastInputWord.length
      );
      const collonIsLastChar = lastChar === ":";

      if (collonIsLastChar && shortcode.length > 0) {
        const closedShortcode = lastInputWord.slice(
          lastInputWord.indexOf(":") + 1,
          lastInputWord.length - 1
        );

        if (searchedPickerList.length > 0) {
          const found = searchedPickerList.find((picker) => {
            return (
              picker.shortcodes && picker.shortcodes[0] === closedShortcode
            );
          });

          if (!!found) {
            const replaced = inputValue.replace(
              `:${closedShortcode}:`,
              found.emoji
            );
            setMessage(replaced);
          } else {
            setMessage(inputValue);
          }
        } else {
          setMessage(inputValue);
        }
        setShortcode("");
      } else if (collonIsLastChar) {
        setPickerOpen(true);
        setMessage(inputValue);
      } else {
        //check for whitespaces
        if (/\s/g.test(shortcodeText)) {
          setShortcode("");
        } else {
          const textAfterLastCollon = lastInputWord.slice(
            lastInputWord.lastIndexOf(":") + 1,
            lastInputWord.length
          );
          setShortcode(textAfterLastCollon);
        }
        setMessage(inputValue);
      }
    } else {
      setPickerOpen(false);
      setMessage(inputValue);
      if (lastChar === " ") {
        setShortcode("");
      }
    }
  };

  return (
    <>
      <PickerList
        ref={pickerRef}
        pickerOpen={pickerOpen}
        handleEmojiClick={handleEmojiClick}
        shortcode={shortcode}
        setSearchedPickerList={setSearchedPickerList}
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
