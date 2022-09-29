import React, { Fragment } from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

const ProtectedAuthor = ({
  component: Component,
  modifyManager,
  isUpdateManager,
  ...rest
}) => {
  const { user } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Fragment>
      <Route
        {...rest}
        render={(props) => {
          if (user.role.id) {
            if (user.role.id === 1) {
              return (
                <Component
                  {...props}
                  modifyManager={modifyManager}
                  isUpdateManager={isUpdateManager}
                />
              );
            } else {
              enqueueSnackbar(
                "You do not have permission to access this resource!!",
                { variant: "warning" }
              );
              return <Redirect to="/" />;
            }
          }
        }}
      />
    </Fragment>
  );
};

export default ProtectedAuthor;
