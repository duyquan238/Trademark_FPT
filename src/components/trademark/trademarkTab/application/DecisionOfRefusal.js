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
  { id: "number", label: "Decision Number" },
  { id: "decisionDate", label: "Decision Date" },
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
  styleButton: {
    float: "right",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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

const DecisionOfRefusal = (props) => {
  const classes = useStyles();
  const { formik } = props;
  const { enqueueSnackbar } = useSnackbar();

  //handle decision of refusal
  const [isEdit, setIsEdit] = useState(false);
  const [currentDataIndex, setCurrentDataIndex] = useState();
  const [number, setNumber] = useState("");
  const [date, setDate] = useState(null);
  const [responseDate, setResponseDate] = useState(null);

  //Hanlde Dialog
  const [addDecisionDialogOpen, setDecisionDialogOpen] = useState(false);
  const handleAddDecisionDialogOpen = (data) => {
    setDecisionDialogOpen(true);
    if (data) {
      setIsEdit(true);
      setNumber(data.number);
      setDate(data.date);
      setResponseDate(data.responseDate);
    } else {
      setIsEdit(false);
      setNumber("");
      setDate(null);
      setResponseDate(null);
    }
  };

  //allow add decision
  const canAddDecision = () => {
    let allowEdit = [4, 5, 7, 8];
    return allowEdit.includes(calTrademarkStatus(formik.values));
  };
  const handleAddDecisionDialogClose = () => {
    setDecisionDialogOpen(false);
  };

  const [viewDecisionDialogOpen, setViewDecisionDialogOpen] = useState(false);
  const handleViewDecisionDialogOpen = () => {
    setViewDecisionDialogOpen(true);
  };
  const handleViewDecisionDialogClose = () => {
    setViewDecisionDialogOpen(false);
  };

  const handleEditDecision = (decisionIndex) => {
    handleViewDecisionDialogClose();
    handleAddDecisionDialogOpen(
      formik.values.application.decisionRefusals[decisionIndex]
    );
    setCurrentDataIndex(decisionIndex);
  };
  const validationSchema = Yup.object().shape({
    number: Yup.string().required("Decision Number is required"),
    checkDuplicateDecisionNumber: Yup.boolean().test(
      "check-duplicated",
      "Decision Number is duplicated",
      function () {
        let isUnique = true;
        const { number } = this.parent;
        formik.values.application.decisionRefusals.forEach((item, index) => {
          if (item.number === number && currentDataIndex !== index) {
            isUnique = false;
          }
        });
        return isUnique;
      }
    ),
    date: Yup.date().nullable().required("Decision Date is required"),
  });

  return (
    <Card elevation={5} className={classes.marginTop}>
      <CardHeader
        title="Decision of Refusal"
        titleTypographyProps={{ variant: "h4" }}
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6} lg={6}>
            <Button
              disabled={!props.canEdit || !canAddDecision()}
              variant="contained"
              color="primary"
              onClick={() => handleAddDecisionDialogOpen(null)}
            >
              Add Decision
            </Button>
            <Dialog
              open={addDecisionDialogOpen}
              onClose={handleAddDecisionDialogClose}
              aria-labelledby="form-dialog-title"
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle onClose={handleAddDecisionDialogClose}>
                Decision of Refusal
              </DialogTitle>
              <Formik
                initialValues={{
                  id: null,
                  applicationId: formik.values.application.id,
                  number: number,
                  date: date,
                  deadline: null,
                  responseDate: responseDate,
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  if (isEdit) {
                    formik.setFieldValue(
                      `application.decisionRefusals[${currentDataIndex}].number`,
                      values.number
                    );
                    formik.setFieldValue(
                      `application.decisionRefusals[${currentDataIndex}].date`,
                      values.date
                    );
                    formik.setFieldValue(
                      `application.decisionRefusals[${currentDataIndex}].deadline`,
                      calDeadlineDate(
                        moment(values.date, "YYYY-MM-DD"),
                        3
                      ).format("YYYY-MM-DD")
                    );
                    formik.setFieldValue(
                      `application.decisionRefusals[${currentDataIndex}].responseDate`,
                      values.responseDate
                    );
                  } else {
                    const data = {
                      id: null,
                      applicationId: formik.values.application.id,
                      number: values.number,
                      date: values.date,
                      deadline: calDeadlineDate(values.date, 3),
                      responseDate: values.responseDate,
                    };
                    formik.values.application.decisionRefusals.push(data);
                  }
                  setDecisionDialogOpen(false);
                  enqueueSnackbar("Add Decision Success!", {
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
                              errors.number ||
                                errors.checkDuplicateDecisionNumber
                            )}
                            helperText={
                              errors.number ||
                              errors.checkDuplicateDecisionNumber
                            }
                            label="Decision Number*"
                            name="number"
                            value={values.number}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                              error={Boolean(touched.date && errors.date)}
                              helperText={touched.date && errors.date}
                              fullWidth
                              disableToolbar
                              variant="inline"
                              format="DD/MM/YYYY"
                              label="Decision Date*"
                              value={values.date}
                              onChange={(value) => {
                                setFieldValue("date", value);
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
                        onClick={handleAddDecisionDialogClose}
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
              onClick={handleViewDecisionDialogOpen}
            >
              View Decision
            </Button>
            <Dialog
              open={viewDecisionDialogOpen}
              onClose={handleViewDecisionDialogClose}
              aria-labelledby="form-dialog-title"
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle onClose={handleViewDecisionDialogClose}>
                List of Decisions
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
                      {formik.values.application.decisionRefusals.map(
                        (item, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{item.number}</StyledTableCell>
                            <StyledTableCell>
                              {dateFormat(
                                item.date,
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
                                  handleEditDecision(index);
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
                <Button onClick={handleViewDecisionDialogClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DecisionOfRefusal;
