import React, { useState, useRef, useMemo } from "react";

import { makeStyles } from "@material-ui/core/styles";

import * as Yup from "yup";
import { Formik, Form, getIn } from "formik";
import { useSnackbar } from "notistack";
import axiosConfig from "../commons/Apis/axiosConfig";

import { useParams } from "react-router";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ListTask from "../components/task/listTask";
import Divider from "@material-ui/core/Divider";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "../components/DialogTitle";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";

import Autocomplete from "@material-ui/lab/Autocomplete";

import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import MetaData from "../components/MetaData";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import PostAddIcon from "@material-ui/icons/PostAdd";

import {
  TASK_PRIORITY,
  TASK_STATUS,
  CATEGORIES,
} from "../commons/constants/taskContants";

import { INIT_TASK_DATA } from "../commons/constants/taskContants";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  margin: {
    margin: theme.spacing(1),
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
  },
  input: {
    display: "none",
  },
  styleBtn: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: theme.spacing(2),
  },
  noBorder: {
    border: 0,
  },
}));

const ManageTasks = () => {
  const { user } = useSelector((state) => state.auth);
  const params = useParams();
  const classes = useStyles();
  const formikRef = React.createRef();
  const childRef = useRef();
  const { enqueueSnackbar } = useSnackbar();
  // const [taskId, setTaskId] = useState();
  const [trademarks, setTrademarks] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [isShowSelectTrademark, setIsShowSelectTrademark] = useState(false);
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const handleUploadFile = (e) => {
    setIsFilePicked(true);
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };
  const canCreateTask = () => {
    let acceptRole = [1, 2];
    if (user.roleId) {
      return acceptRole.includes(user.roleId);
    }
    return false;
  };
  const canEditTask = () => {
    let acceptRole = [1, 2];
    if (user.roleId) {
      return acceptRole.includes(user.roleId);
    }
    return false;
  };

  //handle add Task
  const handleTask = (values) => {
    const formData = new FormData();
    values.fileName = fileNames;
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.set("data", JSON.stringify(values));
    createTask(formData);
  };

  //handle open Task
  const handleOpenTask = (data) => {
    formikRef.current.resetForm();
    setIsShowSelectTrademark(false);
    setFileNames([]);
    loadAssignees();
    formikRef.current.setFieldValue("createdBy", user.id.toString());
    setIsFilePicked(false);
    setSelectedFiles([]);
    setAddTaskDialogOpen(true);
  };
  //Reload list
  const reloadList = () => {
    childRef.current.reloadTasks();
  };

  const handleDialogTaskClose = () => {
    setAddTaskDialogOpen(false);
  };

  //Call API to get trademarks
  const loadTrademarks = async () => {
    try {
      const response = await axiosConfig.get(
        "/trademark/get-all?page=1&size=100&status=1,2,3,4,5,6,7,8,9,10,11"
      );
      if (response.data.status.code === "200") {
        setTrademarks(response.data.data.data);
      } else if (response.data.status.code === "500") {
        enqueueSnackbar(response.data.data, { variant: "error" });
      } else {
        enqueueSnackbar("Cannot Load Trademarks", { variant: "error" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  //Call API to load all assignees
  const loadAssignees = async () => {
    if (user && user.roleId === 3) {
      setAssignees([user]);
    } else {
      const response = await axiosConfig.get("/user/get-role");
      try {
        if (response.data.status.code === "200") {
          setAssignees(response.data.data);
        } else if (response.data.status.code === "500") {
          enqueueSnackbar(response.data.data, { variant: "error" });
        } else {
          enqueueSnackbar("Cannot Load Assignees", { variant: "error" });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  //Call API to create Task
  const createTask = async (taskData) => {
    try {
      const response = await axiosConfig.post("/task/create", taskData);
      if (response.data.status.code === "200") {
        formikRef.current.resetForm();
        enqueueSnackbar("Create Task Successfully", { variant: "success" });
        setAddTaskDialogOpen(false);
        reloadList();
      } else if (response.data.status.code === "500") {
        enqueueSnackbar(response.data.status.message, { variant: "error" });
      } else {
        enqueueSnackbar("Cannot Create Task", { variant: "error" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const validationSchema = Yup.object().shape({
    categoryId: Yup.string().nullable().required("Category is required"),
    priority: Yup.string().nullable().required("Priority is required"),
    trademarkId: isShowSelectTrademark
      ? Yup.string().nullable().required("Trademark is required")
      : null,
    status: Yup.string().nullable().required("Status is required"),
    title: Yup.string().required("Title is required"),
    deadline: Yup.date("Invalid Date").nullable(),
  });

  return (
    <Box style={{ paddingTop: 24 }}>
      <MetaData title={"Manage Tasks"} />
      <Container maxWidth={false}>
        <Box className={classes.styleBtn}>
          {canCreateTask() && (
            <Button
              variant="contained"
              color="primary"
              endIcon={<PostAddIcon />}
              onClick={() => {
                handleOpenTask(null);
              }}
            >
              Add New Task
            </Button>
          )}
        </Box>
        <Dialog
          open={addTaskDialogOpen}
          keepMounted
          onClose={() => {
            handleDialogTaskClose();
          }}
          fullWidth={true}
          maxWidth="md"
        >
          <fieldset disabled={!canEditTask()} className={classes.noBorder}>
            <DialogTitle
              onClose={() => {
                handleDialogTaskClose();
              }}
            >
              Add New Task
            </DialogTitle>
            <Divider />
            <Formik
              innerRef={formikRef}
              initialValues={INIT_TASK_DATA}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleTask(values);
              }}
            >
              {({ errors, handleChange, setFieldValue, touched, values }) => (
                <Form>
                  <DialogContent style={{ paddingTop: 16 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormControl
                          fullWidth
                          error={Boolean(
                            touched.categoryId && errors.categoryId
                          )}
                        >
                          <InputLabel id="demo-simple-select-label">
                            Category*
                          </InputLabel>
                          <Select
                            value={values.categoryId || ""}
                            readOnly={!canEditTask()}
                            onChange={(e) => {
                              setFieldValue("categoryId", e.target.value);
                              if (e.target.value === "2") {
                                loadTrademarks();
                                setIsShowSelectTrademark(true);
                              } else {
                                setIsShowSelectTrademark(false);
                                setFieldValue("trademarkId", null);
                              }
                            }}
                          >
                            {CATEGORIES.map(
                              (category, index) =>
                                category.id != 3 && (
                                  <MenuItem value={category.id} key={index}>
                                    {category.name}
                                  </MenuItem>
                                )
                            )}
                          </Select>
                          <FormHelperText>
                            {touched.categoryId && errors.categoryId}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl
                          fullWidth
                          error={Boolean(touched.priority && errors.priority)}
                        >
                          <InputLabel id="demo-simple-select-label">
                            Priority*
                          </InputLabel>
                          <Select
                            value={values.priority || ""}
                            readOnly={!canEditTask()}
                            onChange={(e) => {
                              setFieldValue("priority", e.target.value);
                            }}
                          >
                            {TASK_PRIORITY.map((priority, index) => (
                              <MenuItem value={priority.id} key={index}>
                                {priority.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {touched.priority && errors.priority}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <KeyboardDatePicker
                            error={Boolean(touched.deadline && errors.deadline)}
                            helperText={touched.deadline && errors.deadline}
                            fullWidth
                            disableToolbar
                            readOnly={!canEditTask()}
                            variant="inline"
                            format="DD/MM/YYYY"
                            label="Deadline"
                            name="deadline"
                            value={values.deadline}
                            onChange={(value) =>
                              setFieldValue("deadline", value)
                            }
                            KeyboardButtonProps={{
                              "aria-label": "change date",
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      </Grid>
                    </Grid>
                    {isShowSelectTrademark && (
                      // <FormControl
                      //   fullWidth
                      //   error={Boolean(
                      //     touched.trademarkId && errors.trademarkId
                      //   )}
                      //   className={classes.marginTop}
                      // >
                      //   <InputLabel id="demo-simple-select-label">
                      //     Select Trademark*
                      //   </InputLabel>
                      //   <Select
                      //     value={values.trademarkId || ""}
                      //     readOnly={!canEditTask()}
                      //     onChange={(e) => {
                      //       setFieldValue("trademarkId", e.target.value);
                      //     }}
                      //   >
                      //     {trademarks.map((trademark, index) => (
                      //       <MenuItem value={trademark.trademarkId} key={index}>
                      //         {trademark.trademarkName +
                      //           " (ID:" +
                      //           trademark.trademarkId +
                      //           ")"}
                      //       </MenuItem>
                      //     ))}
                      //   </Select>
                        
                      //   {/* <FormHelperText>
                      //     {touched.trademarkId && errors.trademarkId}
                      //   </FormHelperText> */}
                      // </FormControl>
                      <Autocomplete
                          value={values.trademarkId?values:null}
                          // disabled={!canEditTask()}
                          getOptionLabel={ options => (options&&options.trademarkId?options.trademarkName+" (ID:"+options.trademarkId+")":"") }
                          onChange={(event, newValue) => {
                            // let id = newValue.split("ID:")[1].split(")")[0]
                            // console.log(id)
                            // console.log(newValue)  
                            setFieldValue("trademarkId", newValue?newValue.trademarkId:"");
                            setFieldValue("trademarkName", newValue?newValue.trademarkName:"");
                          }}
                          options={trademarks}
                          fullWidth
                          className={classes.marginTop}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Trademark*"
                              error={Boolean(
                                    touched.trademarkId && errors.trademarkId
                                  )}
                                  helperText={
                                    touched.trademarkId &&
                                    errors.trademarkId
                                  }
                            />
                          )}
                        />
                    )}

                    <TextField
                      error={Boolean(touched.title && errors.title)}
                      helperText={touched.title && errors.title}
                      label="Title*"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      fullWidth
                      className={classes.marginTop}
                    />
                    <TextField
                      id="content"
                      label="Content"
                      name="content"
                      value={values.content}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                      className={classes.marginTop}
                    />
                    <input
                      className={classes.input}
                      id="contained-button-file"
                      multiple
                      type="file"
                      onChange={handleUploadFile}
                      onClick={(event) => {
                        event.target.value = null;
                      }}
                    />
                    <label htmlFor="contained-button-file">
                      {canEditTask() && (
                        <Button
                          variant="contained"
                          color="primary"
                          component="span"
                          endIcon={<InsertDriveFileIcon />}
                          className={classes.marginTop}
                        >
                          Upload File
                        </Button>
                      )}
                    </label>
                    <Grid container>
                      {canEditTask() && (
                        <Grid item xs={6}>
                          {isFilePicked ? (
                            <div className={classes.marginTop}>
                              <Typography variant="h5">File Upload</Typography>
                              {selectedFiles.map((file, index) => (
                                <p key={index}>
                                  <span style={{ fontWeight: "bold" }}>
                                    {index + 1}
                                  </span>
                                  . {file.name}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p style={{ marginTop: 8 }}>Please Select A File</p>
                          )}
                        </Grid>
                      )}
                    </Grid>
                    <Grid container spacing={2} alignItems="flex-end">
                      <Grid item xs={6}>
                        <FormControl
                          fullWidth
                          error={Boolean(touched.status && errors.status)}
                          className={classes.marginTop}
                        >
                          <InputLabel id="demo-simple-select-label">
                            Select Status*
                          </InputLabel>
                          <Select
                            value={values.status || ""}
                            onChange={(e) => {
                              setFieldValue("status", e.target.value);
                            }}
                          >
                            {TASK_STATUS.map((status, index) =>
                              canEditTask() || status.id != 1 ? (
                                <MenuItem value={status.id} key={index}>
                                  {status.name}
                                </MenuItem>
                              ) : (
                                <MenuItem
                                  value={status.id}
                                  onClickCapture={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => e.stopPropagation()}
                                  key={index}
                                >
                                  {status.name}
                                </MenuItem>
                              )
                            )}
                          </Select>
                          <FormHelperText>
                            {touched.status && errors.status}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl
                          fullWidth
                          error={Boolean(
                            touched.assigneeId && errors.assigneeId
                          )}
                          className={classes.marginTop}
                        >
                          <InputLabel id="demo-simple-select-label">
                            Select Assignee
                          </InputLabel>
                          <Select
                            defaultValue=""
                            value={values.assigneeId || ""}
                            readOnly={!canEditTask()}
                            onChange={(e) => {
                              setFieldValue("assigneeId", e.target.value);
                            }}
                          >
                            <MenuItem value={""}>None</MenuItem>
                            {assignees.map((assignee, index) => (
                              <MenuItem value={assignee.id} key={index}>
                                <Typography variant="h5">
                                  {assignee.name}
                                </Typography>
                                ({assignee.username})
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {touched.assigneeId && errors.assigneeId}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button color="primary" type="submit">
                      Add Task
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </fieldset>
        </Dialog>
        <ListTask ref={childRef} taskId={params.taskId} />
      </Container>
    </Box>
  );
};

export default ManageTasks;
