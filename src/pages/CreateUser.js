import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSnackbar } from "notistack";
import axiosConfig from "../commons/Apis/axiosConfig";
import { useHistory } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "../components/DialogTitle";

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
import { INIT_USER_DATA } from "../commons/constants/userConstants";
import { ROLES, DEPARTMENTS } from "../commons/constants/userConstants";

const useStyles = makeStyles((theme) => ({
  marginRight: {
    marginRight: 10,
    paddingTop: 2,
  },
  styleBtn: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

const CreateUser = () => {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const formikRef = React.createRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [leaders, setLeaders] = useState([]);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const closeAccountDialog = () => {
    setAccountDialogOpen(false);
  };
  const confirmAccount = () => {
    closeAccountDialog();
    history.push("/manage-users");
  };
  const [isShowSelectLeader, setIsShowSelectLeader] = useState(false);
  //Call API to create User
  const createUser = async (userData) => {
    try {
      const response = await axiosConfig.post("/user/register", userData);
      if (response.data.status.code === "200") {
        formikRef.current.resetForm();
        enqueueSnackbar("Create User Successfully", { variant: "success" });
        setUsername(response.data.data.username);
        setPassword(response.data.data.password);
        setAccountDialogOpen(true);
      } else if (response.data.status.code === "500") {
        enqueueSnackbar(response.data.data, { variant: "error" });
      } else {
        enqueueSnackbar("Cannot Create User", { variant: "error" });
      }
    } catch (e) {
      console.error(e);
    }
  };
  //Call API to load all leader
  const loadLeaders = async () => {
    try {
      const response = await axiosConfig.get("/user/get-attorney");
      if (response.data.status.code === "200") {
        setLeaders(response.data.data);
      } else if (response.data.status.code === "500") {
        enqueueSnackbar(response.data.data, { variant: "error" });
      } else {
        enqueueSnackbar("Cannot Load Leader", { variant: "error" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  //schema for validation
  const validateSchema = Yup.object().shape({
    name: Yup.string().max(255).required("Full Name is required"),
    emailAddress: Yup.string()
      .email("Must be valid email")
      .max(255)
      .required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^(\+84|0)(2|3|5|7|9)\d{8}$/, "Invalid Phone Number")
      .required("Phone is required"),
    birthDate: Yup.date()
      .nullable()
      .typeError("Invalid Date")
      .required("Date of birth is required")
      .max(new Date(), "Date of birth cannot be a future date"),
    joinDate: Yup.date()
      .nullable()
      .typeError("Invalid Date")
      .required("Join Date is required"),
    roleId: Yup.number().required("Role is required"),
    leaderId: isShowSelectLeader
      ? Yup.number().nullable().required("Leader is required")
      : null,
  });

  return (
    <Box style={{ paddingTop: 24 }}>
      <MetaData title={"My Account"} />
      <Container maxWidth={"md"}>
        <Card>
          <CardHeader
            title="Add New User"
            titleTypographyProps={{ variant: "h4" }}
          />
          <Divider />
          <Formik
            innerRef={formikRef}
            initialValues={INIT_USER_DATA}
            validationSchema={validateSchema}
            onSubmit={(values, { resetForm }) => {
              createUser(values);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              setFieldValue,
              touched,
              values,
            }) => (
              <Form>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                        id="name"
                        label="Full Name*"
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        error={Boolean(
                          touched.emailAddress && errors.emailAddress
                        )}
                        helperText={touched.emailAddress && errors.emailAddress}
                        id="emailAddress"
                        label="Email*"
                        name="emailAddress"
                        value={values.emailAddress}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        type="email"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        error={Boolean(
                          touched.phoneNumber && errors.phoneNumber
                        )}
                        helperText={touched.phoneNumber && errors.phoneNumber}
                        id="phoneNumber"
                        label="Phone*"
                        name="phoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                          error={Boolean(touched.birthDate && errors.birthDate)}
                          helperText={touched.birthDate && errors.birthDate}
                          fullWidth
                          disableToolbar
                          variant="inline"
                          format="DD/MM/YYYY"
                          label="Date Of Birth*"
                          name="birthDate"
                          maxDate={new Date()}
                          value={values.birthDate}
                          onChange={(value) =>
                            setFieldValue("birthDate", value)
                          }
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={6}>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                          error={Boolean(touched.joinDate && errors.joinDate)}
                          helperText={touched.joinDate && errors.joinDate}
                          fullWidth
                          disableToolbar
                          variant="inline"
                          format="DD/MM/YYYY"
                          label="Join Date*"
                          name="joinDate"
                          value={values.joinDate}
                          onChange={(value) => setFieldValue("joinDate", value)}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Department
                        </InputLabel>
                        <Select
                          value={values.departmentId || ""}
                          onChange={(e) => {
                            setFieldValue("departmentId", e.target.value);
                          }}
                        >
                          {DEPARTMENTS.map((item, index) => (
                            <MenuItem value={item.id} key={index}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl
                        fullWidth
                        error={Boolean(touched.roleId && errors.roleId)}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Role*
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          value={values.roleId || ""}
                          onChange={(e) => {
                            setFieldValue("roleId", e.target.value);
                            if (e.target.value === 3) {
                              loadLeaders();
                              setIsShowSelectLeader(true);
                            } else {
                              setIsShowSelectLeader(false);
                              setFieldValue("leaderId", null);
                            }
                          }}
                        >
                          {ROLES.map(
                            (item, index) =>
                              item.canSet && (
                                <MenuItem value={item.id} key={index}>
                                  {item.name}
                                </MenuItem>
                              )
                          )}
                        </Select>
                        <FormHelperText>
                          {touched.roleId && errors.roleId}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {isShowSelectLeader && (
                      <Grid item xs={6}>
                        <FormControl
                          fullWidth
                          error={Boolean(touched.leaderId && errors.leaderId)}
                        >
                          <InputLabel id="demo-simple-select-label">
                            Leader*
                          </InputLabel>
                          <Select
                            value={values.leaderId || ""}
                            onChange={(e) => {
                              setFieldValue("leaderId", e.target.value);
                            }}
                          >
                            {leaders.map((leader, index) => (
                              <MenuItem value={leader.id} key={index}>
                                <Typography variant="h5">
                                  {leader.name}
                                </Typography>
                                ({leader.username})
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {touched.leaderId && errors.leaderId}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Box className={classes.styleBtn}>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                        >
                          Add
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Form>
            )}
          </Formik>
        </Card>
        <Dialog
          open={accountDialogOpen}
          keepMounted
          onClose={closeAccountDialog}
          fullWidth={true}
        >
          <DialogTitle onClose={closeAccountDialog}>Account Info</DialogTitle>
          <Divider />
          <DialogContent>
            <div style={{ display: "flex" }}>
              <Typography variant="h5" className={classes.marginRight}>
                Username:
              </Typography>
              <Typography variant="h4" color="secondary">
                {username}
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <Typography variant="h5" className={classes.marginRight}>
                Password:
              </Typography>
              <Typography variant="h4" color="secondary">
                {password}
              </Typography>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(
                  `Username: ${username}\nPassword: ${password}`
                );
                enqueueSnackbar("Copy to clipboard successfully", {
                  variant: "success",
                });
              }}
            >
              Copy
            </Button>
            <Button color="primary" onClick={confirmAccount}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default CreateUser;
