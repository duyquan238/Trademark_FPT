import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSnackbar } from "notistack";

import { calDeadlineDate, dateFormat } from "../../../commons/ultils/DateUltil";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";

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
import DialogTitle from "../../DialogTitle";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CreateIcon from "@material-ui/icons/Create";
import moment from "moment";

//custom table
const columns = [
  { id: "number", label: "Refusal Number" },
  { id: "notiDate", label: "Notification Date" },
  { id: "deadline", label: "Deadline" },
  { id: "responseDate", label: "Response Date" },
  { id: "edit", label: "Edit" },
];

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

const useStyles = makeStyles((theme) => ({
  marginTop: {
    marginTop: theme.spacing(1),
  },
  dividerStyle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  marginNotes: {
    marginTop: 15,
  },
  container: {
    paddingTop: theme.spacing(3),
  },
  tableContainer: {
    minHeight: 450,
  },
  noBorder: {
    border: 0,
  },
}));

const AddRenewal = (props) => {
  const classes = useStyles();
  const { formik, trademarkId } = props;
  const { enqueueSnackbar } = useSnackbar();

  //add notification
  const [isEdit, setIsEdit] = useState(false);
  const [itemUpdateIndex, setItemUpdateIndex] = useState();
  const [refusalNumber, setRefusalNumber] = useState("");
  const [notiDate, setNotiDate] = useState(null);
  const [responseDate, setResponseDate] = useState(null);

  useEffect(() => {
    if (formik.values.times === null) {
      formik.setFieldValue("times", props.timesAndDate.times);
      formik.setFieldValue("nextRenewal", props.timesAndDate.nextRenewal);
    }
  }, []);

  //Handle Open Dialog
  const [addNotiDialogOpen, setNotiDialogOpen] = useState(false);
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
    handleAddNotiDialogOpen(formik.values.notifyRefusals[notiIndex]);
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
          if (isEdit) {
            if (
              item.refusalNumber === refusalNumber &&
              itemUpdateIndex !== index
            ) {
              isUnique = false;
            }
          } else {
            if (item.refusalNumber === refusalNumber) {
              isUnique = false;
            }
          }
        });
        return isUnique;
      }
    ),
    notiDate: Yup.date().nullable().required("Notification Date is required"),
  });

  return (
    <Container maxWidth={false} className={classes.container}>
      <fieldset disabled={!props.canEdit} className={classes.noBorder}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardHeader
                title="Renewal"
                titleTypographyProps={{ variant: "h4" }}
              />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4} lg={6} xl={4}>
                    <TextField
                      label="Renewal Times"
                      aria-readonly={true}
                      name="times"
                      value={formik.values.times || ""}
                      fullWidth
                      className={classes.marginTop}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={6} xl={4}>
                    <TextField
                      error={Boolean(
                        formik.touched.number && formik.errors.number
                      )}
                      helperText={formik.touched.number && formik.errors.number}
                      label="Renewal Number*"
                      name="number"
                      onBlur={formik.handleChange}
                      defaultValue={formik.values.number || ""}
                      fullWidth
                      className={classes.marginTop}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={6} xl={4}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <KeyboardDatePicker
                        error={Boolean(
                          formik.touched.date && formik.errors.date
                        )}
                        helperText={formik.touched.date && formik.errors.date}
                        fullWidth
                        disableToolbar
                        readOnly={!props.canEdit}
                        variant="inline"
                        format="DD/MM/YYYY"
                        label="Renewal Date*"
                        value={formik.values.date}
                        onChange={(value) =>
                          formik.setFieldValue("date", value)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        className={classes.marginTop}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
                <Divider className={classes.dividerStyle} />
                <Card>
                  <CardHeader title="Notification of Refusal" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item lg={6}>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={!props.canEdit}
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
                              refId: trademarkId,
                              typeId: 5,
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
                                enqueueSnackbar(
                                  "Update Notification Success!",
                                  {
                                    variant: "success",
                                  }
                                );
                              } else {
                                const data = {
                                  id: null,
                                  refId: trademarkId,
                                  typeId: 5,
                                  refusalNumber: values.refusalNumber,
                                  notiDate: values.notiDate,
                                  deadline: calDeadlineDate(
                                    values.notiDate,
                                    2
                                  ).format("YYYY-MM-DD"),
                                  responseDate: values.responseDate,
                                };
                                formik.values.notifyRefusals.push(data);
                                enqueueSnackbar("Add Notification Success!", {
                                  variant: "success",
                                });
                              }
                              setNotiDialogOpen(false);
                            }}
                          >
                            {({
                              handleChange,
                              setFieldValue,
                              values,
                              errors,
                              touched,
                            }) => (
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
                                      <MuiPickersUtilsProvider
                                        utils={MomentUtils}
                                      >
                                        <KeyboardDatePicker
                                          error={Boolean(
                                            touched.notiDate && errors.notiDate
                                          )}
                                          helperText={
                                            touched.notiDate && errors.notiDate
                                          }
                                          fullWidth
                                          disableToolbar
                                          readOnly={!props.canEdit}
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
                                      <MuiPickersUtilsProvider
                                        utils={MomentUtils}
                                      >
                                        <KeyboardDatePicker
                                          fullWidth
                                          disableToolbar
                                          variant="inline"
                                          format="DD/MM/YYYY"
                                          readOnly={!props.canEdit}
                                          label="Date of Response"
                                          value={values.responseDate}
                                          onChange={(value) => {
                                            setFieldValue(
                                              "responseDate",
                                              value
                                            );
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
                      <Grid item lg={6}>
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
                                  {formik.values.notifyRefusals.map(
                                    (item, index) => (
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
                                            variant="contained"
                                            color="primary"
                                            endIcon={<CreateIcon />}
                                            onClick={() => {
                                              handleEditNoti(
                                                index,
                                                item.refusalNumber
                                              );
                                            }}
                                          >
                                            Edit
                                          </Button>
                                        </StyledTableCell>
                                      </StyledTableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={handleViewNotiDialogClose}
                              color="primary"
                            >
                              Close
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4} lg={6} xl={4}>
                    <TextField
                      name="decisionNumber"
                      onBlur={formik.handleChange}
                      defaultValue={formik.values.decisionNumber || ""}
                      label="Renewal Decision Number"
                      fullWidth
                      className={classes.marginTop}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={6} xl={4}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <KeyboardDatePicker
                        fullWidth
                        disableToolbar
                        variant="inline"
                        format="DD/MM/YYYY"
                        readOnly={!props.canEdit}
                        label="Renewal Decision Date"
                        value={formik.values.decisionDate}
                        onChange={(value) =>
                          formik.setFieldValue("decisionDate", value)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        className={classes.marginTop}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12} md={4} lg={6} xl={4}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <KeyboardDatePicker
                        fullWidth
                        disableToolbar
                        variant="inline"
                        format="DD/MM/YYYY"
                        label="Next Renewal"
                        readOnly={true}
                        value={formik.values.nextRenewal}
                        onChange={(value) =>
                          formik.setFieldValue("nextRenewal", value)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        className={classes.marginTop}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <TextField
                      label="Take Notes"
                      name="takeNotes"
                      onBlur={formik.handleChange}
                      defaultValue={formik.values.takeNotes || ""}
                      multiline
                      rows={8}
                      fullWidth
                      variant="outlined"
                      className={classes.marginNotes}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </fieldset>
    </Container>
  );
};

export default AddRenewal;
