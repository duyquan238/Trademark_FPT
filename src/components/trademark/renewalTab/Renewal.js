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
  getRenewals,
  clearErrors,
} from "../../../redux/actions/trademarkAction";
import { dateFormat, addYears } from "../../../commons/ultils/DateUltil";
import moment from "moment";

import AddRenewal from "./AddRenewal";

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

const Renewal = (props) => {
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
  const trademarkId = props.trademark.id;

  //call API to create Renewal
  const createRenewal = async (renewalData) => {
    try {
      const response = await axiosConfig.post("/renewal", renewalData);
      if (response.data.status.code === "200") {
        enqueueSnackbar("Create Renewal Successfully", { variant: "success" });
        setReload(true);
      } else {
        enqueueSnackbar("Cannot Save Renewal", { variant: "error" });
      }
    } catch (e) {
      console.log(e);
    }
  };

  //call API to update Renewal
  const updateRenewal = async (renewalData) => {
    try {
      const response = await axiosConfig.put("/renewal", renewalData);
      if (response.data.status.code === "200") {
        enqueueSnackbar("Update Renewal Successfully", { variant: "success" });
        setReload(true);
      } else {
        enqueueSnackbar("Cannot Save Renewal", { variant: "error" });
      }
    } catch (e) {
      console.log(e);
    }
  };
  //call API to delete Renewal
  const deleteRenewal = async (id) => {
    try {
      const response = await axiosConfig.delete(`/renewal/${id}`);
      if (response.data.status.code === "200") {
        enqueueSnackbar("Delete Renewal Successfully", { variant: "success" });
        setReload(true);
      } else {
        enqueueSnackbar("Cannot Delete Renewal", { variant: "error" });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const INIT_RENEWAL_VALUES = {
    id: null,
    trademarkId: trademarkId,
    times: null,
    number: "",
    date: null,
    notifyRefusals: [],
    decisionNumber: "",
    decisionDate: null,
    nextRenewal: null,
    takeNotes: "",
    isDeleted: false,
  };
  const validationSchema = Yup.object().shape({
    number: Yup.string().required("Renewal Number is required"),
    date: Yup.date().nullable().required("Renewal Date is required"),
  });

  //define formik
  const formik = useFormik({
    initialValues: INIT_RENEWAL_VALUES,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (values.id) {
        updateRenewal(values);
        setOpen(false);
        setReload(false);
        resetForm();
      } else {
        createRenewal(values);
        setOpen(false);
        setReload(false);
        resetForm();
      }
    },
  });

  const { user } = useSelector((state) => state.auth);
  const { renewals, loading, error } = useSelector((state) => state.renewals);
  const { trademark } = useSelector((state) => state.trademark);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    // dispatch list data
    dispatch(getRenewals({ trademarkId }));
    if (error) {
      dispatch(clearErrors());
    }
    setCanEdit(calEditable(trademark));
  }, [dispatch, error, reload, trademarkId]);

  const columns = [
    {
      name: "id",
      label: "Renewal ID",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "times",
      label: "Times",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "number",
      label: "Request Number",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "date",
      label: "Request Date",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "decisionNumber",
      label: "Decision of Renewal Number",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "decisionDate",
      label: "Decision of Renewal Date",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];

  const calEditable = (data) => {
    if (data.processedBy && user.id !== data.processedBy) {
      return false;
    }

    return true;
  };

  const calTimesAndDate = () => {
    let times = 0;
    let nextRenewal = null;
    renewals.forEach((element) => {
      if (element.times > times) times = element.times;
    });
    let fillingDate = moment(
      props.trademark.application.fillingDate,
      "YYYY-MM-DD"
    );
    nextRenewal = addYears(fillingDate, 10 * (times + 2));
    return { times: times + 1, nextRenewal: nextRenewal };
  };
  const toDataList = (renewal, index) => {
    return [
      renewal.id,
      renewal.times,
      renewal.number,
      dateFormat(renewal.date, "YYYY-MM-DD", "DD-MM-YYYY"),
      renewal.decisionNumber,
      dateFormat(renewal.decisionDate, "YYYY-MM-DD", "DD-MM-YYYY"),
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
      if (renewals.length !== 0) {
        handleClickOpen(renewals[rowMeta.rowIndex]);
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
      formik.setValues(INIT_RENEWAL_VALUES);
    }
  };
  const handleDeleteRenewal = () => {
    deleteRenewal(formik.values.id);
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
            Add Renewal
          </Button>
        )}
      </Box>
      {!!renewals && (
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
                  {formik.values.id ? "Renewal" : "Add New Renewal"}
                </Typography>
                {/* {formik.values.id && (
                  <>
                    <Button
                      autoFocus
                      color="inherit"
                      onClick={() => setOpenDelete(true)}
                      className = {canEdit?"":classes.hide}
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
                          Are you sure you want to delete this renewal?
                        </Typography>
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          This renewal will be deleted immediately. You can't
                          undo this action.
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={handleDialogDeleteClose}
                          color="primary"
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleDeleteRenewal} color="secondary">
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
            <AddRenewal
              formik={formik}
              trademarkId={trademarkId}
              timesAndDate={calTimesAndDate()}
              canEdit={calEditable(trademark)}
            />
          </form>
        </Dialog>
      )}
      <MuiThemeProvider theme={getMuiTheme}>
        <MUIDataTable
          title={
            <Typography variant="h6">
              Renewal List
              {loading && (
                <CircularProgress
                  size={24}
                  style={{ marginLeft: 15, position: "relative", top: 4 }}
                />
              )}
            </Typography>
          }
          data={renewals ? renewals.map(toDataList) : []}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
    </Container>
  );
};

export default Renewal;
