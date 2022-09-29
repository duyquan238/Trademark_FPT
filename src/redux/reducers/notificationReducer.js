import {
    ALL_NOTI_FAIL,
    ALL_NOTI_SUCCESS,
    ALL_NOTI_REQUEST, 
    CLEAR_ERRORS
} from "../../commons/constants/notificationConstant";


export const getNotiReducer = (state = { notifications: [] }, action) => {
    switch (action.type) {
      case ALL_NOTI_REQUEST:
        return {
          loading: true,
          notifications: [],
        };
      case ALL_NOTI_SUCCESS:
        return {
          loading: false,
          notifications: action.payload,
        };
      case ALL_NOTI_FAIL:
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