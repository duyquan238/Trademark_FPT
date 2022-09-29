import axiosConfig from "../../commons/Apis/axiosConfig";

import {
    ALL_NOTI_FAIL,
    ALL_NOTI_REQUEST,
    ALL_NOTI_SUCCESS,
    CLEAR_ERRORS
} from "../../commons/constants/notificationConstant"

//get all tasks 
export const getNotifications = (params={}) => async (dispatch) => {
    try {
      dispatch({
        type: ALL_NOTI_REQUEST,
      });
      let getURL = "/notify/get-all?";
      // delete property null or empty
      let filteredParams = Object.keys(params)
        .filter(
          (key) => params[key] !== null && params[key].toString().trim() !== ""
        )
        .reduce((obj, key) => {
            obj[key] = params[key];
          return obj;
        }, {});
      const { data } = await axiosConfig.get(getURL, {
        params: { ...filteredParams },
      });
  
      dispatch({
        type: ALL_NOTI_SUCCESS,
        payload: data.data,
      });
    } catch (error) {
      dispatch({
        type: ALL_NOTI_FAIL,
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