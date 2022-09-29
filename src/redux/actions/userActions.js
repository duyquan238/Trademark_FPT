// import axios from "axios";
import Cookies from "js-cookie";
import axiosConfig from "../../commons/Apis/axiosConfig";

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  ALL_USERS_SUCCESS,
  ALL_USERS_REQUEST,
  ALL_USERS_FAIL,
  CLEAR_ERRORS,
} from "../../commons/constants/userConstants";

//Login Action
export const login = (username, password) => async (dispatch, getState) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const { data } = await axiosConfig.post("/user/login", {
      username,
      password,
    });
    if (data.status.code === "200") {
      Cookies.remove("_token");
      Cookies.set("_token", data.data.token);
      dispatch({ type: LOGIN_SUCCESS, payload: data.data.user });
    } else {
      dispatch({
        type: LOGIN_FAIL,
        payload: data.data,
      });
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error,
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    Cookies.remove("_token");
    dispatch({
      type: LOGOUT_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: LOGOUT_FAIL,
      payload: error,
    });
  }
};

//Load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: LOAD_USER_REQUEST,
    });
    const { data } = await axiosConfig.get("/user/me");
    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error,
    });
  }
};

//get all user 
export const getUsers = (params) => async (dispatch) => {
  try {
    dispatch({
      type: ALL_USERS_REQUEST,
    });
    let getURL = "/user/get-all?";
    // delete property null or empty
    let filteredParams = Object.keys(params)
      .filter(
        (key) => params[key] !== null && params[key].toString().trim() !== ""
      )
      .reduce((obj, key) => {
        if (key === "employeeName") {
          obj[key] = params[key].trim();
        } else {
          obj[key] = params[key];
        }
        return obj;
      }, {});
    const { data } = await axiosConfig.get(getURL, {
      params: { ...filteredParams },
    });

    dispatch({
      type: ALL_USERS_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    dispatch({
      type: ALL_USERS_FAIL,
      payload: error,
    });
  }
};


//Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};


