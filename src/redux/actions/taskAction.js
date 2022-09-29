import axiosConfig from "../../commons/Apis/axiosConfig";

import {
    ALL_TASKS_FAIL,
    ALL_TASKS_REQUEST,
    ALL_TASKS_SUCCESS,
    CLEAR_ERRORS,
} from "../../commons/constants/taskContants"

//get all tasks 
export const getTasks = (params) => async (dispatch) => {
    try {
      dispatch({
        type: ALL_TASKS_REQUEST,
      });
      let getURL = "/task/get-all?";
      // delete property null or empty
      let filteredParams = Object.keys(params)
        .filter(
          (key) => params[key] !== null && params[key].toString().trim() !== ""
        )
        .reduce((obj, key) => {
          if (key === "title") {
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
        type: ALL_TASKS_SUCCESS,
        payload: data.data,
      });
    } catch (error) {
      dispatch({
        type: ALL_TASKS_FAIL,
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