import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import { logout } from "../redux/actions/userActions";

const ProtectedAuthenRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const checkTokenExpired = () => {
    const jwt_token = Cookies.get("_token");
    if (jwt_token) {
      try {
        const decode = jwt_decode(jwt_token);
        const currentTime = Date.now() / 1000;
        if (decode.exp < currentTime) {
          // Cookies.remove("_token");
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.error(err);
        return true;
      }
    }
    return true;
  };
  return (
    <Fragment>
      <Route
        {...rest}
        render={(props) => {
          if (!checkTokenExpired()) {
            return <Component {...props} />;
          } else {
            dispatch(logout())
            return <Redirect to="/login" />;
          }
        }}
      />
    </Fragment>
  );
};

export default ProtectedAuthenRoute;
