import React from "react";
import { Grid } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import MomentUtils from "@date-io/moment";
import moment from "moment";
import { calDeadlineDate } from "../../../../commons/ultils/DateUltil";
import { calTrademarkStatus } from "../../../../commons/ultils/trademarkUtil";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    minWidth: 120,
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
}));

const DarkerDisabledKeyboardDatePicker = withStyles({
  root: {
    "& .MuiInputBase-root.Mui-disabled": {
      color: "#172b4d", // (default alpha is 0.38)
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "#6b778c",
    },
  },
})(KeyboardDatePicker);

const AllowanceOfRegistration = (props) => {
  const classes = useStyles();
  const { formik } = props;
  //Hanle deadline date
  const handlePaymentDeadline = (date) => {
    let result =
      date == null
        ? null
        : "Deadline for Payment: " +
          calDeadlineDate(moment(date, "YYYY-MM-DD"), 3).format("DD-MM-YYYY");

    return result;
  };

   //allow input allowance
   const canInputAllowance = () => {
    let allowEdit = [4, 7, 8]
    return allowEdit.includes(calTrademarkStatus(formik.values));
  }

  //allow input payment
  const canInputPayment = () => {
    let allowEdit = [7, 8]
    return allowEdit.includes(calTrademarkStatus(formik.values));
  }

  //allow input Registration
  const canInputRegistation = () => {
    console.log(formik.values.paymentDate)
    return formik.values && 
      formik.values.application.paymentDate !== null && 
      formik.values.application.paymentDate !== ""
  }

  return (
    <Card elevation={5}>
      <CardHeader
        title="Allowance Of Registration"
        titleTypographyProps={{ variant: "h4" }}
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid
            item
            xs={4}
            lg={4}
            key={formik.values.application.allowanceNumber + "allowanceNumber"}
          >
            <TextField
              error={Boolean(
                formik.touched.application &&
                  formik.touched.application.allowanceNumber &&
                  formik.errors.application &&
                  formik.errors.application.allowanceNumber
              )}
              helperText={
                formik.touched.application &&
                formik.touched.application.allowanceNumber &&
                formik.errors.application &&
                formik.errors.application.allowanceNumber
              }
              label="Allowance Number"
              name="application.allowanceNumber"
              defaultValue={formik.values.application.allowanceNumber}
              inputProps = {{readOnly: !canInputAllowance()}}
              disabled = {!canInputAllowance()}
              onBlur={formik.handleChange}
              className={classes.marginTop}
              fullWidth
            />
          </Grid>
          <Grid item xs={4} lg={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={12}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    readOnly={!props.canEdit || !canInputAllowance()}
                    // inputProps = {{readOnly: !canInputAllowance()}}
                    disabled = {!canInputAllowance()}
                    fullWidth
                    disableToolbar
                    variant="inline"
                    format="DD/MM/YYYY"
                    label="Date of Allowance"
                    minDate={new Date(formik.values.application.acceptanceDate)}
                    maxDate={new Date()}
                    value={formik.values.application.allowanceDate}
                    onChange={(value) => {
                      formik.setFieldValue("application.allowanceDate", value);
                      formik.setFieldValue(
                        "application.paymentDeadline",
                        calDeadlineDate(value, 3)
                      );
                    }}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    className={classes.marginTop}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} lg={12}>
                {!formik.values.application.paymentDate &&
                  !!formik.values.application.allowanceDate && (
                    <Typography variant="h5" component="h2" color="secondary">
                      {handlePaymentDeadline(
                        formik.values.application.allowanceDate
                      )}
                    </Typography>
                  )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4} lg={4}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                readOnly={!props.canEdit || !canInputPayment()}
                // inputProps = {{readOnly: !canInputPayment()}}
                disabled = {!canInputPayment()}
                fullWidth
                disableToolbar
                variant="inline"
                format="DD/MM/YYYY"
                label="Date of Payment"
                minDate={new Date(formik.values.application.allowanceDate)}
                maxDate={new Date()}
                value={formik.values.application.paymentDate}
                onChange={(value) =>
                  formik.setFieldValue("application.paymentDate", value)
                }
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                className={classes.marginTop}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <Divider className={classes.marginTop} />
        <Grid container spacing={2}>
          <Grid
            item
            xs={6}
            lg={3}
            key={formik.values.application.registerNumber + "registerNumber"}
          >
            <TextField
              error={Boolean(
                formik.touched.application &&
                  formik.touched.application.registerNumber &&
                  formik.errors.application &&
                  formik.errors.application.registerNumber
              )}
              helperText={
                formik.touched.application &&
                formik.touched.application.registerNumber &&
                formik.errors.application &&
                formik.errors.application.registerNumber
              }
              label="Registration Number"
              name="application.registerNumber"
              // inputProps = {{readOnly: !canInputRegistation()}}
              disabled = {!canInputRegistation()}
              defaultValue={formik.values.application.registerNumber}
              onBlur={formik.handleChange}
              className={classes.marginTop}
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={6}
            lg={3}
            key={formik.values.application.decisionNumber + "decisionNumber"}
          >
            <TextField
              error={Boolean(
                formik.touched.application &&
                  formik.touched.application.decisionNumber &&
                  formik.errors.application &&
                  formik.errors.application.decisionNumber
              )}
              helperText={
                formik.touched.application &&
                formik.touched.application.decisionNumber &&
                formik.errors.application &&
                formik.errors.application.decisionNumber
              }
              label="Decision Number"
              name="application.decisionNumber"
              // inputProps = {{readOnly: !canInputRegistation()}}
              disabled = {!canInputRegistation()}
              defaultValue={formik.values.application.decisionNumber}
              onBlur={formik.handleChange}
              className={classes.marginTop}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} lg={3}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                readOnly={!props.canEdit || !canInputRegistation()}
                // inputProps = {{readOnly: !canInputRegistation()}}
                disabled = {!canInputRegistation()}
                fullWidth
                disableToolbar
                variant="inline"
                format="DD/MM/YYYY"
                label="Registration Date"
                minDate={new Date(formik.values.application.paymentDate)}
                maxDate={new Date()}
                value={formik.values.application.registerDate}
                onChange={(value) => {
                  formik.setFieldValue("application.registerDate", value);
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                className={classes.marginTop}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={6} lg={3}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DarkerDisabledKeyboardDatePicker
                fullWidth
                disableToolbar
                disabled
                variant="inline"
                format="DD/MM/YYYY"
                label="Expiration Date"
                value={
                  (!!formik.values.application.registerDate &&
                    formik.values.application.expireDate) ||
                  null
                }
                onChange={(value) => {
                  formik.setFieldValue("application.expireDate", value);
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

export default AllowanceOfRegistration;
