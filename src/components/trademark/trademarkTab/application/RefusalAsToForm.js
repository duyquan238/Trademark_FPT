import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSnackbar } from "notistack";

import {
  calDeadlineDate,
  dateFormat,
} from "../../../../commons/ultils/DateUltil";

import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import MomentUtils from "@date-io/moment";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "../../../DialogTitle";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CreateIcon from "@material-ui/icons/Create";
import moment from "moment";
import { calTrademarkStatus } from "../../../../commons/ultils/trademarkUtil";

//mockup Data Table
const columns = [
  { id: "number", label: "Refusal Number" },
  { id: "notiDate", label: "Notification Date" },
  { id: "deadline", label: "Deadline" },
  { id: "responseDate", label: "Response Date" },
  { id: "edit", label: "Edit" },
];

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    minWidth: 120,
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
  marginDivider: {
    marginTop: theme.spacing(3),
    marginBottom: 60,
  },
  tableContainer: {
    minHeight: 450,
  },
}));

//custom table styles
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#5664d2",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const RefusalAsToForm = (props) => {
  const classes = useStyles();
  const { formik } = props;
  const { enqueueSnackbar } = useSnackbar();

  //add notification
  const [isEdit, setIsEdit] = useState(false);
  const [itemUpdateIndex, setItemUpdateIndex] = useState();
  const [refusalNumber, setRefusalNumber] = useState("");
  const [notiDate, setNotiDate] = useState(null);
  const [responseDate, setResponseDate] = useState(null);

  //Hanlde Dialog
  const [addNotiDialogOpen, setNotiDialogOpen] = useState(false);
  
  //allow add noti 
  const canAddNoti = () => {
    return calTrademarkStatus(formik.values) !== 1
  }

  //allow add noti 
  const canInputAcceptance = () => {
    let allowEdit = [3, 4, 5, 6, 7, 8]
    return allowEdit.includes(calTrademarkStatus(formik.values));
  }

  const handleAddNotiDialogOpen = (data) => {
    setNotiDialogOpen(true);
    if (data) {
      setIsEdit(true);
      setRefusalNumber(data.refusalNumber);
      setNotiDate(data.notiDate);
      setResponseDate(data.responseDate);
    } else {
      setIsEdit(false);
      setRefusalNumber("");
      setNotiDate(null);
      setResponseDate(null);
    }
  };
  const handleAddNotiDialogClose = () => {
    setNotiDialogOpen(false);
  };

  const [viewNotiDialogOpen, setViewNotiDialogOpen] = useState(false);
  const handleViewNotiDialogOpen = () => {
    setViewNotiDialogOpen(true);
  };

  const handleViewNotiDialogClose = () => {
    setViewNotiDialogOpen(false);
  };

  const handleEditNoti = (notiIndex, refusalNumber) => {
    handleViewNotiDialogClose();
    handleAddNotiDialogOpen(
      formik.values.notifyRefusals.filter((item) => {
        return item.typeId === 1;
      })[notiIndex]
    );
    setItemUpdateIndex(
      formik.values.notifyRefusals.findIndex(
        (item) => item.refusalNumber === refusalNumber
      )
    );
  };
  const validationSchema = Yup.object().shape({
    refusalNumber: Yup.string().required("Refusal Number is required"),
    checkDuplicateRefusalNumber: Yup.boolean().test(
      "check-duplicated",
      "Refusal Number is duplicated",
      function () {
        let isUnique = true;
        const { refusalNumber } = this.parent;
        formik.values.notifyRefusals.forEach((item, index) => {
          if (
            item.refusalNumber === refusalNumber &&
            itemUpdateIndex !== index
          ) {
            isUnique = false;
          }
        });
        return isUnique;
      }
    ),
    notiDate: Yup.date().nullable().required("Notification Date is required"),
  });

  return (
    <Card elevation={5}>
      <CardHeader
        title="Refsual as to form"
        titleTypographyProps={{ variant: "h4" }}
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6} lg={6}>
            <Button
              disabled={!props.canEdit || !canAddNoti()}
              variant="contained"
              color="primary"
              onClick={() => handleAddNotiDialogOpen(null)}
            >
              Add Notification
            </Button>
            <Dialog
              open={addNotiDialogOpen}
              onClose={handleAddNotiDialogClose}
              aria-labelledby="form-dialog-title"
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle onClose={handleAddNotiDialogClose}>
                Notification of Refusal as to form
              </DialogTitle>
              <Formik
                initialValues={{
                  id: null,
                  refId: formik.values.id,
                  typeId: 1,
                  refusalNumber: refusalNumber,
                  notiDate: notiDate,
                  deadline: null,
                  responseDate: responseDate,
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  if (isEdit) {
                    formik.setFieldValue(
                      `notifyRefusals[${itemUpdateIndex}].refusalNumber`,
                      values.refusalNumber
                    );
                    formik.setFieldValue(
                      `notifyRefusals[${itemUpdateIndex}].notiDate`,
                      values.notiDate
                    );
                    formik.setFieldValue(
                      `notifyRefusals[${itemUpdateIndex}].deadline`,
                      calDeadlineDate(
                        moment(values.notiDate, "YYYY-MM-DD"),
                        2
                      ).format("YYYY-MM-DD")
                    );
                    formik.setFieldValue(
                      `notifyRefusals[${itemUpdateIndex}].responseDate`,
                      values.responseDate
                    );
                  } else {
                    const data = {
                      id: null,
                      refId: formik.values.id,
                      typeId: 1,
                      refusalNumber: values.refusalNumber,
                      notiDate: values.notiDate,
                      deadline: calDeadlineDate(values.notiDate, 2).format(
                        "YYYY-MM-DD"
                      ),
                      responseDate: values.responseDate,
                    };
                    formik.values.notifyRefusals.push(data);
                  }
                  setNotiDialogOpen(false);
                  enqueueSnackbar("Add Notification Success!", {
                    variant: "success",
                  });
                }}
              >
                {({ handleChange, setFieldValue, values, errors, touched }) => (
                  <Form>
                    <DialogContent dividers>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            error={Boolean(
                              errors.refusalNumber ||
                                errors.checkDuplicateRefusalNumber
                            )}
                            helperText={
                              errors.refusalNumber ||
                              errors.checkDuplicateRefusalNumber
                            }
                            label="Refusal Number*"
                            name="refusalNumber"
                            value={values.refusalNumber}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                              error={Boolean(
                                touched.notiDate && errors.notiDate
                              )}
                              helperText={touched.notiDate && errors.notiDate}
                              fullWidth
                              disableToolbar
                              variant="inline"
                              format="DD/MM/YYYY"
                              label="Notification Date*"
                              value={values.notiDate}
                              onChange={(value) => {
                                setFieldValue("notiDate", value);
                              }}
                              KeyboardButtonProps={{
                                "aria-label": "change date",
                              }}
                              className={classes.marginTop}
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={6}>
                          <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                              fullWidth
                              disableToolbar
                              variant="inline"
                              format="DD/MM/YYYY"
                              label="Date of Response"
                              value={values.responseDate}
                              onChange={(value) => {
                                setFieldValue("responseDate", value);
                              }}
                              KeyboardButtonProps={{
                                "aria-label": "change date",
                              }}
                              className={classes.marginTop}
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button color="primary" type="submit">
                        Save Changed
                      </Button>
                      <Button
                        onClick={handleAddNotiDialogClose}
                        color="default"
                      >
                        Close
                      </Button>
                    </DialogActions>
                  </Form>
                )}
              </Formik>
            </Dialog>
          </Grid>
          <Grid item xs={6} lg={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleViewNotiDialogOpen}
            >
              View Notification
            </Button>
            <Dialog
              open={viewNotiDialogOpen}
              onClose={handleViewNotiDialogClose}
              aria-labelledby="form-dialog-title"
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle onClose={handleViewNotiDialogClose}>
                List of Notifications
              </DialogTitle>
              <DialogContent dividers>
                <TableContainer className={classes.tableContainer}>
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <StyledTableCell key={column.id}>
                            {column.label}
                          </StyledTableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formik.values.notifyRefusals
                        .filter((item) => {
                          return item.typeId === 1;
                        })
                        .map((item, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>
                              {item.refusalNumber}
                            </StyledTableCell>
                            <StyledTableCell>
                              {dateFormat(
                                item.notiDate,
                                "YYYY-MM-DD",
                                "DD-MM-YYYY"
                              )}
                            </StyledTableCell>
                            <StyledTableCell>
                              {dateFormat(
                                item.deadline,
                                "YYYY-MM-DD",
                                "DD-MM-YYYY"
                              )}
                            </StyledTableCell>
                            <StyledTableCell>
                              {dateFormat(
                                item.responseDate,
                                "YYYY-MM-DD",
                                "DD-MM-YYYY"
                              )}
                            </StyledTableCell>
                            <StyledTableCell>
                              <Button
                                disabled={!props.canEdit}
                                variant="contained"
                                color="primary"
                                endIcon={<CreateIcon />}
                                onClick={() => {
                                  handleEditNoti(index, item.refusalNumber);
                                }}
                              >
                                Edit
                              </Button>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleViewNotiDialogClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
        <Divider className={classes.marginDivider} />
        <Grid container spacing={2}>
          <Grid
            item
            xs={6}
            lg={6}
            key={
              formik.values.application.acceptanceNumber + "acceptanceNumber"
            }
          >
            <TextField
              error={Boolean(
                formik.touched.application &&
                  formik.touched.application.acceptanceNumber &&
                  formik.errors.application &&
                  formik.errors.application.acceptanceNumber
              )}
              helperText={
                formik.touched.application &&
                formik.touched.application.acceptanceNumber &&
                formik.errors.application &&
                formik.errors.application.acceptanceNumber
              }
              label="Acceptance Number"
              name="application.acceptanceNumber"
              defaultValue={formik.values.application.acceptanceNumber}
              // inputProps = {{readOnly: !canInputAcceptance()}}
              disabled = {!canInputAcceptance()}
              onBlur={formik.handleChange}
              className={classes.marginTop}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} lg={6}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                fullWidth
                disableToolbar
                readOnly={!props.canEdit || !canInputAcceptance()}
                // inputProps = {{readOnly: !canInputAcceptance()}}
                disabled = {!canInputAcceptance()}
                variant="inline"
                format="DD/MM/YYYY"
                label="Date of Acceptance"
                minDate={new Date(formik.values.application.fillingDate)}
                maxDate={new Date()}
                value={formik.values.application.acceptanceDate}
                onChange={(value) => {
                  formik.setFieldValue("application.acceptanceDate", value);
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                className={classes.marginTop}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RefusalAsToForm;
