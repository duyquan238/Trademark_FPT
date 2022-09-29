import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik, Form, getIn } from "formik";
import { useSnackbar } from "notistack";
import axiosConfig from "../commons/Apis/axiosConfig";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { useHistory, useParams } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "../components/DialogTitle";
import Slide from "@material-ui/core/Slide";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";

import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import MetaData from "../components/MetaData";
import Tooltip from "@material-ui/core/Tooltip";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import UndoIcon from "@material-ui/icons/Undo";

import {
  TASK_PRIORITY,
  TASK_STATUS,
  CATEGORIES,
} from "../commons/constants/taskContants";

import { INIT_TASK_DATA } from "../commons/constants/taskContants";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  marginRight: {
    marginRight: 10,
    paddingTop: 2,
  },
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
  hide: {
    display: "none",
  },
}));

const TaskDetail = () => {
  const { user } = useSelector((state) => state.auth);
  const { taskId } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const formikRef = React.createRef();
  //   const childRef = useRef();
  const { enqueueSnackbar } = useSnackbar();
  //   const [taskId, setTaskId] = useState();
  const [trademarks, setTrademarks] = useState([]);
  const [assignees, setAssignees] = useState([]);
  // const [allUsers, setAllUsers] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [isShowSelectTrademark, setIsShowSelectTrademark] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [indexFileDelete, setIndexFileDelete] = useState();
  const [fileNames, setFileNames] = useState([]);
  const [isFilePicked, setIsFilePicked] = useState(false);

  const canEditTask = () => {
    let acceptRole = [1, 2];
    if (user.roleId) {
      return acceptRole.includes(user.roleId);
    }
    return false;
  };

  const canDeleteTask = () => {
    let acceptRole = [1, 2];
    if (user.roleId) {
      return acceptRole.includes(user.roleId);
    }
    return false;
  };

  useEffect(() => {
    if (taskId) {
      // loadAssignees();
      fetchTask(taskId);
    }
  }, [taskId]);

  const fetchTask = async (id) => {
    try {
      const response = await axiosConfig.get(`/task/${id}`);
      if (response.data.status.code === "200") {
        formikRef.current.setValues(response.data.data);
        if (response.data.data.categoryId == 2) {
          loadTrademarks();
          setIsShowSelectTrademark(true);
        } else {
          setIsShowSelectTrademark(false);
        }
        if (response.data.data.fileName.length > 0) {
          setFileNames(JSON.parse(JSON.stringify(response.data.data.fileName)));
        } else {
          setFileNames([]);
        }
        loadAssignees();
      } else if (response.data.status.code === "500") {
        enqueueSnackbar(response.data.data, { variant: "error" });
      } else {
        history.push("/manage-tasks");
        enqueueSnackbar("Cannot Load Task", { variant: "error" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadFile = (e) => {
    setIsFilePicked(true);
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  //define style when click delete file
  const deleteStyle = {
    color: "red",
    textDecoration: "line-through",
  };

  //handle add Task
  const handleTask = (values) => {
    const formData = new FormData();
    values.fileName = fileNames;
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.set("data", JSON.stringify(values));
    updateTask(formData);
  };

  const handleDialogDeleteClose = () => {
    setOpenDelete(false);
  };
  const handleDeleteTask = () => {
    deleteTask();
    setOpenDelete(false);
  };

  // delete File
  const deleteFile = (index) => {
    setIndexFileDelete(index);
    fileNames[index].isDeleted = true;
  };

  //undo delete File
  const undoDeleteFile = (index) => {
    setIndexFileDelete(index + 10);
    fileNames[index].isDeleted = false;
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

  const updateTask = async (taskData) => {
    try {
      const response = await axiosConfig.put("/task/update", taskData);
      if (response.data.status.code === "200") {
        formikRef.current.resetForm();
        history.push("/manage-tasks");
        enqueueSnackbar("Update Task Successfully", { variant: "success" });
      } else if (response.data.status.code === "500") {
        enqueueSnackbar(response.data.data, { variant: "error" });
      } else {
        enqueueSnackbar("Cannot Update Task", { variant: "error" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  //Call API to delete Task
  const deleteTask = async () => {
    try {
      const response = await axiosConfig.delete(`/task/delete/${taskId}`);
      if (response.data.status.code === "200") {
        enqueueSnackbar("Delete Task Successfully", { variant: "success" });
        history.push("/manage-tasks");
      } else if (response.data.status.code === "500") {
        enqueueSnackbar(response.data.data, { variant: "error" });
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
    title: Yup.string().required("Title is required"),
    deadline: Yup.date("Invalid Date").nullable(),
  });

  return (
    <Box style={{ paddingTop: 24 }}>
      <MetaData title={"Task Detail"} />

      <Container maxWidth={"md"}>
        <Card>
          <CardHeader
            title="Detail Task"
            titleTypographyProps={{ variant: "h4" }}
          />
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
                <fieldset
                  disabled={!canEditTask()}
                  className={classes.noBorder}
                >
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
                            Category
                          </InputLabel>
                          <Select
                            value={values.categoryId || ""}
                            readOnly={!canEditTask() || values.categoryId == 3}
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
                                (values.categoryId == 3 ||
                                  category.id != 3) && (
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
                            Priority
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
                      //     Select Trademark
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
                      //         {trademark.trademarkName +" (ID:"+trademark.trademarkId+")"}
                      //       </MenuItem>
                      //     ))}
                      //   </Select>
                        
                      //   <FormHelperText>
                      //     {touched.trademarkId && errors.trademarkId}
                      //   </FormHelperText>
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
                      label="Title"
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
                      <Grid item xs={6}>
                        {fileNames.length > 0 && (
                          <div className={classes.marginTop}>
                            <Typography variant="h5">File Download</Typography>
                            {fileNames.map((item, index) => (
                              <p key={index}>
                                <span style={{ fontWeight: "bold" }}>
                                  {index + 1}
                                </span>
                                .{" "}
                                <a
                                  href={
                                    process.env.REACT_APP_API_ENDPOINT +
                                    `/file/task/${item.name}`
                                  }
                                  key={index}
                                  style={item.isDeleted ? deleteStyle : {}}
                                >
                                  Download {item.name}
                                </a>
                                {canEditTask() &&
                                  (item.isDeleted ? (
                                    <Tooltip title="Undo">
                                      <IconButton
                                        aria-label="delete"
                                        className={classes.margin}
                                        size="small"
                                        onClick={(e) => undoDeleteFile(index)}
                                      >
                                        <UndoIcon
                                          fontSize="inherit"
                                          color="primary"
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title="Delete">
                                      <IconButton
                                        aria-label="delete"
                                        className={classes.margin}
                                        size="small"
                                        onClick={(e) => deleteFile(index)}
                                      >
                                        <ClearIcon
                                          fontSize="inherit"
                                          color="secondary"
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  ))}
                              </p>
                            ))}
                          </div>
                        )}
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} alignItems="flex-end">
                      <Grid item xs={6}>
                        <FormControl
                          fullWidth
                          error={Boolean(touched.status && errors.status)}
                          className={classes.marginTop}
                        >
                          <InputLabel id="demo-simple-select-label">
                            Select Status
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
                            {assignees.map((user, index) => (
                              <MenuItem value={user.id} key={index}>
                                <Typography variant="h5">
                                  {user.name}
                                </Typography>
                                ({user.username})
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
                </fieldset>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={!canDeleteTask() ? classes.hide : ""}
                    onClick={() => setOpenDelete(true)}
                  >
                    Delete Task
                  </Button>
                  <Dialog
                    open={openDelete}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleDialogDeleteClose}
                  >
                    <DialogTitle disableTypography={true}>
                      Are you sure you want to delete this task?
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        This task will be deleted immediately. You can't undo
                        this action.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleDialogDeleteClose} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={handleDeleteTask} color="secondary">
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <Button variant="contained" color="primary" type="submit">
                    Confirm
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Card>
      </Container>
    </Box>
  );
};

export default TaskDetail;
