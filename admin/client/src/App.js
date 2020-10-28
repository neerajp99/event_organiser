import React from "react";
import GlobalFonts from "./styles/fonts/fonts";
import "./App.scss";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
// Bring in Provider for making store accessible to nested components
import { Provider } from "react-redux";
import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { setCurrentAdmin, logOutAdmin } from "./actions/authActions";
import Swal from "sweetalert2";
import Dashboard from "./components/dashboard/Dashboard";
import ProtectedRoute from "./components/commons/ProtectedRoute";
import Attendees from "./components/attendees/Attendees";
import Cfp from "./components/cfp/Cfp";
import Event from "./components/event/CreateEvent";
import Speakers from "./components/speakers/Speakers";
import Profile from "./components/profile/Profile";
import Chat from "./components/chat/Chat";
import { createBrowserHistory } from "history";
import Confirm from "./components/authentication/Confirm"
import EmailSent from "./components/authentication/EmailSent"

export const appHistory = createBrowserHistory();

// Check if a user is already logged in
if (localStorage.adminJWT) {
  // Set authorization token header
  setAuthToken(localStorage.adminJWT);
  // Decode the access tokens to get user information
  const decodedToken = jwt_decode(localStorage.adminJWT);
  // Dispatch the token for setting user as authenticated
  store.dispatch(setCurrentAdmin(decodedToken));
  // Checking for any expired token
  const currentTime = new Date() / 1000;
  if (decodedToken.exp < currentTime) {
    // Logout Admin user
    store.dispatch(logOutAdmin());

    // Create an alert for admin user to know
    Swal.fire({
      title: "Session Expired",
      text: "Please login again.",
      icon: "info",
      confirmButtonText: "Got it"
    });
    window.location.href = "/login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router history={appHistory}>
        <div className="App">
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/confirm" component = {Confirm} />
          <Route exact path="/emailSent" component = {EmailSent} />
          <Switch>
            <ProtectedRoute
              exact
              path="/dashboard"
              // render={() => <Dashboard />}
              component={Dashboard}
            />
          </Switch>
          <Switch>
            <ProtectedRoute
              exact
              path="/cfp"
              // render={() => <Dashboard />}
              component={Cfp}
            />
          </Switch>
          <Switch>
            <ProtectedRoute
              exact
              path="/event"
              // render={() => <Dashboard />}
              component={Event}
            />
          </Switch>
          <Switch>
            <ProtectedRoute
              exact
              path="/speakers"
              // render={() => <Speakers />}
              component={Speakers}
              forceRefresh={true}
            />
          </Switch>
          <Switch>
            <ProtectedRoute
              exact
              path="/attendees"
              component={Attendees}
              forceRefresh={true}
            />
          </Switch>
          <Switch>
            <ProtectedRoute exact path="/profile" component={Profile} />
          </Switch>
          <Switch>
            <ProtectedRoute exact path="/chat" component={Chat} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
