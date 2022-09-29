import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
  getTrademarksReducer,
  createTrademarkReducer,
  updateTrademarkReducer,
  getAmendmentsReducer,
  getAssignmentsReducer,
  getRenewalsReducer,
  getTrademarkReducer,
} from "../redux/reducers/trademarkReducer";

import { 
  authReducer,
  getUsersReducer
 } from "../redux/reducers/userReducer";

import {
  getTasksReducer,
} from "./reducers/taskReducer"

import { getNotiReducer } from "./reducers/notificationReducer";

const reducer = combineReducers({
  trademarks: getTrademarksReducer,
  trademark: getTrademarkReducer,
  createTrademark: createTrademarkReducer,
  updateTrademark: updateTrademarkReducer,
  amendments: getAmendmentsReducer,
  assignments: getAssignmentsReducer,
  renewals: getRenewalsReducer,
  users: getUsersReducer,
  tasks: getTasksReducer,
  auth: authReducer,
  notifications: getNotiReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
