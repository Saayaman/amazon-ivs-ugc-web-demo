import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import * as util from "../util";

// Components
import DeleteAccount from "./modals/DeleteAccount";
import PasswordReq from "../common/PasswordReq";
import Avatars from "../common/Avatars";
import BgColor from "../common/BgColor";
import SettingsField from "./SettingsField";

// Styles
import "./Settings.css";
import StreamSettings from "./StreamSettings";
import ChatSettings from "./ChatSettings";

const Settings = (props) => {
  const [currentTab, setCurrentTab] = useState("stream");
  return (
    <div className="main full-width full-height">
      <div className="settings-wrapper mg-2">
        <h2 className="mg-b-2">Settings</h2>

        <div className="settings-tabs">
          <button
            className={currentTab === "stream" && "selected"}
            onClick={() => setCurrentTab("stream")}
          >
            Live stream
          </button>
          <button
            className={currentTab === "chat" && "selected"}
            onClick={() => setCurrentTab("chat")}
          >
            Chat room
          </button>
        </div>
        {currentTab === "stream" ? (
          <StreamSettings {...props} />
        ) : (
          <ChatSettings {...props} />
        )}
      </div>
    </div>
  );
};

export default Settings;
