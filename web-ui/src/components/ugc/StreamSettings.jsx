import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import * as util from "../util";

// Components
import DeleteAccount from "./modals/DeleteAccount";
import PasswordReq from "../common/PasswordReq";
import Avatars from "../common/Avatars";
import BgColor from "../common/BgColor";
import SettingsField from "./SettingsField";

const StreamSettings = (props) => {
  const {
    userInfo,
    auth,
    onSuccess,
    onFailure,
    closeSettings,
    changeAttribute,
  } = props;

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validPassword, setValidPassword] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [streamKey, setStreamKey] = useState("");
  const [streamKeyResetDisabled, setStreamKeyResetDisabled] = useState(false);
  const [username, setUsername] = useState(userInfo.preferred_username);
  const [avatar, setAvatar] = useState("");
  const [bgColor, setBgColor] = useState("");

  const newPasswordRef = React.createRef();
  const confirmPasswordRef = React.createRef();

  const resetStreamKey = async (auth) => {
    try {
      const baseUrl = util.getApiUrlBase();
      const url = `${baseUrl}channels/default/streamKey/reset?access_token=${encodeURIComponent(
        auth.AccessToken
      )}`;

      const response = await fetch(url);
      if (response.status === 200) {
        onSuccess("Stream Key reset");
        const json = await response.json();
        setStreamKey(json.streamKey.value);
        setStreamKeyResetDisabled(false);
      } else {
        setStreamKeyResetDisabled(false);
        throw new Error("Unable to reset stream key");
      }
    } catch (error) {
      console.log(error.message);
      setStreamKeyResetDisabled(false);
      onFailure("Unable to reset stream key");
    }
  };

  const changePassword = async (auth, oldPassword, newPassword) => {
    try {
      const baseUrl = util.getApiUrlBase();
      const url = `${baseUrl}user/changePassword?access_token=${encodeURIComponent(
        auth.AccessToken
      )}`;
      const options = {
        method: "POST",
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      };

      const response = await fetch(url, options);
      if (response.status === 200) {
        onSuccess(`Password changed`);
        setOldPassword("");
        setPassword("");
        setConfirmPassword("");
      } else {
        throw new Error(`Unable change password`);
      }
    } catch (error) {
      console.log(error.message);
      onFailure(`Unable change password`);
    }
  };

  const handleStreamKeyReset = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStreamKeyResetDisabled(true);
    resetStreamKey(auth);
  };

  const handleStreamKeyCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    copyText("stream-key-id", "Copied stream key");
  };

  const handleStreamKeyFocus = (e) => {
    e.target.select();
    handleStreamKeyCopy(e);
  };

  const handleServerCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    copyText("ingest-server-id", "Copied ingest server URL");
  };

  const handleServerFocus = (e) => {
    e.target.select();
    handleServerCopy(e);
  };

  const handleUsernameSave = (e, username) => {
    e.preventDefault();
    e.stopPropagation();
    changeAttribute(auth, "Username", "preferred_username", username);
  };

  const handleUsernameKeyDown = (e, username) => {
    if (e.keyCode === 13 && username) {
      // keyCode 13 is carriage return
      changeAttribute(auth, "Username", "preferred_username", username);
    }
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const validPw = util.validatePassword(password);
    if (!validPw) {
      onFailure("Invalid password");
    } else {
      changePassword(auth, oldPassword, password);
    }
    setValidPassword(validPw);
  };

  const oldPasswordKeyDown = (e, oldPassword) => {
    if (e.keyCode === 13 && oldPassword) {
      // keyCode 13 is carriage return
      newPasswordRef.current.focus();
    }
  };

  const newPasswordKeyDown = (e, newPassword) => {
    if (e.keyCode === 13 && newPassword) {
      // keyCode 13 is carriage return
      confirmPasswordRef.current.focus();
    }
  };

  const confirmPasswordKeyDown = (e, confirmPassword) => {
    if (e.keyCode === 13 && confirmPassword) {
      // keyCode 13 is carriage return
      const validPw = util.validatePassword(password);
      if (!validPw) {
        onFailure("Invalid password");
      } else {
        changePassword(auth, oldPassword, password);
      }
      setValidPassword(validPw);
    }
  };

  const handleAvatarClick = (e, name) => {
    setAvatar(name);
    changeAttribute(auth, "Avatar", "picture", name);
  };

  const handleColorClick = (e, name) => {
    e.preventDefault();
    e.stopPropagation();
    const bgColorValue = { bgColor: name };
    changeAttribute(auth, "Color", "profile", bgColorValue);

    setBgColor(name);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDelete(true);
  };

  const copyText = (id, message) => {
    /* Get the text field */
    var copyText = document.getElementById(id);

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

    util.copyTextToClipboard(copyText.value);

    /* Alert the copied text */
    if (message) {
      onSuccess(`${message}`);
    } else {
      onSuccess(`Copied the text: ${copyText.value}`);
    }
  };

  const userInfoValid = Object.keys(userInfo).length ? true : false;
  const currentBgColor = !!bgColor
    ? bgColor
    : userInfoValid
    ? userInfo.profile.bgColor
    : "";
  const currentAvatar = !!avatar
    ? avatar
    : userInfoValid
    ? userInfo.picture
    : "";

  let currentIngestServer = userInfoValid
    ? userInfo.profile.defaultChannelDetails.channel.ingestEndpoint
    : "";
  if (currentIngestServer) {
    currentIngestServer = `rtmps://${currentIngestServer}/app/`;
  }

  let currentStreamKey = "";

  if (!!streamKey) {
    currentStreamKey = streamKey;
  } else if (userInfoValid) {
    currentStreamKey =
      userInfo.profile.defaultChannelDetails.streamKey.value ||
      userInfo.profile.defaultChannelDetails.streamKey.streamKey.value;
  }

  const streamKeyCopyDisabled = !currentStreamKey;
  const ingestServerCopyDisabled = !currentIngestServer;
  const passwordSaveDisabled =
    !password || !confirmPassword || password !== confirmPassword;

  return (
    <>
      <fieldset className="mg-b-2">
        <SettingsField
          labelName="Stream Key"
          inputId="stream-key-id"
          className="mg-b-1"
        >
          <input
            id="stream-key-id"
            className="settings-read-only-input mono-text mg-b-0 mg-r-1"
            type="text"
            placeholder="Key"
            value={currentStreamKey}
            onFocus={handleStreamKeyFocus}
            readOnly
          />
          <button
            className="btn btn--destruct btn--settings mg-b-0 mg-r-1"
            onClick={handleStreamKeyReset}
            disabled={streamKeyResetDisabled}
          >
            Reset
          </button>
          <button
            className="btn btn--primary btn--settings mg-b-0"
            disabled={streamKeyCopyDisabled}
            onClick={handleStreamKeyCopy}
          >
            Copy
          </button>
        </SettingsField>

        <SettingsField
          labelName="Ingest Server"
          inputId="ingest-server-id"
          className="mg-b-3"
        >
          <input
            id="ingest-server-id"
            className="settings-read-only-input mono-text mg-b-0 mg-r-1"
            type="text"
            placeholder="Server"
            value={currentIngestServer}
            onFocus={handleServerFocus}
            readOnly
          />
          <button
            className="btn btn--primary btn--settings mg-b-0"
            disabled={ingestServerCopyDisabled}
            onClick={handleServerCopy}
          >
            Copy
          </button>
        </SettingsField>

        <SettingsField
          labelName="Username"
          inputId="username-id"
          className="mg-b-3"
        >
          <input
            className="mg-b-0 mg-r-1"
            id="username-id"
            type="text"
            placeholder="Username"
            value={username}
            autoComplete="new-password"
            onKeyDown={(e) => handleUsernameKeyDown(e, username)}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="btn btn--primary btn--settings mg-b-0"
            disabled={!username}
            onClick={(e) => handleUsernameSave(e, username)}
          >
            Save
          </button>
        </SettingsField>

        <SettingsField
          labelName="Current Password"
          inputId="current-password-id"
          className="mg-b-1"
        >
          <input
            className="mg-b-0 settings-input-right-margin"
            id="current-password-id"
            type="password"
            placeholder="Current Password"
            value={oldPassword}
            onKeyDown={(e) => oldPasswordKeyDown(e, oldPassword)}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </SettingsField>

        <SettingsField
          labelName="New Password"
          inputId="new-password-id"
          className="mg-b-1"
        >
          <input
            className="mg-b-0 settings-input-right-margin"
            id="new-password-id"
            ref={newPasswordRef}
            type="password"
            placeholder="New Password"
            value={password}
            onKeyDown={(e) => newPasswordKeyDown(e, password)}
            onChange={(e) => setPassword(e.target.value)}
          />
        </SettingsField>

        <SettingsField
          labelName="Confirm Password"
          inputId="confirm-password-id"
          className="mg-b-1"
        >
          <input
            className="mg-b-0 mg-r-1"
            id="confirm-password-id"
            ref={confirmPasswordRef}
            type="password"
            placeholder="Password"
            value={confirmPassword}
            onKeyDown={(e) => confirmPasswordKeyDown(e, confirmPassword)}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="btn btn--primary btn--settings mg-b-0"
            disabled={passwordSaveDisabled}
            onClick={handlePasswordSave}
          >
            Save
          </button>
        </SettingsField>
        <div className="settings-field mg-b-3">
          <div className="spacer"></div>
          <PasswordReq validPassword={validPassword} />
        </div>

        <SettingsField
          labelName="Avatar"
          inputId="avatar-id"
          className="mg-b-1"
        >
          <div className="item-select-container settings-input-right-margin pd-1">
            <div
              className={`avatars pos-relative item-select-grid item-select-grid--small`}
            >
              <Avatars
                currentAvatar={currentAvatar}
                handleAvatarClick={handleAvatarClick}
              />
            </div>
          </div>
        </SettingsField>

        <SettingsField labelName="Color" inputId="color-id" className="mg-b-25">
          <div className="item-select-container settings-input-right-margin pd-1">
            <div
              className={`colors pos-relative item-select-grid item-select-grid--small`}
            >
              <BgColor
                bgColor={currentBgColor}
                handleColorClick={handleColorClick}
              />
            </div>
          </div>
        </SettingsField>

        <SettingsField labelName="Delete Account" inputId="delete-account-id">
          <button
            className="btn btn--destruct btn--auto-width mg-b-0 pd-x-2"
            onClick={handleDeleteClick}
          >
            Delete my account
          </button>
        </SettingsField>
      </fieldset>
      {showDelete && (
        <DeleteAccount
          onSuccess={onSuccess}
          onFailure={onFailure}
          closeSettings={closeSettings}
          closeDelete={() => setShowDelete(false)}
          auth={auth}
        />
      )}
    </>
  );
};

StreamSettings.propTypes = {
  userInfo: PropTypes.object,
  auth: PropTypes.object,
  closeSettings: PropTypes.func,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
  changeAttribute: PropTypes.func,
};

export default StreamSettings;
