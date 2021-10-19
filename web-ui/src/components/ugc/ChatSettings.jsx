import React, { useState, useEffect, useContext, useRef } from "react";
import SettingsField from "./SettingsField";
import SettingsContext from "../../context/SettingsContext";
import {
  SET_BLOCKED_CHATTERS,
  SET_BLOCKED_WORDS,
} from "../../context/SettingsProvider";
import { BLOCKED_TYPES } from "../../constants";
import "./ChatSettings.css";

const ChatSettings = () => {
  const { CHATTER, WORD } = BLOCKED_TYPES;
  const [state, dispatch] = useContext(SettingsContext);
  const [showCloseIcon, setShowCloseIcon] = useState("");
  const [blockedWords, setBlockedWords] = useState(state.blockedWords);
  const [blockedChatters, setBlockedChatters] = useState(state.blockedChatters);
  const [newBlockedWord, setNewBlockedWord] = useState("");
  const [newBlockedChatter, setNewBlockedChatter] = useState("");
  const blockedWordRef = useRef(null);
  const blockedChatterRef = useRef(null);

  useEffect(() => {
    setBlockedChatters(state.blockedChatters);
    setBlockedWords(state.blockedWords);
  }, [state]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    blockedWordRef.current.scrollTop =
      blockedWordRef.current.scrollHeight - blockedWordRef.current.clientHeight;

    blockedChatterRef.current.scrollTop =
      blockedChatterRef.current.scrollHeight -
      blockedChatterRef.current.clientHeight;
  };

  function loadSettings(type) {
    return new Promise((resolve, reject) => {
      let wait = setTimeout(() => {
        if (type === WORD) {
          dispatch({
            type: SET_BLOCKED_WORDS,
            blockedWords: [...blockedWords, newBlockedWord],
          });
        } else {
          dispatch({
            type: SET_BLOCKED_CHATTERS,
            blockedChatters: [...blockedChatters, newBlockedChatter],
          });
        }
        clearTimeout(wait);
        resolve("load settings done");
      }, 200);
    });
  }

  const handleKeyDownNew = async (e, type) => {
    if (e.keyCode === 13) {
      // no white space and not empty
      if (/\S/.test(newBlockedWord) || /\S/.test(newBlockedChatter)) {
        await loadSettings(type);
        type === WORD ? setNewBlockedWord("") : setNewBlockedChatter("");
        scrollToBottom();
      } else {
      }
    }
  };

  const handleKeyDownUpdate = (e, type, index) => {
    if (e.keyCode === 13) {
      setShowCloseIcon(null);

      if (blockedWords[index] === "" || blockedChatters[index] === "") {
        deleteLine(type, index);
      } else {
        dispatch({
          type: SET_BLOCKED_CHATTERS,
          blockedChatters: blockedChatters,
        });
        dispatch({ type: SET_BLOCKED_WORDS, blockedWords: blockedWords });
      }
    }
  };

  const handleChangeArray = (e, type, index) => {
    if (type === WORD) {
      setBlockedWords((prevState) => {
        let newArr = prevState;
        newArr[index] = e.target.value;
        return [...newArr];
      });
    }

    if (type === CHATTER) {
      setBlockedChatters((prevState) => {
        let newArr = prevState;
        newArr[index] = e.target.value;
        return [...newArr];
      });
    }
  };

  const deleteLine = (type, index) => {
    if (type === WORD) {
      let newArr = blockedWords;
      newArr.splice(index, 1);
      dispatch({ type: SET_BLOCKED_WORDS, blockedWords: newArr });
    }

    if (type === CHATTER) {
      let newArr = blockedChatters;
      newArr.splice(index, 1);
      dispatch({
        type: SET_BLOCKED_CHATTERS,
        blockedChatters: newArr,
      });
    }
  };
  const renderCloseIcon = (handleDelete) => {
    return (
      <div className="settings-unblock-icon" onClick={handleDelete}>
        <img src="/icons/cross_icon.svg" />
      </div>
    );
  };

  return (
    <fieldset className="chat-settings">
      <SettingsField
        labelName="Blocked words"
        inputId="blocked-words-id"
        className="mg-b-1"
      >
        <div className="settings-block-list" ref={blockedWordRef}>
          {blockedWords.map((value, index) => (
            <div className="settings-block-item" key={index}>
              <input
                value={value}
                type="text"
                placeholder="Type a word to block"
                onChange={(e) => handleChangeArray(e, WORD, index)}
                onKeyDown={(e) => handleKeyDownUpdate(e, WORD, index)}
                onMouseEnter={() => setShowCloseIcon(`WORD-${index}`)}
              />
              {showCloseIcon === `WORD-${index}` &&
                renderCloseIcon(() => deleteLine(WORD, index))}
            </div>
          ))}
          <div className="settings-block-item  settings-block-item--last">
            <input
              key="newBlockedWord"
              value={newBlockedWord}
              onChange={(e) => setNewBlockedWord(e.target.value)}
              onKeyDown={(e) => handleKeyDownNew(e, WORD)}
              type="text"
              placeholder="Type a word to block"
              onMouseEnter={() => setShowCloseIcon(`WORD-NEW`)}
            />
            {showCloseIcon === `WORD-NEW` &&
              newBlockedWord &&
              renderCloseIcon(() => setNewBlockedWord(""))}
          </div>
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
        <div className="settings-block-list" ref={blockedChatterRef}>
          {blockedChatters.map((value, index) => (
            <div className="settings-block-item" key={index}>
              <input
                key={index}
                value={value}
                type="text"
                placeholder="Type a username to ban"
                onChange={(e) => handleChangeArray(e, CHATTER, index)}
                onKeyDown={(e) => handleKeyDownUpdate(e, CHATTER, index)}
                onMouseEnter={() => setShowCloseIcon(`CHATTER-${index}`)}
              />
              {showCloseIcon === `CHATTER-${index}` &&
                renderCloseIcon(() => deleteLine(CHATTER, index))}
            </div>
          ))}
          <div className="settings-block-item settings-block-item--last">
            <input
              key="newBlockedChatter"
              value={newBlockedChatter}
              onChange={(e) => setNewBlockedChatter(e.target.value)}
              onKeyDown={(e) => handleKeyDownNew(e, CHATTER)}
              type="text"
              placeholder="Type a username to ban"
              onMouseEnter={() => setShowCloseIcon(`CHATTER-NEW`)}
            />
            {showCloseIcon === `CHATTER-NEW` &&
              newBlockedChatter &&
              renderCloseIcon(() => setNewBlockedChatter(""))}
          </div>
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
