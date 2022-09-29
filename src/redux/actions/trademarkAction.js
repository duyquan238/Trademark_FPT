import axiosConfig from "../../commons/Apis/axiosConfig";
import {
  ALL_TRADEMARKS_REQUEST,
  ALL_TRADEMARKS_SUCCESS,
  ALL_TRADEMARKS_FAIL,
  CREATE_TRADEMARK_REQUEST,
  CREATE_TRADEMARK_SUCCESS,
  CREATE_TRADEMARK_FAIL,
  UPDATE_TRADEMARK_REQUEST,
  UPDATE_TRADEMARK_SUCCESS,
  UPDATE_TRADEMARK_FAIL,
  ALL_AMENDMENTS_REQUEST,
  ALL_AMENDMENTS_SUCCESS,
  ALL_AMENDMENTS_FAIL,
  ALL_ASSIGNMENTS_REQUEST,
  ALL_ASSIGNMENTS_SUCCESS,
  ALL_ASSIGNMENTS_FAIL,
  ALL_RENEWALS_REQUEST,
  ALL_RENEWALS_SUCCESS,
  ALL_RENEWALS_FAIL,
  CLEAR_ERRORS,
} from "../../commons/constants/trademarkConstants";

export const getTrademarks = (params) => async (dispatch) => {
  try {
    dispatch({
      type: ALL_TRADEMARKS_REQUEST,
    });
    // sortBy, sortDirection, createBy=value, Status=value, page, name, page, size
    let getURL = "/trademark/get-all?";
    // delete property null or empty
    let filteredParams = Object.keys(params)
      .filter(
        (key) => params[key] !== null && params[key].toString().trim() !== ""
      )
      .reduce((obj, key) => {
        if (key === "trademarkName") {
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
      type: ALL_TRADEMARKS_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    dispatch({
      type: ALL_TRADEMARKS_FAIL,
      payload: error,
    });
  }
};

export const createTrademark = (trademarkData) => async (dispatch) => {
  try {
    dispatch({
      type: CREATE_TRADEMARK_REQUEST,
    });
    const { data } = await axiosConfig.post("/trademark/create", trademarkData);
    dispatch({
      type: CREATE_TRADEMARK_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_TRADEMARK_FAIL,
      payload: error.response.data,
    });
  }
};

export const updateTrademark = (trademarkData) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_TRADEMARK_REQUEST,
    });
    const { data } = await axiosConfig.put("/trademark/update", trademarkData);
    dispatch({
      type: UPDATE_TRADEMARK_SUCCESS,
      payload: data,
    });
    console.log(123);
  } catch (error) {
    console.log(123);
    dispatch({
      type: UPDATE_TRADEMARK_FAIL,
      payload: error.response,
    });
  }
};

//Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};

// get all Amendment
export const getAmendments = (params) => async (dispatch) => {
  try {
    dispatch({
      type: ALL_AMENDMENTS_REQUEST,
    });
    let getURL = "/amendment/" + params.trademarkId;
    // delete property null or empty
    delete params.trademarkId;
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
      type: ALL_AMENDMENTS_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    dispatch({
      type: ALL_AMENDMENTS_FAIL,
      payload: error,
    });
  }
};

// get all Assignment
export const getAssignments = (params) => async (dispatch) => {
  try {
    dispatch({
      type: ALL_ASSIGNMENTS_REQUEST,
    });
    let getURL = "/assignment/" + params.trademarkId;
    // delete property null or empty
    delete params.trademarkId;
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
      type: ALL_ASSIGNMENTS_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    dispatch({
      type: ALL_ASSIGNMENTS_FAIL,
      payload: error,
    });
  }
};

// get all Renewal
export const getRenewals = (params) => async (dispatch) => {
  try {
    dispatch({
      type: ALL_RENEWALS_REQUEST,
    });
    let getURL = "/renewal/" + params.trademarkId;
    // delete property null or empty
    delete params.trademarkId;
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
      type: ALL_RENEWALS_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    dispatch({
      type: ALL_RENEWALS_FAIL,
      payload: error,
    });
  }
};
