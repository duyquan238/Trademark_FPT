export const INIT_USER_DATA = {
  active: null,
  birthDate: null,
  departmentId: 1,
  emailAddress: "",
  id: null,
  isDelete: false,
  leaderId: null,
  name: "",
  password: "",
  phoneNumber: "",
  roleId: "",
  username: "",
  joinDate: null,
};

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const CLEAR_AUTHEN_ONLY = "CLEAR_AUTHEN_ONLY";

export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAIL = "LOGOUT_FAIL";

export const LOAD_USER_REQUEST = "LOAD_USER_REQUEST";
export const LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS";
export const LOAD_USER_FAIL = "LOAD_USER_FAIL";

export const ALL_USERS_REQUEST = "ALL_USERS_REQUEST";
export const ALL_USERS_SUCCESS = "ALL_USERS_SUCCESS";
export const ALL_USERS_FAIL = "ALL_USERS_FAIL";

export const CLEAR_ERRORS = "CLEAR_ERRORS";

export const ROLES = [
  { id: 1, name: "Manager", canSet : false },
  { id: 2, name: "Attorney", canSet : true },
  { id: 3, name: "Associate", canSet : true },
];

export const DEPARTMENTS = [
    {id : 1, name : "Trademark"}
]
