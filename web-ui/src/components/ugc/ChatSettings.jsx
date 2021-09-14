import React, { useState } from "react";
import SettingsField from "./SettingsField";
import "./ChatSettings.css";

const ChatSettings = () => {
  const [blockedWords, setBlockedWords] = useState(["", "", "", ""]);
  const [bannedChatters, setBannedChatters] = useState(["", "", "", ""]);

  return (
    <fieldset className="chat-settings">
      <SettingsField
        labelName="Blocked words"
        inputId="blocked-words-id"
        className="mg-b-1"
      >
        <div className="settings-block-list">
          {blockedWords.map((value, index) => (
            <input key={index} type="text" placeholder="Type a word to block" />
          ))}
        </div>
        Messages containing words in this list will not be sent to your chat
        room.
      </SettingsField>
      <div style={{ height: "4.8rem" }}></div>
      <SettingsField
        labelName="Banned chatters"
        inputId="banned-chatters-id"
        className="mg-b-1"
      >
        <div className="settings-block-list">
          {bannedChatters.map((value, index) => (
            <input key={index} type="text" placeholder="Type a word to block" />
          ))}
        </div>
        Users on this list will not be able to send messages in your chat room.
      </SettingsField>
    </fieldset>
  );
};

export default ChatSettings;
