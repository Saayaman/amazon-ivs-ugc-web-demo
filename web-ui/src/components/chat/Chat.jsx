// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState, useRef, useContext } from "react";
import PropTypes from "prop-types";
import Picker from "../picker/Picker";
import SettingsContext from "../../context/SettingsContext";
import * as config from "../../config";

// Styles
import "./Chat.css";

const Chat = ({ userInfo, handleSignIn, streamData }) => {
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const messagesEndRef = useRef(null);
  const [state, dispatch] = useContext(SettingsContext);

  useEffect(() => {
    const initConnection = async () => {
      const connectionInit = new WebSocket(config.CHAT_WEBSOCKET);
      connectionInit.onopen = (event) => {
        console.log("WebSocket is now open.");
      };

      connectionInit.onclose = (event) => {
        console.log("WebSocket is now closed.");
        initConnection();
      };

      connectionInit.onerror = (event) => {
        console.error("WebSocket error observed:", event);
        setErrorMsg(event);
      };

      connectionInit.onmessage = (event) => {
        // append received message from the server to the DOM element
        const data = JSON.parse(event.data);
        const { metadata } = data;
        const newMessage = {
          timestamp: Date.now(),
          username: data.username,
          message: data.data,
          metadata: {
            color: metadata.test,
            avatar: metadata.profile,
          },
        };
        setMessages((prevState) => {
          return [...prevState, newMessage];
        });
      };
      setConnection(connectionInit);
    };
    initConnection();
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };
    scrollToBottom();
  });

  const sendMessage = (message) => {
    if (message) {
      const { profile, preferred_username, picture } = userInfo;
      const data = JSON.stringify({
        action: "sendmessage",
        data: message,
        username: preferred_username,
        metadata: {
          test: profile.bgColor,
          profile: picture,
        },
      });
      connection.send(data);
    }
  };

  const parseUrls = (userInput) => {
    var urlRegExp =
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g;
    let formattedMessage = userInput.replace(urlRegExp, (match) => {
      let formattedMatch = match;
      if (!match.startsWith("http")) {
        formattedMatch = `http://${match}`;
      }
      return `<a href=${formattedMatch} class="chat-line__link" target="_blank" rel="noopener noreferrer">${match}</a>`;
    });
    return formattedMessage;
  };

  const renderMessages = () => {
    let seconds = null;
    let isSameUser = false;
    return messages.map((msg, index) => {
      let formattedMessage = parseUrls(msg.message);
      if (index > 0) {
        const difference = msg.timestamp - messages[index - 1].timestamp;
        const date = new Date(difference);
        seconds = date.getSeconds();
        isSameUser = msg.username === messages[index - 1].username;
      }

      if (seconds !== null && seconds < 30 && isSameUser) {
        return (
          <div
            className="chat-line"
            key={msg.timestamp}
            style={{ marginTop: 0, marginLeft: "3.6rem" }}
          >
            <p dangerouslySetInnerHTML={{ __html: formattedMessage }} />
          </div>
        );
      }
      return (
        <div className="chat-line" key={msg.timestamp}>
          <div className="chat-avatar-wrapper">
            <img src={`/images/${msg.metadata.avatar}.png`} />
          </div>
          <div>
            <p className={`username`} style={{ color: msg.metadata.color }}>
              {msg.username}
            </p>
            <p dangerouslySetInnerHTML={{ __html: formattedMessage }} />
          </div>
        </div>
      );
    });
  };

  const blockedUser =
    !!streamData.bannedChatters &&
    streamData.bannedChatters.find(
      (element) => element === userInfo.preferred_username
    );

  return (
    <div id="chat" className="col-wrapper">
      <div className="chat-wrapper top-0 bottom-0">
        <div
          className={`messages ${
            !userInfo.preferred_username && "messages-before-signIn"
          }`}
        >
          <div className="messages-inner">
            {renderMessages()}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {!!errorMsg && (
          <div className="messages-error">
            <div className="messages-error-icon">
              <img src="/icons/alert_icon.svg" />
            </div>
            {errorMsg}
          </div>
        )}
        <div className="composer">
          {!!userInfo.preferred_username && !blockedUser ? (
            <Picker
              handleOnEnter={sendMessage}
              setErrorMsg={setErrorMsg}
              streamData={streamData}
            />
          ) : !userInfo.preferred_username ? (
            <button
              onClick={() => handleSignIn(true)}
              className="signIn full-width"
            >
              Sign in to chat
            </button>
          ) : (
            <input
              disabled
              placeholder="You can’t send messages to this chat room"
            />
          )}
        </div>
      </div>
    </div>
  );
};

Chat.propTypes = {
  userInfo: PropTypes.object.isRequired,
  handleSignIn: PropTypes.func.isRequired,
  streamData: PropTypes.object.isRequired,
};

export default Chat;
