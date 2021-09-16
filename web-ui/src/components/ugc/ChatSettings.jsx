import React, { useState, useEffect, useContext, useRef } from "react";
import SettingsField from "./SettingsField";
import SettingsContext from "../../context/SettingsContext";
import {
  SET_BLOCKED_CHATTERS,
  SET_BLOCKED_WORDS,
} from "../../context/SettingsProvider";
import "./ChatSettings.css";

const ChatSettings = () => {
  const [state, dispatch] = useContext(SettingsContext);

  const [blockedWords, setBlockedWords] = useState(state.blockedWords);
  const [blockedChatters, setBlockedChatters] = useState(state.blockedChatters);

  const [newBlockedWord, setNewBlockedWord] = useState(null);
  const [newBlockedChatter, setNewBlockedChatter] = useState(null);

  const [timer, setTimer] = useState(null);

  const blockedWordRef = useRef(null);
  const blockedChatterRef = useRef(null);

  useEffect(() => {
    setBlockedChatters(state.blockedChatters);
    setBlockedWords(state.blockedWords);
  }, [state]);

  useEffect(() => {
    blockedChatterRef.current.scrollIntoView({ behavior: "smooth" });
    blockedWordRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const handleDispatch = (inputValue, type) => {};

  const changeDelay = (inputValue, type) => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        handleDispatch(inputValue, type);
      }, 700)
    );
  };

  console.log("state, blocked chatters", state, blockedChatters);
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (!newBlockedWord) {
  //       dispatch({
  //         type: SET_BLOCKED_WORDS,
  //         blockedWords: [...blockedWords, newBlockedWord],
  //       });
  //       setNewBlockedWord("");
  //     }
  //   }, 1000);
  //   return () => clearTimeout(timeoutId);
  // }, [newBlockedWord]);

  const handleKeyDownWord = (e) => {
    if (e.keyCode === 13 && newBlockedWord) {
      // keyCode 13 is carriage return
      dispatch({
        type: SET_BLOCKED_WORDS,
        blockedWords: [...blockedWords, newBlockedWord],
      });
      setNewBlockedWord("");
    }
  };

  const handleKeyDownChatter = (e) => {
    console.log("newBLockedChatter", newBlockedChatter);
    if (e.keyCode === 13 && newBlockedChatter) {
      dispatch({
        type: SET_BLOCKED_CHATTERS,
        blockedChatters: [...blockedChatters, newBlockedChatter],
      });
      setNewBlockedChatter("");
    }
  };

  const handleKeyDown = (e) => {
    console.log("handleKeyDown!!!!!");
  };

  const handleChangeArray = (e, type, index) => {
    console.log("handleArrayChange", type);
    if (type === "WORD") {
      setBlockedWords((prevState) => {
        let newArr = prevState;
        newArr[index] = e.target.value;
        return [...newArr];
      });
    }

    if (type === "CHATTER") {
      setBlockedChatters((prevState) => {
        let newArr = prevState;
        newArr[index] = e.target.value;
        return [...newArr];
      });
    }
  };

  return (
    <fieldset className="chat-settings">
      <SettingsField
        labelName="Blocked words"
        inputId="blocked-words-id"
        className="mg-b-1"
      >
        <div className="settings-block-list">
          {blockedWords.map((value, index) => (
            <input
              key={index}
              value={value}
              type="text"
              placeholder="Type a word to block"
              onChange={(e) => handleChangeArray(e, "WORD", index)}
              onKeyUp={() => console.log("Key UP!")}
              onKeyDown={handleKeyDown}
            />
          ))}
          <input
            key="newBlockedWord"
            value={newBlockedWord}
            onChange={(e) => setNewBlockedWord(e.target.value)}
            onKeyDown={handleKeyDownWord}
            type="text"
            placeholder="Type a word to block"
            ref={blockedWordRef}
          />
        </div>
        <p>
          Messages containing words in this list will not be sent to your chat
          room.
        </p>
      </SettingsField>
      <div style={{ height: "4.8rem" }}></div>
      <SettingsField
        labelName="Banned chatters"
        inputId="banned-chatters-id"
        className="mg-b-1"
      >
        <div className="settings-block-list">
          {blockedChatters.map((value, index) => (
            <input
              key={index}
              value={value}
              type="text"
              placeholder="Type a username to ban"
              onChange={(e) => handleChangeArray(e, "CHATTER", index)}
              onKeyDown={handleKeyDown}
            />
          ))}
          <input
            key="newBlockedChatter"
            value={newBlockedChatter}
            onChange={(e) => setNewBlockedChatter(e.target.value)}
            onKeyDown={handleKeyDownChatter}
            type="text"
            placeholder="Type a username to ban"
            ref={blockedChatterRef}
          />
        </div>
        <p>
          Users on this list will not be able to send messages in your chat
          room.
        </p>
      </SettingsField>
    </fieldset>
  );
};

export default ChatSettings;
