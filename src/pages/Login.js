import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearErrors } from "../redux/actions/userActions";

import * as Yup from "yup";

import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import MetaData from "../components/MetaData";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const formikRef = React.createRef();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, error } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isAuthenticated) {
      history.push("/");
    }
    if (error) {
      console.log("error", error);
      enqueueSnackbar("Invalid username or password", {
        variant: "error",
      });
      formikRef.current.values.password = "";
      formikRef.current.setSubmitting(false);
      dispatch(clearErrors());
    }
  }, [isAuthenticated, error]);

  //set up validateSchema
  const validateSchema = Yup.object().shape({
    username: Yup.string().max(255).required("Username is required"),
    password: Yup.string().max(255).required("Password is required"),
  });

  //define function here
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmitHandler = (values) => {
    dispatch(login(values.username, values.password));
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <MetaData title={"Login"} />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h3">
            Sign in
          </Typography>
          <Formik
            innerRef={formikRef}
            initialValues={{
              username: "",
              password: "",
            }}
            validationSchema={validateSchema}
            onSubmit={(values) => {
              handleSubmitHandler(values);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }) => (
              <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                  error={Boolean(touched.username && errors.username)}
                  fullWidth
                  helperText={touched.username && errors.username}
                  label="Username*"
                  margin="normal"
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password*"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleShowPassword}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                  variant="contained"
                  color="primary"
                  size="large"
                  className={classes.submit}
                >
                  Sign In
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </Container>
    </>
  );
};

export default Login;
