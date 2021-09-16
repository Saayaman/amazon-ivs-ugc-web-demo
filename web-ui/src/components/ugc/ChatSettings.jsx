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

  const handleKeyDownUpdate = async (e, type) => {
    if (e.keyCode === 13) {
      await loadSettings(type);
      type === WORD ? setNewBlockedWord("") : setNewBlockedChatter("");
      scrollToBottom();
    }
  };

  const handleKeyDownChatter = (e) => {
    if (e.keyCode === 13 && newBlockedChatter) {
      dispatch({
        type: SET_BLOCKED_CHATTERS,
        blockedChatters: [...blockedChatters, newBlockedChatter],
      });
      setNewBlockedChatter("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      dispatch({
        type: SET_BLOCKED_CHATTERS,
        blockedChatters: blockedChatters,
      });
      dispatch({ type: SET_BLOCKED_WORDS, blockedWords: blockedWords });
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

  return (
    <fieldset className="chat-settings">
      <SettingsField
        labelName="Blocked words"
        inputId="blocked-words-id"
        className="mg-b-1"
      >
        <div className="settings-block-list" ref={blockedWordRef}>
          {blockedWords.map((value, index) => (
            <input
              key={index}
              value={value}
              type="text"
              placeholder="Type a word to block"
              onChange={(e) => handleChangeArray(e, WORD, index)}
              onKeyDown={handleKeyDown}
            />
          ))}
          <input
            key="newBlockedWord"
            value={newBlockedWord}
            onChange={(e) => setNewBlockedWord(e.target.value)}
            onKeyDown={(e) => handleKeyDownUpdate(e, WORD)}
            type="text"
            placeholder="Type a word to block"
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
        <div className="settings-block-list" ref={blockedChatterRef}>
          {blockedChatters.map((value, index) => (
            <input
              key={index}
              value={value}
              type="text"
              placeholder="Type a username to ban"
              onChange={(e) => handleChangeArray(e, CHATTER, index)}
              onKeyDown={handleKeyDown}
            />
          ))}
          <input
            key="newBlockedChatter"
            value={newBlockedChatter}
            onChange={(e) => setNewBlockedChatter(e.target.value)}
            onKeyDown={(e) => handleKeyDownUpdate(e, CHATTER)}
            type="text"
            placeholder="Type a username to ban"
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
