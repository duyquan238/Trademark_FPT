import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import { Formik, FieldArray, Form, getIn } from "formik";
import { useSnackbar } from "notistack";

import Typography from "@material-ui/core/Typography";
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
import DialogTitle from "../../DialogTitle";

import { OUR_REF } from "../../../commons/constants/trademarkConstants";

const useStyles = makeStyles((theme) => ({
  marginTop: {
    marginTop: theme.spacing(1),
  },
  styleButton: {
    float: "right",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  noBorder: {
    border: 0,
  },
}));

const DarkerDisabledTextField = withStyles({
  root: {
    "& .MuiInputBase-root.Mui-disabled": {
      color: "#172b4d", // (default alpha is 0.38)
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "#6b778c",
    },
  },
})(TextField);

const AgentInfo = (props) => {
  const classes = useStyles();
  //get props father formik from TrademarkTab
  const { formik } = props;
  const { enqueueSnackbar } = useSnackbar();

  //handle open agent's info dialog
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const handleAgentDialogOpen = () => {
    setAgentDialogOpen(true);
  };
  const handleAgentDialogClose = () => {
    setAgentDialogOpen(false);
  };

  const [instructorDialogOpen, setInstructorDialogOpen] = useState(false);
  const handleInstructorDialogOpen = () => {
    setInstructorDialogOpen(true);
  };
  const handleInstructorDialogClose = () => {
    setInstructorDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader
        title="Agent's Information"
        titleTypographyProps={{ variant: "h4" }}
      />
      <Divider />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={12}>
                <DarkerDisabledTextField
                  id="ourRef"
                  label="Our Ref."
                  name="ourRef"
                  variant="outlined"
                  fullWidth
                  disabled
                  defaultValue={OUR_REF}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                lg={12}
                key={"yourRef" + formik.values.agent.yourRef}
              >
                <TextField
                  error={Boolean(
                    formik.touched.agent &&
                      formik.touched.agent.yourRef &&
                      formik.errors.agent &&
                      formik.errors.agent.yourRef
                  )}
                  helperText={
                    formik.touched.agent &&
                    formik.touched.agent.yourRef &&
                    formik.errors.agent &&
                    formik.errors.agent.yourRef
                  }
                  id="yourRef"
                  label="Your Ref.*"
                  name="agent.yourRef"
                  variant="outlined"
                  fullWidth
                  onBlur={formik.handleChange}
                  defaultValue={formik.values.agent.yourRef || ""}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                lg={12}
                key={"agentName" + formik.values.agent.name}
              >
                <TextField
                  error={Boolean(
                    formik.touched.agent &&
                      formik.touched.agent.name &&
                      formik.errors.agent &&
                      formik.errors.agent.name
                  )}
                  helperText={
                    formik.touched.agent &&
                    formik.touched.agent.name &&
                    formik.errors.agent &&
                    formik.errors.agent.name
                  }
                  id="agent-name"
                  label="Agent's Name*"
                  name="agent.name"
                  defaultValue={formik.values.agent.name || ""}
                  onBlur={formik.handleChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAgentDialogOpen}
                >
                  Agent's Info
                </Button>
                <Dialog
                  open={agentDialogOpen}
                  onClose={handleAgentDialogClose}
                  fullWidth={true}
                  maxWidth="md"
                >
                  <DialogTitle
                    id="agent-info-title"
                    onClose={handleAgentDialogClose}
                  >
                    Agent's Info
                  </DialogTitle>
                  <Formik
                    initialValues={{
                      agentAddress: formik.values.agent.address,
                    }}
                    validationSchema={Yup.object().shape({
                      agentAddress: Yup.string().required(
                        "Address is required"
                      ),
                    })}
                    onSubmit={(values) => {
                      formik.setFieldValue(
                        "agent.address",
                        values.agentAddress
                      );
                      setAgentDialogOpen(false);
                      enqueueSnackbar("Save Agent's Information success!", {
                        variant: "success",
                      });
                    }}
                  >
                    {({ handleChange, values, touched, errors }) => (
                      <Form>
                        <fieldset
                          disabled={!props.canEdit}
                          className={classes.noBorder}
                        >
                          <DialogContent dividers>
                            <TextField
                              error={Boolean(
                                touched.agentAddress && errors.agentAddress
                              )}
                              helperText={
                                touched.agentAddress && errors.agentAddress
                              }
                              id="agentAddress"
                              label="Agent's Address*"
                              variant="outlined"
                              name="agentAddress"
                              value={values.agentAddress || ""}
                              onChange={handleChange}
                              fullWidth
                            />
                          </DialogContent>
                        </fieldset>
                        <DialogActions>
                          {props.canEdit && (
                            <Button color="primary" type="submit">
                              Save Changed
                            </Button>
                          )}
                          <Button
                            onClick={handleAgentDialogClose}
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
            </Grid>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={12}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    error={Boolean(
                      formik.touched.instructionDate &&
                        formik.errors.instructionDate
                    )}
                    helperText={
                      formik.touched.instructionDate &&
                      formik.errors.instructionDate
                    }
                    fullWidth
                    disableToolbar
                    readOnly={!props.canEdit}
                    variant="inline"
                    format="DD/MM/YYYY"
                    id="instruction-date-picker"
                    label="Instruction Date*"
                    value={formik.values.instructionDate}
                    onChange={(value) =>
                      formik.setFieldValue("instructionDate", value)
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    className={classes.marginTop}
                  />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleInstructorDialogOpen}
                >
                  Instructor's Info
                </Button>
                <Dialog
                  open={instructorDialogOpen}
                  onClose={handleInstructorDialogClose}
                  aria-labelledby="form-dialog-title"
                  fullWidth={true}
                  maxWidth="md"
                >
                  <DialogTitle
                    id="instructor-info-title"
                    onClose={handleInstructorDialogClose}
                  >
                    Instructor's Info
                  </DialogTitle>
                  <Formik
                    initialValues={{
                      instructors: formik.values.listOfInstructor || [],
                    }}
                    validationSchema={Yup.object().shape({
                      instructors: Yup.array()
                        .of(
                          Yup.string().required("Instructor's Name is required")
                        )
                        .min(1, "At least one instuctor"),
                    })}
                    onSubmit={(values) => {
                      formik.setFieldValue(
                        "listOfInstructor",
                        values.instructors
                      );
                      setInstructorDialogOpen(false);
                      enqueueSnackbar(
                        "Save Instructor's Information success!",
                        {
                          variant: "success",
                        }
                      );
                    }}
                  >
                    {({ handleChange, values, errors, touched }) => (
                      <Form>
                        <DialogContent dividers>
                          <Typography variant="h5">
                            {values.instructors.length} instructors
                          </Typography>
                          <FieldArray name="instructors">
                            {({ remove, push }) => (
                              <>
                                <Card
                                  elevation={3}
                                  className={classes.marginTop}
                                >
                                  {values.instructors.length > 0 &&
                                    values.instructors.map(
                                      (instructor, index) => {
                                        const address = `instructors.${index}`;
                                        return (
                                          <fieldset
                                            key={index}
                                            disabled={!props.canEdit}
                                            className={classes.noBorder}
                                          >
                                            <CardContent>
                                              <TextField
                                                error={Boolean(
                                                  getIn(touched, address) &&
                                                    getIn(errors, address)
                                                )}
                                                helperText={
                                                  getIn(touched, address) &&
                                                  getIn(errors, address)
                                                }
                                                label="Instructor's Name*"
                                                name={address}
                                                value={instructor || ""}
                                                onChange={handleChange}
                                                variant="outlined"
                                                fullWidth
                                              />
                                              {values.instructors.length >
                                                1 && (
                                                <Button
                                                  variant="contained"
                                                  color="secondary"
                                                  className={
                                                    classes.styleButton
                                                  }
                                                  onClick={() => remove(index)}
                                                >
                                                  Delete
                                                </Button>
                                              )}
                                            </CardContent>
                                          </fieldset>
                                        );
                                      }
                                    )}
                                </Card>
                                {props.canEdit && (
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    className={classes.marginTop}
                                    onClick={() => push("")}
                                  >
                                    Add More
                                  </Button>
                                )}
                                {errors.instructors &&
                                  values.instructors.length === 0 && (
                                    <Typography
                                      variant="h6"
                                      component="h6"
                                      color="secondary"
                                      className={classes.marginTop}
                                    >
                                      Must have at least 1 instructor
                                    </Typography>
                                  )}
                              </>
                            )}
                          </FieldArray>
                        </DialogContent>
                        <DialogActions>
                          {props.canEdit && (
                            <Button color="primary" type="submit">
                              Save Changed
                            </Button>
                          )}
                          <Button
                            onClick={handleInstructorDialogClose}
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
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AgentInfo;
