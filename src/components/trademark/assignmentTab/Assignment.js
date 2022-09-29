import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import axiosConfig from "../../../commons/Apis/axiosConfig";

import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

import Dialog from "@material-ui/core/Dialog";

import AddAssignment from "./AddAssignment";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import {
  getAssignments,
  clearErrors,
} from "../../../redux/actions/trademarkAction";
import { dateFormat } from "../../../commons/ultils/DateUltil";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  styleBtn: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
}));

const getMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MUIDataTable: {
        root: {
          backgroundColor: "#FF000",
        },
        paper: {},
        liveAnnounce: {
          position: "relative",
        },
      },
      MUIDataTableBodyCell: {
        root: {},
      },
    },
  });

const Assignment = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [reload, setReload] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const handleDialogDeleteClose = () => {
    setOpenDelete(false);
  };
  const trademark = props.trademark;
  const trademarkId = trademark.id;

  //call API to create Assignment
  const createAssignment = async (assignmentData) => {
    try {
      const response = await axiosConfig.post("/assignment", assignmentData);
      if (response.data.status.code === "200") {
        enqueueSnackbar("Create Assignment Successfully", {
          variant: "success",
        });
        setReload(true);
      } else {
        enqueueSnackbar("Cannot Save Assignment", { variant: "error" });
      }
    } catch (e) {
      console.log(e);
    }
  };

  //call API to Update Assignment
  const updateAssignment = async (assignmentData) => {
    try {
      const response = await axiosConfig.put("/assignment", assignmentData);
      if (response.data.status.code === "200") {
        enqueueSnackbar("Update Assignment Successfully", {
          variant: "success",
        });
        setReload(true);
      } else {
        enqueueSnackbar("Cannot Save Assignment", { variant: "error" });
      }
    } catch (e) {
      console.log(e);
    }
  };
  //call API to delete Assignment
  const deleteAssignment = async (id) => {
    try {
      const response = await axiosConfig.delete(`/assignment/${id}`);
      if (response.data.status.code === "200") {
        enqueueSnackbar("Delete Assignment Successfully", {
          variant: "success",
        });
        setReload(true);
      } else {
        enqueueSnackbar("Cannot Delete Assignment", { variant: "error" });
      }
    } catch (e) {
      console.log(e);
    }
  };

  //custom data
  const normalizeDataToFormik = (assignment) => {
    let temp = assignment ? JSON.parse(JSON.stringify(assignment)) : assignment;
    if (temp) {
      temp.assignorInfo = JSON.parse(temp.assignorInfo);
      temp.assigneesInfo = JSON.parse(temp.assigneesInfo);
    }
    return temp;
  };

  const normalizeDataToSubmit = (assignment) => {
    let temp = assignment ? JSON.parse(JSON.stringify(assignment)) : assignment;
    if (temp) {
      temp.assignorInfo = JSON.stringify(temp.assignorInfo);
      temp.assigneesInfo = JSON.stringify(temp.assigneesInfo);
    }
    return temp;
  };

  const INIT_ASSIGNMENT_VALUES = {
    id: null,
    trademarkId: trademark.id,
    assignorInfo: trademark.applicant,
    assigneesInfo: [],
    notifyRefusals: [],
    requestNumber: "",
    requestDate: null,
    decisionNumber: "",
    decisionDate: null,
    takeNotes: "",
  };
  const validationSchema = Yup.object().shape({
    requestNumber: Yup.string().required("Request Number is required"),
    requestDate: Yup.date().nullable().required("Request Date is required"),
    assigneesInfo: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Name is required"),
          address: Yup.string().required("Address is required"),
          country: Yup.string().nullable().required("Country is required"),
        })
      )
      .min(1, "Must have at least one assignee"),
  });

  //define formik
  const formik = useFormik({
    initialValues: INIT_ASSIGNMENT_VALUES,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      values = normalizeDataToSubmit(values);
      if (values.id) {
        updateAssignment(values);
        setOpen(false);
        setReload(false);
        resetForm();
      } else {
        createAssignment(values);
        setOpen(false);
        setOpen(false);
        resetForm();
      }
    },
  });

  const { assignments, loading, error } = useSelector(
    (state) => state.assignments
  );
  const { user } = useSelector((state) => state.auth);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    // dispatch list data
    dispatch(getAssignments({ trademarkId }));
    if (error) {
      dispatch(clearErrors());
    }
    setCanEdit(calEditable(trademark));
  }, [dispatch, error, trademarkId, reload]);

  const calEditable = (data) => {
    if (data.processedBy && user.id !== data.processedBy) {
      return false;
    }

    return true;
  };

  const columns = [
    {
      name: "id",
      label: "Assignment ID",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "requestNumber",
      label: "Request Number",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "requestDate",
      label: "Request Date",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "decisionNumber",
      label: "Decision of Assignment Number",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "decisionDate",
      label: "Decision of Assignment Date",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];

  const toDataList = (assignment, index) => {
    return [
      assignment.id,
      assignment.requestNumber,
      dateFormat(assignment.requestDate, "YYYY-MM-DD", "DD-MM-YYYY"),
      assignment.decisionNumber,
      dateFormat(assignment.decisionDate, "YYYY-MM-DD", "DD-MM-YYYY"),
    ];
  };

  const options = {
    textLabels: {
      body: {
        noMatch:
          !user.name || loading ? "Loading..." : "Sorry, no records were found",
        toolTip: "Sort",
        columnHeaderTooltip: (column) => `Sort for ${column.label}`,
      },
    },
    filter: false,
    print: false,
    search: false,
    download: false,
    serverSide: true,
    pagination: false,
    count: null,
    onCellClick: (rowData, rowMeta) => {
      if (assignments.length !== 0) {
        handleClickOpen(normalizeDataToFormik(assignments[rowMeta.rowIndex]));
      }
    },

    selectableRows: "none",
    selectableRowsOnClick: true,
    responsive: "standard",
    viewColumns: false,
    customToolbar: null,
  };

  const handleClickOpen = (data) => {
    setOpen(true);
    handleDialogDeleteClose();
    if (data) {
      formik.setValues(data);
    } else {
      formik.setValues(INIT_ASSIGNMENT_VALUES);
    }
  };
  const handleDeleteAssignment = () => {
    deleteAssignment(formik.values.id);
    setOpen(false);
    setReload(false);
  };

  return (
    <Container maxWidth={false}>
      <Box className={classes.styleBtn}>
        {canEdit && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleClickOpen(null)}
            endIcon={<PlaylistAddIcon />}
          >
            Add Assignment
          </Button>
        )}
      </Box>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <form onSubmit={formik.handleSubmit}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h4" className={classes.title}>
                {formik.values.id ? "Assignment" : "Add New Assignment"}
              </Typography>
              {/* {formik.values.id && (
                <>
                  <Button
                    autoFocus
                    color="inherit"
                    className = {canEdit?"":classes.hide}
                    onClick={() => setOpenDelete(true)}
                  >
                    Delete
                  </Button>
                  <Dialog
                    open={openDelete}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleDialogDeleteClose}
                  >
                    <DialogTitle disableTypography={true}>
                      <Typography variant="h4">
                        Are you sure you want to delete this assignment?
                      </Typography>
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        This assignment will be deleted immediately. You can't
                        undo this action.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleDialogDeleteClose} color="primary">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDeleteAssignment}
                        color="secondary"
                      >
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              )} */}
              <Button
                autoFocus
                color="inherit"
                onClick={(e) => {
                  handleClose();
                  props.callbackOpenExport();
                }}
              >
                Export
              </Button>
              <Button
                autoFocus
                color="inherit"
                type="submit"
                className={canEdit ? "" : classes.hide}
              >
                Save
              </Button>
            </Toolbar>
          </AppBar>
          <AddAssignment
            formik={formik}
            trademark={trademark}
            canEdit={calEditable(trademark)}
          />
        </form>
      </Dialog>
      <MuiThemeProvider theme={getMuiTheme}>
        <MUIDataTable
          title={
            <Typography variant="h6">
              Assignment List
              {loading && (
                <CircularProgress
                  size={24}
                  style={{ marginLeft: 15, position: "relative", top: 4 }}
                />
              )}
            </Typography>
          }
          data={assignments ? assignments.map(toDataList) : []}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
    </Container>
  );
};

export default Assignment;
