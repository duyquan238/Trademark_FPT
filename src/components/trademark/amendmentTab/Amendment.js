import React, { useState, useEffect } from "react";
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

import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import {
  getAmendments,
  clearErrors,
} from "../../../redux/actions/trademarkAction";
import { dateFormat } from "../../../commons/ultils/DateUltil";
import AddAmendment from "./AddAmendment";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

const Amendment = (props) => {
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
  const trademarkId = props.trademark.id;

  //call API to create Amendment
  const createAmendment = async (amendmentData) => {
    try {
      const response = await axiosConfig.post("/amendment", amendmentData);
      if (response.data.status.code === "200") {
        enqueueSnackbar("Create Amendment Successfully", {
          variant: "success",
        });
        setReload(true);
      } else {
        enqueueSnackbar("Cannot Save Amendment", { variant: "error" });
      }
    } catch (e) {
      console.log(e);
    }
  };

  //call API to Update Amendment
  const updateAmendment = async (amendmentData) => {
    try {
      const response = await axiosConfig.put("/amendment", amendmentData);
      if (response.data.status.code === "200") {
        enqueueSnackbar("Update Amendment Successfully", {
          variant: "success",
        });
        setReload(true);
      } else {
        enqueueSnackbar("Cannot Save Amendment", { variant: "error" });
      }
    } catch (e) {
      console.log(e);
    }
  };

  //call API to delete Amendment
  const deleteAmendment = async (id) => {
    try {
      const response = await axiosConfig.delete(`/amendment/${id}`);
      if (response.data.status.code === "200") {
        enqueueSnackbar("Delete Amendment Successfully", {
          variant: "success",
        });
        setReload(true);
      } else {
        enqueueSnackbar("Cannot Delete Amendment", { variant: "error" });
      }
    } catch (e) {
      console.log(e);
    }
  };

  //custom data
  const normalizeDataToFormik = (amendment) => {
    let temp = amendment ? JSON.parse(JSON.stringify(amendment)) : amendment;
    if (temp) {
      temp.currentsInfo = JSON.parse(temp.currentsInfo);
      temp.newsInfo = JSON.parse(temp.newsInfo);
    }
    return temp;
  };

  const normalizeDataToSubmit = (amendment) => {
    let temp = amendment ? JSON.parse(JSON.stringify(amendment)) : amendment;
    if (temp) {
      temp.currentsInfo = JSON.stringify(temp.currentsInfo);
      temp.newsInfo = JSON.stringify(temp.newsInfo);
    }
    return temp;
  };

  const INIT_AMENDMENT_VALUES = {
    id: null,
    trademarkId: trademark.id,
    currentsInfo: trademark.applicant,
    newsInfo: trademark.applicant,
    requestNumber: "",
    requestDate: null,
    decisionNumber: "",
    dateAmendment: null,
    notifyRefusals: [],
    takeNotes: "",
  };
  const validationSchema = Yup.object().shape({
    requestNumber: Yup.string().required("Request Number is required"),
    requestDate: Yup.date().nullable().required("Request Date is required"),
  });

  //define formik
  const formik = useFormik({
    initialValues: INIT_AMENDMENT_VALUES,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      values = normalizeDataToSubmit(values);
      if (values.id) {
        updateAmendment(values);
        setReload(false);
        setOpen(false);
        resetForm();
      } else {
        createAmendment(values);
        setOpen(false);
        resetForm();
      }
    },
  });
  const { amendments, loading, error } = useSelector(
    (state) => state.amendments
  );
  const { user } = useSelector((state) => state.auth);
  // const {trademark} = useSelector((state) => state.trademark )
  const [canEdit, setCanEdit] = useState(false);
  useEffect(() => {
    // dispatch list data
    dispatch(getAmendments({ trademarkId }));
    if (error) {
      enqueueSnackbar("Cannot Get Amendment", { variant: "error" });
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
      label: "Amendment ID",
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
      label: "Decision of Amendment Number",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "decisionDate",
      label: "Decision of Amendment Date",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];

  const toDataList = (amendment, index) => {
    return [
      amendment.id,
      amendment.requestNumber,
      dateFormat(amendment.requestDate, "YYYY-MM-DD", "DD-MM-YYYY"),
      amendment.decisionNumber,
      dateFormat(amendment.dateAmendment, "YYYY-MM-DD", "DD-MM-YYYY"),
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
      if (amendments.length !== 0) {
        handleClickOpen(amendments[rowMeta.rowIndex]);
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
      formik.setValues(normalizeDataToFormik(data));
    } else {
      formik.setValues(INIT_AMENDMENT_VALUES);
    }
  };
  const handleDeleteAmendment = () => {
    deleteAmendment(formik.values.id);
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
            Add Amendment
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
                {formik.values.id ? "Amendment" : "Add New Amendment"}
              </Typography>
              {/* {formik.values.id && (
                <>
                  <Button
                    autoFocus
                    className = {canEdit?"":classes.hide}
                    color="inherit"
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
                        Are you sure you want to delete this amendment?
                      </Typography>
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        This amendment will be deleted immediately. You can't
                        undo this action.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleDialogDeleteClose} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={handleDeleteAmendment} color="secondary">
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
          <AddAmendment
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
              Amendment List
              {loading && (
                <CircularProgress
                  size={24}
                  style={{ marginLeft: 15, position: "relative", top: 4 }}
                />
              )}
            </Typography>
          }
          data={amendments ? amendments.map(toDataList) : []}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
    </Container>
  );
};

export default Amendment;
