import React from "react";
import SettingsContext from "./SettingsContext";
import PropTypes from "prop-types";

export const GET_BLOCKED_SETTINGS = "GET_BLOCCKED_SETINGS";
export const SET_BLOCKED_WORDS = "SET_BLOCKED_WORDS";
export const SET_BLOCKED_CHATTERS = "SET_BLOCKED_CHATTERS";

const initialState = {
  blockedWords: ["smoke", "weed"],
  blockedChatters: ["ayako", "jason", "shawn"],
};

const reducer = (state, action) => {
  switch (action.type) {
    case GET_BLOCKED_SETTINGS:
      return {
        ...state,
      };
    case SET_BLOCKED_WORDS:
      return {
        ...state,
        blockedWords: action.blockedWords,
      };
    case SET_BLOCKED_CHATTERS:
      return {
        ...state,
        blockedChatters: action.blockedChatters,
      };
    default:
      throw new Error("unexpected action type");
  }
};

const SettingsContextProvider = ({ children }) => {
  const value = React.useReducer(reducer, initialState);
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

SettingsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SettingsContextProvider;
