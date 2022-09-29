import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  CLEAR_AUTHEN_ONLY,
  CLEAR_ERRORS,
} from "../../commons/constants/userConstants";

export const authReducer = (
  state = {
    user: {
      name: "",
      role: {
        name: "",
      },
    },
  },
  action
) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case LOAD_USER_REQUEST:
      return {
        ...state,
        isAuthenticated: false,
      };
    case LOGIN_SUCCESS:
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case LOGOUT_SUCCESS:
      return {
        isAuthenticated: false,
        user: null,
      };
      case CLEAR_AUTHEN_ONLY:
        return {
          isAuthenticated: false,
          user: action.payload,
        };
    case LOGOUT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        error: action.payload,
      };
    case LOAD_USER_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
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

export const getUsersReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case ALL_USERS_REQUEST:
      return {
        loading: true,
        users: [],
      };
    case ALL_USERS_SUCCESS:
      return {
        loading: false,
        users: action.payload,
      };
    case ALL_USERS_FAIL:
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
