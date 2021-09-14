// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useEffect, useState, useRef } from "react";
import * as config from "../../config";
import Picker from "../picker/Picker";

// Styles
import "./Chat.css";

const Chat = ({ userInfo, handleSignIn, id }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState(null);

  const messagesEndRef = useRef(null);

  const [openPicker, setOpenPicker] = useState(false);

  useEffect(() => {
    const initConnection = async () => {
      const connectionInit = new WebSocket(config.CHAT_WEBSOCKET);
      connectionInit.onopen = (event) => {
        console.log("WebSocket is now open.");
      };

      connectionInit.onclose = (event) => {
        console.log("WebSocket is now closed.");
      };

      connectionInit.onerror = (event) => {
        console.error("WebSocket error observed:", event);
      };

      connectionInit.onmessage = (event) => {
        console.log("onMessage!");
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
      // messagesEndRef.current.scrollToBottom({ behavior: "smooth" });
    };
    scrollToBottom();
  });

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
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
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      // keyCode 13 is carriage return
      sendMessage();
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
    console.log("messages", messages);
    return messages.map((msg) => {
      let formattedMessage = parseUrls(msg.message);
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

  //react-emoji-picker
  const handleSelectEmoji = (event, emojiObject) => {
    console.log("emojiobject", emojiObject);
    setMessage((prevState) => {
      return `${prevState}${emojiObject.emoji}`;
    });
    setOpenPicker(false);
  };

  //react-emoji-element
  // const handleSelectEmoji = (emoji) => {
  //   setChosenEmoji(emoji);
  //   setMessage((prevState) => {
  //     return `${prevState}${emoji}`;
  //   });
  //   setOpenPicker(false);
  // };

  return (
    <div id={id} className="col-wrapper">
      <div className="chat-wrapper top-0 bottom-0">
        <div className="messages">
          {renderMessages()}
          <div ref={messagesEndRef} />
        </div>
        <div className="composer">
          {!!userInfo.preferred_username && (
            <>
              {openPicker && (
                // <Picker
                //   onEmojiClick={(event, emojiObject) =>
                //     setChosenEmoji(emojiObject)
                //   }
                // />
                <Picker emojiClicked={handleSelectEmoji} />
              )}
              <div className="input-wrapper" style={{ display: "flex" }}>
                <button
                  className="input-button"
                  onClick={() => setOpenPicker(!openPicker)}
                >
                  😃
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  maxLength={510}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
                <button className="input-button" onClick={sendMessage}>
                  <img src="/images/send.svg" />
                </button>
              </div>
            </>
          )}
          {!userInfo.preferred_username && (
            <button
              onClick={() => handleSignIn(true)}
              className="signIn full-width"
            >
              Sign in to chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
