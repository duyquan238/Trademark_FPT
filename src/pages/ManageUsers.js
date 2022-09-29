import React, { useState, useRef } from "react";

import { makeStyles, withStyles } from "@material-ui/core/styles";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import axiosConfig from "../commons/Apis/axiosConfig";

import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "../components/DialogTitle";
import Slide from "@material-ui/core/Slide";

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
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ListUser from "../components/user/listUser";
import {
  INIT_USER_DATA,
  ROLES,
  DEPARTMENTS,
} from "../commons/constants/userConstants";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

const DarkerDisabledSelect = withStyles({
  root: {
    "& .MuiInputBase-root.Mui-disabled": {
      color: "#172b4d", // (default alpha is 0.38)
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "#6b778c",
    },
  },
})(Select);

const DarkerDisabledMenuItem = withStyles({
  root: {
    "& .MuiInputBase-root.Mui-disabled": {
      color: "#172b4d", // (default alpha is 0.38)
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "#6b778c",
    },
  },
})(MenuItem);

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  coloredText: {
    color: "#172b4d",
  },
  styleBtn: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: theme.spacing(2),
  },
  marginRight: {
    marginRight: 10,
    paddingTop: 2,
  },
}));

const ManageUsers = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const childRef = useRef();
  const formikRef = React.createRef();
  const [flagFormikChange, setFlagFormikChange] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [openDeactivateUserDialog, setOpenDeactivateUserDialog] =
    useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [newResetPassword, setNewResetPassword] = useState("");
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [isShowSelectLeader, setIsShowSelectLeader] = useState(false);
  const [leaders, setLeaders] = useState([]);
  const closeUserDialog = () => {
    setUserDialogOpen(false);
  };
  const handleDialogDeactivateUserClose = () => {
    setOpenDeactivateUserDialog(false);
  };
  const handleDialogConfirmClose = () => {
    setOpenConfirmDialog(false);
  };
  const closeAccountDialog = () => {
    setAccountDialogOpen(false);
  };

  //Reload list
  const reloadList = () => {
    childRef.current.reloadUsers();
  };
  //handle open User
  const handleOpenUser = (data) => {
    if (data) {
      formikRef.current.setValues(data);
      loadLeaders();
      if (data.role.id === 3) {
        setIsShowSelectLeader(true);
      } else {
        setIsShowSelectLeader(false);
      }
    }
    setUserDialogOpen(true);
  };
  //Call API to update User
  const updateUser = async (userData) => {
    try {
      if (flagFormikChange) {
        const response = await axiosConfig.put("/user/", userData);
        if (response.data.status.code === "200") {
          formikRef.current.resetForm();
          enqueueSnackbar("Update User Successfully", { variant: "success" });
          closeUserDialog();
          reloadList();
          props.modifyManager(!props.isUpdateManager);
        } else if (response.data.status.code === "500") {
          enqueueSnackbar(response.data.data, { variant: "error" });
        } else {
          enqueueSnackbar("Cannot Update User", { variant: "error" });
        }
        setFlagFormikChange(false);
      } else {
        enqueueSnackbar("Nothing changed", { variant: "warning" });
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

  //Call API to deactivate User
  const deactivateUser = async (id) => {
    try {
      const response = await axiosConfig.delete(`/user/${id}`);
      if (response.data.status.code === "200") {
        handleDialogDeactivateUserClose();
        closeUserDialog();
        reloadList();
        enqueueSnackbar("Deactivate User Successfully", { variant: "success" });
      } else if (response.data.status.code === "500") {
        enqueueSnackbar(response.data.data, { variant: "error" });
      } else {
        enqueueSnackbar("Cannot Deactivate User", { variant: "error" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  //call API reset password method
  const resetPasswordHandler = async (id) => {
    try {
      const response = await axiosConfig.put(`/user/resetPassword/${id}`);
      if (response.data.status.code === "200") {
        setNewResetPassword(response.data.data);
        handleDialogConfirmClose();
        setAccountDialogOpen(true);
        enqueueSnackbar("Reset Password Successfully", { variant: "success" });
      } else if (response.data.status.code === "500") {
        enqueueSnackbar(response.data.data, { variant: "error" });
      } else {
        enqueueSnackbar("Cannot Update User", { variant: "error" });
      }
    } catch (error) {
      console.error(error);
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
    leaderId: isShowSelectLeader
      ? Yup.number().nullable().required("Leader is required")
      : null,
  });

  return (
    <Box style={{ paddingTop: 24 }}>
      <MetaData title={"Manage Users"} />
      <Container maxWidth={false}>
        <Box className={classes.styleBtn}>
          <Link to="/create-user">
            <Button
              variant="contained"
              color="primary"
              endIcon={<PersonAddIcon />}
            >
              Add New User
            </Button>
          </Link>
        </Box>

        <Dialog
          open={userDialogOpen}
          keepMounted
          onClose={closeUserDialog}
          fullWidth={true}
          maxWidth="sm"
        >
          <DialogTitle onClose={closeUserDialog}>Detail User</DialogTitle>
          <Divider />
          <Formik
            innerRef={formikRef}
            initialValues={INIT_USER_DATA}
            validationSchema={validateSchema}
            onSubmit={(values, { resetForm }) => {
              updateUser(values);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              setFieldValue,
              handleSubmit,
              touched,
              values,
            }) => (
              <Form>
                <DialogContent style={{ paddingTop: 16 }}>
                  <DarkerDisabledTextField
                    id="username"
                    label="Username"
                    name="username"
                    value={values.username}
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                    id="name"
                    label="Full Name*"
                    name="name"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setFlagFormikChange(true);
                    }}
                    value={values.name}
                    variant="outlined"
                    fullWidth
                    className={classes.marginTop}
                  />
                  <TextField
                    error={Boolean(touched.emailAddress && errors.emailAddress)}
                    helperText={touched.emailAddress && errors.emailAddress}
                    id="emailAddress"
                    label="Email*"
                    name="emailAddress"
                    value={values.emailAddress}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setFlagFormikChange(true);
                    }}
                    variant="outlined"
                    type="email"
                    fullWidth
                    className={classes.marginTop}
                  />
                  <TextField
                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                    id="phoneNumber"
                    label="Phone*"
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={(e) => {
                      handleChange(e);
                      setFlagFormikChange(true);
                    }}
                    variant="outlined"
                    fullWidth
                    className={classes.marginTop}
                  />
                  <Grid container spacing={2}>
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
                          onChange={(value) => {
                            setFieldValue("birthDate", value);
                            setFlagFormikChange(true);
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
                          error={Boolean(touched.joinDate && errors.joinDate)}
                          helperText={touched.joinDate && errors.joinDate}
                          fullWidth
                          disableToolbar
                          variant="inline"
                          format="DD/MM/YYYY"
                          label="Join Date*"
                          name="joinDate"
                          value={values.joinDate}
                          onChange={(value) => {
                            setFieldValue("joinDate", value);
                            setFlagFormikChange(true);
                          }}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                          className={classes.marginTop}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                  </Grid>
                  <FormControl fullWidth className={classes.marginTop}>
                    <InputLabel id="demo-simple-select-label">
                      Department
                    </InputLabel>
                    <Select
                      value={values.departmentId || ""}
                      onChange={(e) => {
                        setFieldValue("departmentId", e.target.value);
                        setFlagFormikChange(true);
                      }}
                    >
                      {DEPARTMENTS.map((item, index) => (
                        <MenuItem value={item.id} key={index}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    fullWidth
                    className={classes.marginTop}
                    error={Boolean(touched.roleId && errors.roleId)}
                  >
                    <InputLabel id="demo-simple-select-label">Role*</InputLabel>
                    <DarkerDisabledSelect
                      labelId="demo-simple-select-label"
                      value={values.roleId || ""}
                      disabled={true}
                      onChange={(e) => {
                        setFieldValue("roleId", e.target.value);
                        setFlagFormikChange(true);
                        if (e.target.value === 3) {
                          setIsShowSelectLeader(true);
                        } else {
                          setIsShowSelectLeader(false);
                          setFieldValue("leaderId", null);
                        }
                      }}
                    >
                      {ROLES.map((item, index) => (
                        <DarkerDisabledMenuItem
                          value={item.id}
                          key={index}
                          onClickCapture={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <span className={classes.coloredText}>
                            {item.name}
                          </span>
                        </DarkerDisabledMenuItem>
                      ))}
                    </DarkerDisabledSelect>
                    <FormHelperText>
                      {touched.roleId && errors.roleId}
                    </FormHelperText>
                  </FormControl>
                  {isShowSelectLeader && (
                    <FormControl
                      fullWidth
                      error={Boolean(touched.leaderId && errors.leaderId)}
                      className={classes.marginTop}
                    >
                      <InputLabel id="demo-simple-select-label">
                        Leader*
                      </InputLabel>
                      <Select
                        value={values.leaderId || ""}
                        onChange={(e) => {
                          setFieldValue("leaderId", e.target.value);
                          setFlagFormikChange(true);
                        }}
                      >
                        {leaders.map((leader, index) => (
                          <MenuItem value={leader.id} key={index}>
                            <Typography variant="h5">{leader.name}</Typography>(
                            {leader.username})
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {touched.leaderId && errors.leaderId}
                      </FormHelperText>
                    </FormControl>
                  )}
                </DialogContent>
                <DialogActions>
                  {values.roleId !== 1 && (
                    <>
                      <Button
                        color="secondary"
                        onClick={() => setOpenDeactivateUserDialog(true)}
                      >
                        Deactivate User
                      </Button>
                      <Dialog
                        open={openDeactivateUserDialog}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleDialogDeactivateUserClose}
                      >
                        <DialogTitle disableTypography={true}>
                          Are you sure you want to deactivate user{" "}
                          {values.username}?
                        </DialogTitle>
                        <DialogContent></DialogContent>
                        <DialogActions>
                          <Button
                            onClick={handleDialogDeactivateUserClose}
                            color="primary"
                          >
                            Cancel
                          </Button>
                          <Button
                            color="secondary"
                            onClick={() => deactivateUser(values.id)}
                          >
                            Confirm
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </>
                  )}
                  {values.roleId !== 1 && (
                    <>
                      <Button
                        color="primary"
                        onClick={() => setOpenConfirmDialog(true)}
                      >
                        Reset Password
                      </Button>
                      <Dialog
                        open={openConfirmDialog}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleDialogConfirmClose}
                      >
                        <DialogTitle disableTypography={true}>
                          Are you sure you want to reset password for user{" "}
                          {values.username}?
                        </DialogTitle>
                        <DialogContent></DialogContent>
                        <DialogActions>
                          <Button
                            onClick={handleDialogConfirmClose}
                            color="primary"
                          >
                            Cancel
                          </Button>
                          <Button
                            color="secondary"
                            onClick={() => resetPasswordHandler(values.id)}
                          >
                            Confirm
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </>
                  )}
                  <Button color="primary" type="submit">
                    Update
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Dialog>
        <Dialog
          open={accountDialogOpen}
          keepMounted
          TransitionComponent={Transition}
          onClose={closeAccountDialog}
        >
          <DialogTitle onClose={closeAccountDialog}>Account Info</DialogTitle>
          <Divider />
          <DialogContent>
            <div style={{ display: "flex" }}>
              <Typography variant="h5" className={classes.marginRight}>
                New Password:
              </Typography>
              <Typography variant="h4" color="secondary">
                {newResetPassword}
              </Typography>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(
                  `New Password: ${newResetPassword}`
                );
                enqueueSnackbar("Copy to clipboard successfully", {
                  variant: "success",
                });
              }}
            >
              Copy
            </Button>
            <Button color="primary" onClick={() => setAccountDialogOpen(false)}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <ListUser handleOpenUser={handleOpenUser} ref={childRef} />
      </Container>
    </Box>
  );
};

export default ManageUsers;
