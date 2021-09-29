import React, { useState } from "react";

// Components
import StreamSettings from "./StreamSettings";
import ChatSettings from "./ChatSettings";

// Styles
import "./Settings.css";

const Settings = (props) => {
  const STREAM = "stream";
  const CHAT = "chat";
  const [currentTab, setCurrentTab] = useState(STREAM);

  return (
    <div className="main full-width full-height">
      <div className="settings-wrapper mg-2">
        <h2 className="mg-b-2">Settings</h2>

        <div className="settings-tabs">
          <button
            className={currentTab === STREAM ? "selected" : ""}
            onClick={() => setCurrentTab(STREAM)}
          >
            Live stream
          </button>
          <button
            className={currentTab === CHAT ? "selected" : ""}
            onClick={() => setCurrentTab(CHAT)}
          >
            Chat room
          </button>
        </div>
        {currentTab === STREAM ? (
          <StreamSettings {...props} />
        ) : (
          <ChatSettings {...props} />
        )}
      </div>
    </div>
  );
};

export default Settings;
