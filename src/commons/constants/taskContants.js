import { now } from "../ultils/DateUltil";
export const INIT_TASK_DATA = {
  categoryId: "",
  trademarkId: "",
  assigneeId: "",
  status: "",
  priority: "",
  createdBy: "",
  createdDate: now(),
  deadline: null,
  title: "",
  content: "",
};

export const ALL_TASKS_REQUEST = "ALL_TASKS_REQUEST";
export const ALL_TASKS_SUCCESS = "ALL_TASKS_SUCCESS";
export const ALL_TASKS_FAIL = "ALL_TASKS_FAIL";

export const CLEAR_ERRORS = "CLEAR_ERRORS";

export const CATEGORIES = [
  { id: "1", name: "New" },
  { id: "2", name: "Modify" },
  { id: "3", name: "System" },
];

export const TASK_STATUS = [
  { id: "1", name: "Not Assign" },
  { id: "2", name: "Not Done" },
  { id: "3", name: "Done" },
];

export const TASK_PRIORITY = [
  { id: "1", name: "Very High" },
  { id: "2", name: "High" },
  { id: "3", name: "Medium" },
  { id: "4", name: "Low" },
  { id: "5", name: "Very Low" },
];
