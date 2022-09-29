import React from "react";

import RefusalAsToForm from "./RefusalAsToForm";
import DecisionOfRefusal from "./DecisionOfRefusal";
import AllowanceOfRegistration from "./AllowanceOfRegistration";
import RefusalAsToSubstance from "./RefusalAsToSubstance";

import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import MomentUtils from "@date-io/moment";
import moment from "moment";
import { calDeadlineDate } from "../../../../commons/ultils/DateUltil";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { booleanToString } from "../../../../commons/ultils/ConvertUltil";

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

const Application = (props) => {
  const classes = useStyles();
  const { formik } = props;

  //Hanle deadline date
  const handlePOADeadline = (date) => {
    let result =
      date == null
        ? null
        : "Deadline for submitting original Power of Attorney: " +
          calDeadlineDate(moment(date, "YYYY-MM-DD"), 1).format("DD-MM-YYYY");
    return result;
  };

  //calculate Expired Date (+10 years)
  const calExpiredDate = (date) => {
    return moment(date, "DD-MM-YYYY").add(10, "years");
  };

  return (
    <Card>
      <CardHeader
        title="Application"
        titleTypographyProps={{ variant: "h4" }}
      />
      <Divider />
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={6} lg={3}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel id="type-of-application">
                Type of Application
              </InputLabel>
              <Select
                readOnly={!props.canEdit}
                labelId="type-of-application"
                value={
                  booleanToString(formik.values.application.isInternational) ||
                  ""
                }
                onChange={(e) => {
                  formik.setFieldValue(
                    "application.isInternational",
                    e.target.value
                  );
                }}
                label="Type of Application"
              >
                <MenuItem value={"false"}>National</MenuItem>
                <MenuItem value={"true"}>International</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} lg={3}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel id="status-submit">
                Status Submitting Original POA
              </InputLabel>
              <Select
                readOnly
                labelId="status-submit"
                value={props.status}
                label="Status Submitting Original POA"
              >
                <MenuItem value={10}>Not yet Submitted</MenuItem>
                <MenuItem value={20}>Submitted</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={6}
            lg={3}
            key={formik.values.application.number + "application.number"}
          >
            <TextField
              error={Boolean(
                formik.touched.application &&
                  formik.touched.application.number &&
                  formik.errors.application &&
                  formik.errors.application.number
              )}
              helperText={
                formik.touched.application &&
                formik.touched.application.number &&
                formik.errors.application &&
                formik.errors.application.number
              }
              label="Application Number"
              name="application.number"
              defaultValue={formik.values.application.number}
              onBlur={formik.handleChange}
              className={classes.marginTop}
              placeholder="Ex: 4-2021-12345"
              fullWidth
            />
          </Grid>
          <Grid item xs={6} lg={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={12}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    error={Boolean(
                      formik.touched.application &&
                        formik.touched.application.fillingDate &&
                        formik.errors.application &&
                        formik.errors.application.fillingDate
                    )}
                    helperText={
                      formik.touched.application &&
                      formik.touched.application.fillingDate &&
                      formik.errors.application &&
                      formik.errors.application.fillingDate
                    }
                    fullWidth
                    disableToolbar
                    readOnly={!props.canEdit}
                    variant="inline"
                    format="DD/MM/YYYY"
                    label="Filling Date"
                    minDate={new Date(formik.values.instructionDate)}
                    maxDate={new Date()}
                    value={formik.values.application.fillingDate}
                    onChange={(value) => {
                      handlePOADeadline(value);
                      formik.setFieldValue("application.fillingDate", value);
                      formik.setFieldValue(
                        "application.deadline",
                        moment(value, "DD-MM-YYYY").add(1, "months")
                      );
                      formik.setFieldValue(
                        "application.expireDate",
                        calExpiredDate(value)
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
                {!!formik.values.application.fillingDate &&
                  props.status !== 20 && (
                    <Typography variant="h6" component="h6" color="secondary">
                      {handlePOADeadline(formik.values.application.fillingDate)}
                    </Typography>
                  )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            <RefusalAsToForm formik={formik} canEdit={props.canEdit} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <RefusalAsToSubstance formik={formik} canEdit={props.canEdit} />
            <DecisionOfRefusal formik={formik} canEdit={props.canEdit} />
          </Grid>
          <Grid item xs={12} lg={12}>
            <AllowanceOfRegistration formik={formik} canEdit={props.canEdit} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Application;
