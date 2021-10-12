import React, { useState, useEffect } from "react";
import InputEmoji from "react-input-emoji";
import Filter from "bad-words";
import PropTypes from "prop-types";
import * as config from "../../config";

import "./Picker.css";

const PickerComp = ({ handleOnEnter, setErrorMsg, streamData }) => {
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hoveredEmoji, setHoveredEmoji] = useState(null);

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
    document
      .getElementsByClassName("react-input-emoji--button")[0]
      .addEventListener("click", () => {
        setPickerOpen(true);
        setTimeout(() => {
          let b = document.querySelectorAll("input[type=search]")[0];
          if (!!b) b.focus();
        }, 300);
      });
  });

  useEffect(() => {
    // let b = document.querySelectorAll("input[type=search]");
    // console.log("b", b);
    let eventEmoji;
    if (!!pickerOpen) {
      const emoji = document.getElementsByClassName("emoji-mart-emoji");
      // console.log("emoji", emoji);
      // emoji.addEventListener("mouseenter", (e) => {
      //   console.log("event", e);
      // });
      window.onmouseover = function (e) {
        // setHoveredEmoji("");
        // e.target.className = "emoji-mart-emoji";

        if (e.target.className === "emoji-mart-emoji") {
          const str = e.target.ariaLabel && e.target.ariaLabel.split(", ")[1];
          console.log(str);

          // if(str !== )
          setHoveredEmoji(str);

          let tooltip = document.createElement("div");
          tooltip.className = "tooltip";
          tooltip.innerHTML = str;

          // const tooltip = <div className="tooltip">{str}</div>;
          e.target.appendChild(tooltip);
          // e.target.className += " hovered";
        }
      };
    }

    if (!pickerOpen) {
      console.log("pickerclosed", eventEmoji);
    }
  }, [pickerOpen]);

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
      {pickerOpen && <div style={{ position: "absolute" }}>{hoveredEmoji}</div>}
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
