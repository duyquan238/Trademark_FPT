import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import axiosConfig from "../commons/Apis/axiosConfig";
import { logout } from "../redux/actions/userActions";
import { CLEAR_AUTHEN_ONLY } from "../commons/constants/userConstants";

import { Grid, Container, Box } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "../components/DialogTitle";

import { getDepartmentName } from "../commons/ultils/userUtil";

import MetaData from "../components/MetaData";
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

const useStyles = makeStyles((theme) => ({
  marginTop: {
    marginTop: theme.spacing(2),
  },
}));

const MyAccount = () => {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const formikRef = React.createRef();
  const dispatch = useDispatch();
  const [isMatchPassword, setIsMatchPassword] = useState(true);
  const [changePassDialogOpen, setChangePassDialogOpen] = useState(false);
  const closeChangePassDialog = () => {
    setChangePassDialogOpen(false);
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };
  const { user } = useSelector((state) => state.auth);

  //Call API to change password
  const changePassword = async (passwordData) => {
    try {
      const response = await axiosConfig.put(
        "/user/changePassword",
        passwordData
      );
      if (response.data.status.code === "200") {
        dispatch({
          type: CLEAR_AUTHEN_ONLY,
          payload: user,
        });
        history.push("/login");
        dispatch(logout());
        // closeChangePassDialog();
        enqueueSnackbar("Change Password Successfully", { variant: "success" });
      } else if (response.data.status.code === "500") {
        enqueueSnackbar(response.data.data, { variant: "error" });
      } else {
        enqueueSnackbar("Cannot Change Password", { variant: "error" });
      }
    } catch (e) {
      console.error(e);
    }
  };
  //schema for validation
  const validateSchema = Yup.object().shape({
    oldPassword: Yup.string().max(32).required("Old Password is required"),
    newPassword: Yup.string()
      .required("New Password is required")
      .max(32, "Password must not exceed 32 characters")
      .min(5, "Password is too short")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,32}$/,
        "Must contains from 8 to 32 characters, number, uppercase and lowercase letters"
      ),
    confirmPassword: Yup.string().required("Confirm Password is required"),
  });

  return (
    <Box style={{ paddingTop: 24 }}>
      <MetaData title={"My Account"} />
      <Container maxWidth={"md"}>
        <Card>
          <CardHeader
            title="My Account"
            titleTypographyProps={{ variant: "h4" }}
            subheader="The information cannot be edited"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DarkerDisabledTextField
                  id="fullName"
                  label="Full Name*"
                  name="fullName"
                  value={user.name || ""}
                  variant="outlined"
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <DarkerDisabledTextField
                  id="email"
                  label="Email*"
                  name="email"
                  value={user.emailAddress || ""}
                  variant="outlined"
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <DarkerDisabledTextField
                  id="phone"
                  label="Phone*"
                  name="phone"
                  value={user.phoneNumber || ""}
                  variant="outlined"
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <DarkerDisabledTextField
                  id="dateOfBirth"
                  label="Date Of Birth*"
                  name="dateOfBirth"
                  value={user.birthDate || ""}
                  variant="outlined"
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <DarkerDisabledTextField
                  id="joinDate"
                  label="Join Date*"
                  name="joinDate"
                  value={user.joinDate || ""}
                  variant="outlined"
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <DarkerDisabledTextField
                  id="department"
                  label="Department"
                  name="department"
                  value={getDepartmentName(user.departmentId) || ""}
                  variant="outlined"
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <DarkerDisabledTextField
                  id="role"
                  label="Role*"
                  name="role"
                  value={user.role.name || ""}
                  variant="outlined"
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setChangePassDialogOpen(true);
                    setIsMatchPassword(true);
                  }}
                >
                  Change Password
                </Button>
                <Dialog
                  open={changePassDialogOpen}
                  keepMounted
                  onClose={closeChangePassDialog}
                  fullWidth={true}
                  maxWidth="sm"
                >
                  <DialogTitle onClose={closeChangePassDialog}>
                    Change Password
                  </DialogTitle>
                  <Divider />
                  <Formik
                    innerRef={formikRef}
                    initialValues={{
                      oldPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    }}
                    validationSchema={validateSchema}
                    onSubmit={(values) => {
                      if (values.newPassword === values.confirmPassword) {
                        setIsMatchPassword(true);
                        changePassword(values);
                      } else {
                        setIsMatchPassword(false);
                      }
                    }}
                  >
                    {({
                      errors,
                      handleBlur,
                      handleChange,
                      touched,
                      values,
                    }) => (
                      <Form>
                        <DialogContent>
                          <TextField
                            error={Boolean(
                              touched.oldPassword && errors.oldPassword
                            )}
                            helperText={
                              touched.oldPassword && errors.oldPassword
                            }
                            id="oldPassword"
                            label="Old Password*"
                            name="oldPassword"
                            value={values.oldPassword}
                            onBlur={handleBlur}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            type="password"
                            variant="outlined"
                            fullWidth
                          />
                          <TextField
                            error={Boolean(
                              touched.newPassword && errors.newPassword
                            )}
                            helperText={
                              touched.newPassword && errors.newPassword
                            }
                            id="newPassword"
                            label="New Password*"
                            name="newPassword"
                            value={values.newPassword}
                            onBlur={handleBlur}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            type="password"
                            variant="outlined"
                            fullWidth
                            className={classes.marginTop}
                          />
                          <TextField
                            error={Boolean(
                              touched.confirmPassword && errors.confirmPassword
                            )}
                            helperText={
                              touched.confirmPassword && errors.confirmPassword
                            }
                            id="confirmPassword"
                            label="Confirm Password*"
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onBlur={handleBlur}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            type="password"
                            variant="outlined"
                            fullWidth
                            className={classes.marginTop}
                          />
                          {!isMatchPassword && (
                            <Typography
                              variant="h6"
                              component="h6"
                              color="secondary"
                              className={classes.marginTop}
                            >
                              Confirm Password and Password does not match.
                            </Typography>
                          )}
                        </DialogContent>
                        <DialogActions>
                          <Button color="primary" type="submit">
                            Confirm
                          </Button>
                        </DialogActions>
                      </Form>
                    )}
                  </Formik>
                </Dialog>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default MyAccount;
