
export const OUR_REF = "TB/1808/01-17/TM – VN"
export const INIT_TRADEMARK_VALUES = {
  id: "",
  ourRef: OUR_REF,
  agent: {
    id: "",
    name: "",
    yourRef: "",
    address: "",
  },
  instructionDate: null,
  listOfInstructor: [],
  name: "",
  typeId: null,
  colorEn: "",
  colorVi: "",
  descEn: "",
  descVi: "",
  applicant: [],
  country: null,
  classList: "",
  classDetailEN: "",
  classDetailVI: "",
  priority: [],
  poaId: "",
  application: {
    id: null,
    isInternational: "",
    number: "",
    fillingDate: null,
    deadline: null,
    status: "",
    decisionRefusals: [],
    acceptanceNumber: "",
    acceptanceDate: null,
    allowanceNumber: "",
    allowanceDate: null,
    paymentDate: null,
    paymentDeadline: null,
    registerNumber: "",
    registerDate: null,
    expireDate: null,
  },
  notifyRefusals: [],
  file: null,
};

export const ALL_TRADEMARKS_REQUEST = "ALL_TRADEMARKS_REQUEST";
export const ALL_TRADEMARKS_SUCCESS = "ALL_TRADEMARKS_SUCCESS";
export const ALL_TRADEMARKS_FAIL = "ALL_TRADEMARKS_FAIL";

export const GET_TRADEMARK_SUCCESS = "GET_TRADEMARK_SUCCESS";

export const CREATE_TRADEMARK_REQUEST = "CREATE_TRADEMARK_REQUEST";
export const CREATE_TRADEMARK_SUCCESS = "CREATE_TRADEMARK_SUCCESS";
export const CREATE_TRADEMARK_FAIL = "CREATE_TRADEMARK_FAIL";
export const CREATE_TRADEMARK_RESET = "CREATE_TRADEMARK_RESET";

export const UPDATE_TRADEMARK_REQUEST = "UPDATE_TRADEMARK_REQUEST";
export const UPDATE_TRADEMARK_SUCCESS = "UPDATE_TRADEMARK_SUCCESS";
export const UPDATE_TRADEMARK_FAIL = "UPDATE_TRADEMARK_FAIL";
export const UPDATE_TRADEMARK_RESET = "UPDATE_TRADEMARK_RESET";

export const ALL_AMENDMENTS_REQUEST = "ALL_AMENDMENTS_REQUEST";
export const ALL_AMENDMENTS_SUCCESS = "ALL_AMENDMENTS_SUCCESS";
export const ALL_AMENDMENTS_FAIL = "ALL_AMENDMENTS_FAIL";

export const ALL_ASSIGNMENTS_REQUEST = "ALL_ASSIGNMENTS_REQUEST";
export const ALL_ASSIGNMENTS_SUCCESS = "ALL_ASSIGNMENTS_SUCCESS";
export const ALL_ASSIGNMENTS_FAIL = "ALL_ASSIGNMENTS_FAIL";

export const ALL_RENEWALS_REQUEST = "ALL_RENEWALS_REQUEST";
export const ALL_RENEWALS_SUCCESS = "ALL_RENEWALS_SUCCESS";
export const ALL_RENEWALS_FAIL = "ALL_RENEWALS_FAIL";

export const CLEAR_ERRORS = "CLEAR_ERRORS";
