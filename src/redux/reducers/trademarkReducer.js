import {
  ALL_TRADEMARKS_REQUEST,
  ALL_TRADEMARKS_SUCCESS,
  ALL_TRADEMARKS_FAIL,
  CREATE_TRADEMARK_REQUEST,
  CREATE_TRADEMARK_SUCCESS,
  CREATE_TRADEMARK_FAIL,
  CREATE_TRADEMARK_RESET,
  UPDATE_TRADEMARK_REQUEST,
  UPDATE_TRADEMARK_SUCCESS,
  UPDATE_TRADEMARK_FAIL,
  UPDATE_TRADEMARK_RESET,
  ALL_AMENDMENTS_REQUEST,
  ALL_AMENDMENTS_SUCCESS,
  ALL_AMENDMENTS_FAIL,
  ALL_ASSIGNMENTS_REQUEST,
  ALL_ASSIGNMENTS_SUCCESS,
  ALL_ASSIGNMENTS_FAIL,
  ALL_RENEWALS_REQUEST,
  ALL_RENEWALS_SUCCESS,
  ALL_RENEWALS_FAIL,
  GET_TRADEMARK_SUCCESS,
  CLEAR_ERRORS,
} from "../../commons/constants/trademarkConstants";

export const getTrademarkReducer = (state = { trademark: null }, action) => {
  switch (action.type) {
    case GET_TRADEMARK_SUCCESS:
      return {
        trademark: action.payload,
      };
    default:
      return state;
  }
}

export const getTrademarksReducer = (state = { trademarks: [] }, action) => {
  switch (action.type) {
    case ALL_TRADEMARKS_REQUEST:
      return {
        loading: true,
        trademarks: [],
      };
    case ALL_TRADEMARKS_SUCCESS:
      return {
        loading: false,
        trademarks: action.payload,
      };
    case ALL_TRADEMARKS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const createTrademarkReducer = (state = { trademark: {} }, action) => {
  switch (action.type) {
    case CREATE_TRADEMARK_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case CREATE_TRADEMARK_SUCCESS:
      return {
        ...state,
        loading: false,
        code: action.payload.status.code,
        trademark: action.payload.data,
      };
    case CREATE_TRADEMARK_RESET:
      return {
        ...state,
        code: "",
      };
    case CREATE_TRADEMARK_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const updateTrademarkReducer = (state = { trademark: {} }, action) => {
  switch (action.type) {
    case UPDATE_TRADEMARK_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case UPDATE_TRADEMARK_SUCCESS:
      return {
        ...state,
        loading: false,
        code: action.payload.status.code,
        message: action.payload.data
      };
    case UPDATE_TRADEMARK_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case UPDATE_TRADEMARK_RESET:
      return {
        ...state,
        code: "",
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const getAmendmentsReducer = (state = { amendments: [] }, action) => {
  switch (action.type) {
    case ALL_AMENDMENTS_REQUEST:
      return {
        loading: true,
        amendments: [],
      };
    case ALL_AMENDMENTS_SUCCESS:
      return {
        loading: false,
        amendments: action.payload,
      };
    case ALL_AMENDMENTS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const getAssignmentsReducer = (state = { assignments: [] }, action) => {
  switch (action.type) {
    case ALL_ASSIGNMENTS_REQUEST:
      return {
        loading: true,
        assignments: [],
      };
    case ALL_ASSIGNMENTS_SUCCESS:
      return {
        loading: false,
        assignments: action.payload,
      };
    case ALL_ASSIGNMENTS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const getRenewalsReducer = (state = { renewals: [] }, action) => {
  switch (action.type) {
    case ALL_RENEWALS_REQUEST:
      return {
        loading: true,
        renewals: [],
      };
    case ALL_RENEWALS_SUCCESS:
      return {
        loading: false,
        renewals: action.payload,
      };
    case ALL_RENEWALS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

