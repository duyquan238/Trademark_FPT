import React, { Fragment, useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Route, Redirect, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import Trademark from "./Trademark";
import ManageTasks from "./ManageTasks";
import TaskDetail from "./TaskDetail";
import ManageUsers from "./ManageUsers";
import Statistical from "./Statistical";
import MyAccount from "./MyAccount";
import CreateUser from "./CreateUser";
import Home from "./Home";

import { loadUser } from "../redux/actions/userActions";
import store from "../redux/store";

import ProtectedAuthor from "../route/ProtectedAuthor";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  wrapperContent: {
    marginTop: 64,
    width: "100%",
    overflow: "auto",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
  },
}));

const DashboardLayout = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [isUpdateManager, setIsUpdateManager] = useState(false);
  //set open state for drawer
  const setOpenState = (open) => {
    setOpen(open);
  };

  const setUpdateManagerState = (isUpdateManager) => {
    setIsUpdateManager(isUpdateManager);
  };
  useEffect(() => {
    store.dispatch(loadUser());
  }, [isUpdateManager]);
  return (
    <Fragment>
      <div className={classes.wrapper}>
        <CssBaseline />
        <Header modifierOpenState={setOpenState} open={open} />
        <Sidebar modifierOpenState={setOpenState} open={open} />
        <div className={classes.wrapperContent}>
          <main className={classes.content}>
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/create-trademark" component={Trademark} exact />
              <Route
                path="/trademark/:trademarkId"
                component={Trademark}
                exact
              />
              <Route
                path="/trademark/:trademarkId/version/:versionId"
                component={Trademark}
                exact
              />
              <Route path="/manage-tasks" component={ManageTasks} exact />
              <Route path="/task/:taskId" component={TaskDetail} exact />
              <ProtectedAuthor
                path="/manage-users"
                component={ManageUsers}
                exact
                modifyManager={setUpdateManagerState}
                isUpdateManager={isUpdateManager}
              />
              <ProtectedAuthor
                path="/create-user"
                component={CreateUser}
                exact
              />
              <ProtectedAuthor
                path="/statistical"
                component={Statistical}
                exact
              />
              <Route path="/my-account" component={MyAccount} exact />
              <Route>
                <Redirect to="/404" />
              </Route>
            </Switch>
          </main>
        </div>
      </div>
    </Fragment>
  );
};

export default DashboardLayout;
