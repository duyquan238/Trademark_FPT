import React from "react";

import { ThemeProvider } from "@material-ui/core";
import GlobalStyles from "./commons/GlobalStyles";
import theme from "./commons/theme";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import moment from "moment";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Error from "./pages/Error";
import ProtectedAuthenRoute from "./route/ProtectedAuthenRoute"

require('dotenv').config();
require("moment-timezone");
moment.tz.setDefault("Atlantic/Azores");

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Switch>
          <Route path="/login" component={Login} exact />
          <Route path="/404" component={NotFound} exact />
          <Route path="/error" component={Error} exact />
          <ProtectedAuthenRoute path="/" component={DashboardLayout} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
