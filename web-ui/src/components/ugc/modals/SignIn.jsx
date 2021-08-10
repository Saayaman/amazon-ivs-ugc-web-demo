/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as util from "../../util";

// Styles
import "./Auth.css";

const SignIn = (props) => {
  const [email, setEmail] = useState(props.email);
  const [password, setPassword] = useState(props.password);
  const [validEmail, setValidEmail] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const inputRef = React.createRef();

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    inputRef.current.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      const baseUrl = util.getApiUrlBase();
      const url = `${baseUrl}auth`;
      const options = {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      };

      const response = await fetch(url, options);
      if (response.status === 200) {
        const json = await response.json();
        setUnauthorized(false);
        setProcessing(false);
        util.setWithExpiry(
          `ugc`,
          json.AuthenticationResult,
          json.AuthenticationResult.ExpiresIn
        );
        props.setUserAuth(json.AuthenticationResult);
        props.getUserInfo(json.AuthenticationResult);
        props.closeSignIn();
      } else {
        throw new Error("Unable to signin");
      }
    } catch (error) {
      console.log(error.message);
      setUnauthorized(true);
      setProcessing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 27) {
      // keyCode 27 is Escape key
      props.closeSignIn();
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLinkClick = (e) => {
    e.preventDefault();
    props.closeSignIn();
    props.showSignUp();
  };

  const resetSignIn = () => {
    setValidEmail(true);
    setProcessing(false);
    setUnauthorized(false);
  };

  const handleSignIn = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    resetSignIn();

    const validEmail = util.validateEmail(email);
    if (validEmail) {
      setProcessing(true);
      signIn(email, password);
    }

    setValidEmail(validEmail);
  };

  const signInDisabled = !email || !password || processing;
  const signInText = processing ? "Processing..." : "Sign In";

  return (
    <div className="modal pos-absolute top-0 bottom-0">
      <div className="modal__el modal__el--full-height">
        <div className="justify-center-wrapper">
          <h2 className="mg-b-2">Sign in</h2>
          <form action="">
            <fieldset className="mg-b-2">
              <input
                type="email"
                placeholder="Email"
                autoComplete="new-password"
                value={email}
                ref={inputRef}
                onChange={handleEmailChange}
              />
              {!validEmail && (
                <div className="email-error-msg">Invalid email</div>
              )}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              {unauthorized && (
                <div className="error-msg">
                  Your username and password combination was not found.
                </div>
              )}
              <button
                className="mg-t-1 btn btn--primary"
                disabled={signInDisabled}
                onClick={handleSignIn}
              >
                {signInText}
              </button>
              <div className="create-account">
                Don't have an account?{" "}
                <a
                  className="create-account-link"
                  href="/signup"
                  onClick={handleLinkClick}
                >
                  Create account
                </a>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
      <div className="modal__overlay" onClick={props.closeSignIn}></div>
    </div>
  );
};

SignIn.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  closeSignIn: PropTypes.func,
  showSignUp: PropTypes.func,
  getUserInfo: PropTypes.func,
  setUserInfo: PropTypes.func,
  setUserAuth: PropTypes.func,
  handleAppClick: PropTypes.func,
};

export default SignIn;
