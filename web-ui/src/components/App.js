import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { getBasePath } from "./util";

// Components
import Layout from "./ugc/Layout";

// Styles
import "./App.css";
import SettingsContextProvider from "../context/SettingsProvider";

const App = () => {
  const basePath = getBasePath();
  return (
    <SettingsContextProvider>
      <Router>
        <Switch>
          <Route
            exact
            path={`${basePath}settings`}
            render={(props) => <Layout {...props} page="SETTINGS" />}
          />
          <Route
            path={`${basePath}channel/:user`}
            render={(props) => <Layout {...props} page="CHANNEL" />}
          />
          <Route
            path="/"
            render={(props) => <Layout {...props} page="HOME" />}
          />
        </Switch>
      </Router>
    </SettingsContextProvider>
  );
};

export default App;
