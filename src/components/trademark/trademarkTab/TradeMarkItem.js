import React, { useState, useEffect, useMemo } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import * as Yup from "yup";
import { Formik, FieldArray, Form, getIn } from "formik";
import { useSnackbar } from "notistack";

import Autocomplete from "@material-ui/lab/Autocomplete";
import countryList from "react-select-country-list";

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { CLASSES } from "../../../commons/constants/classConstant";

import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "../../DialogTitle";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
  deleteButton: {
    float: "right",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  input: {
    display: "none",
  },
  noBorder: {
    border: 0,
  },
  hide: {
    display: "none",
  },
}));

const DarkerDisabledAutocomplete = withStyles({
  root: {
    "& .MuiInputBase-root.Mui-disabled": {
      color: "#172b4d", // (default alpha is 0.38)
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "#6b778c",
    },
  },
})(Autocomplete);

const TradeMarkItem = (props) => {
  const classes = useStyles();
  //get props father formik from Trademark tab
  const { formik } = props;
  const { enqueueSnackbar } = useSnackbar();
  //define list countries and list state of countries
  const countries = useMemo(() => countryList().getLabels(), []);

  const [images, setImages] = useState([null]);
  const [imagesPreview, setImagesPreview] = useState(
    formik.values.fileName
      ? [process.env.REACT_APP_API_ENDPOINT + `/file/${formik.values.fileName}`]
      : []
  );

  useEffect(() => {
    if (formik.values.poaId) {
      props.callbackChangePOAStatus(formik.values.poaId);
    }
    if (formik.values.fileName) {
      setImagesPreview([
        process.env.REACT_APP_API_ENDPOINT + `/file/${formik.values.fileName}`,
      ]);
    }
  }, [formik.values.poaId, formik.values.fileName]);

  //logic to upload image
  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImages(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  /*All handle Dialog State*/
  //Detail Trademark Dialog
  const [detailTrademarkDialogOpen, setDetailTrademarkDialogOpen] =
    useState(false);
  const handleDetailTrademarkDialogOpen = () => {
    setDetailTrademarkDialogOpen(true);
  };
  const handleDetailTrademarkDialogClose = () => {
    setDetailTrademarkDialogOpen(false);
  };

  //Application Dialog
  const [applicantDialogOpen, setApplicantDialogOpen] = useState(false);
  const handleApplicantDialogOpen = () => {
    setApplicantDialogOpen(true);
  };
  const handleApplicantDialogClose = () => {
    setApplicantDialogOpen(false);
  };

  //Priority Data Dialog
  const [priorityDataDialogOpen, setPriorityDataDialogOpen] = useState(false);
  const handlePriorityDataDialogOpen = () => {
    setPriorityDataDialogOpen(true);
  };
  const handlePriorityDataDialogClose = () => {
    setPriorityDataDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader title="Trademark" titleTypographyProps={{ variant: "h4" }} />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6} key={formik.values.name + "name"}>
            <TextField
              error={Boolean(formik.touched.name && formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              id="name"
              label="Trademark Name*"
              name="name"
              onBlur={formik.handleChange}
              defaultValue={formik.values.name || ""}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            key={formik.values.classList + "classList"}
          >
            {/* <TextField
              error={Boolean(
                formik.touched.classList && formik.errors.classList
              )}
              helperText={formik.touched.classList && formik.errors.classList}
              id="class"
              label="Class"
              name="classList"
              onBlur={formik.handleChange}
              defaultValue={formik.values.classList || ""}
              variant="outlined"
              fullWidth
            /> */}
            <FormControl
              variant="outlined"
              fullWidth
              error={Boolean(
                formik.touched.classList && formik.errors.classList
              )}
            >
              <InputLabel id="class-list">Class</InputLabel>
              <Select
                readOnly={!props.canEdit}
                labelId="class-list"
                value={formik.values.classList || ""}
                onChange={(e) => {
                  formik.setFieldValue("classList", e.target.value);
                  let detailVI = CLASSES.find(
                    (item) => item.value === e.target.value
                  ).desVI;
                  let detailEN = CLASSES.find(
                    (item) => item.value === e.target.value
                  ).desEN;
                  formik.setFieldValue("classDetailEN", detailEN);
                  formik.setFieldValue("classDetailVI", detailVI);
                }}
                label="Class*"
              >
                {CLASSES.map((item, index) => (
                  <MenuItem value={item.value} key={index}>
                    {item.value + " " + item.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formik.touched.classList && formik.errors.classList}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDetailTrademarkDialogOpen}
            >
              Detail Of Trademark
            </Button>
            <Dialog
              open={detailTrademarkDialogOpen}
              onClose={handleDetailTrademarkDialogClose}
              aria-labelledby="form-dialog-title"
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle onClose={handleDetailTrademarkDialogClose}>
                Detail Of Trademark
              </DialogTitle>

              <Formik
                initialValues={{
                  typeOfTrademark: formik.values.typeId,
                  colorENOfTrademark: formik.values.colorEn,
                  colorVIOfTrademark: formik.values.colorVi,
                  desENOfTrademark: formik.values.descEn,
                  desVIOfTrademark: formik.values.descVi,
                }}
                validationSchema={Yup.object().shape({
                  typeOfTrademark: Yup.number()
                    .nullable()
                    .required("Type Of Trademark is required"),
                  colorENOfTrademark: Yup.string().required(
                    "Color of Trademark(in English) is required"
                  ),
                  colorVIOfTrademark: Yup.string().required(
                    "Color of Trademark(in Vietnamese) is required"
                  ),
                  desENOfTrademark: Yup.string().required(
                    "Description of Trademark(in English) is required"
                  ),
                  desVIOfTrademark: Yup.string().required(
                    "Description of Trademark(in Vietnamese) is required"
                  ),
                })}
                onSubmit={(values) => {
                  formik.setFieldValue("typeId", values.typeOfTrademark);
                  formik.setFieldValue("colorEn", values.colorENOfTrademark);
                  formik.setFieldValue("colorVi", values.colorVIOfTrademark);
                  formik.setFieldValue("descEn", values.desENOfTrademark);
                  formik.setFieldValue("descVi", values.desVIOfTrademark);
                  formik.setFieldValue("file", images[0]);
                  setDetailTrademarkDialogOpen(false);
                  enqueueSnackbar("Save Detail of Trademark Success!", {
                    variant: "success",
                  });
                }}
              >
                {({ handleChange, setFieldValue, values, errors, touched }) => (
                  <Form>
                    <fieldset
                      disabled={!props.canEdit}
                      className={classes.noBorder}
                    >
                      <DialogContent dividers>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <FormControl
                              className={classes.formControl}
                              fullWidth
                              error={Boolean(
                                touched.typeOfTrademark &&
                                  errors.typeOfTrademark
                              )}
                            >
                              <InputLabel id="type-of-trademark">
                                Type of Trademark*
                              </InputLabel>
                              <Select
                                labelId="type-of-trademark"
                                value={values.typeOfTrademark || ""}
                                readOnly={!props.canEdit}
                                onChange={(e) => {
                                  setFieldValue(
                                    "typeOfTrademark",
                                    e.target.value
                                  );
                                }}
                                label="Country"
                              >
                                <MenuItem value={1}>Normal Mark</MenuItem>
                                <MenuItem value={2}>Collective Mark</MenuItem>
                                <MenuItem value={3}>Associated Mark</MenuItem>
                                <MenuItem value={4}>
                                  Certification Mark
                                </MenuItem>
                              </Select>
                              <FormHelperText>
                                {touched.typeOfTrademark &&
                                  errors.typeOfTrademark}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            key={
                              values.colorENOfTrademark + "colorENOfTrademark"
                            }
                          >
                            <TextField
                              error={Boolean(
                                touched.colorENOfTrademark &&
                                  errors.colorENOfTrademark
                              )}
                              helperText={
                                touched.colorENOfTrademark &&
                                errors.colorENOfTrademark
                              }
                              id="colorENOfTrademark"
                              label="Color of Trademark(in English)*"
                              className={classes.marginTop}
                              name="colorENOfTrademark"
                              defaultValue={values.colorENOfTrademark || ""}
                              onBlur={handleChange}
                              fullWidth
                            />
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            key={
                              values.colorVIOfTrademark + "colorVIOfTrademark"
                            }
                          >
                            <TextField
                              error={Boolean(
                                touched.colorVIOfTrademark &&
                                  errors.colorVIOfTrademark
                              )}
                              helperText={
                                touched.colorVIOfTrademark &&
                                errors.colorVIOfTrademark
                              }
                              id="colorVIOfTrademark"
                              label="Color of Trademark(in Vietnamese)*"
                              className={classes.marginTop}
                              name="colorVIOfTrademark"
                              defaultValue={values.colorVIOfTrademark || ""}
                              onBlur={handleChange}
                              fullWidth
                            />
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            key={values.desENOfTrademark + "desENOfTrademark"}
                          >
                            <TextField
                              error={Boolean(
                                touched.desENOfTrademark &&
                                  errors.desENOfTrademark
                              )}
                              helperText={
                                touched.desENOfTrademark &&
                                errors.desENOfTrademark
                              }
                              id="desENOfTrademark"
                              label="Description of Trademark(in English)*"
                              name="desENOfTrademark"
                              defaultValue={values.desENOfTrademark || ""}
                              onBlur={handleChange}
                              multiline
                              rows={5}
                              fullWidth
                              variant="outlined"
                            />
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            key={values.desVIOfTrademark + "desVIOfTrademark"}
                          >
                            <TextField
                              error={Boolean(
                                touched.desVIOfTrademark &&
                                  errors.desVIOfTrademark
                              )}
                              helperText={
                                touched.desVIOfTrademark &&
                                errors.desVIOfTrademark
                              }
                              id="desVIOfTrademark"
                              label="Description of Trademark(in Vietnamese)*"
                              name="desVIOfTrademark"
                              defaultValue={values.desVIOfTrademark || ""}
                              onBlur={handleChange}
                              multiline
                              rows={5}
                              fullWidth
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <input
                              accept="image/*"
                              className={classes.input}
                              id="contained-button-file"
                              multiple
                              type="file"
                              onChange={onChange}
                            />
                            <label htmlFor="contained-button-file">
                              <Button
                                variant="contained"
                                color="primary"
                                component="span"
                                className={props.canEdit ? "" : classes.hide}
                                startIcon={<PhotoCamera />}
                              >
                                Upload Image
                              </Button>
                            </label>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            key={"grid" + formik.values.fileName}
                          >
                            {imagesPreview.map((image) => (
                              <img
                                src={image}
                                key={image}
                                alt="Img Preview"
                                width="auto"
                                height="120px"
                                style={{ marginRight: "8px", marginTop: "8px" }}
                              />
                            ))}
                          </Grid>
                        </Grid>
                      </DialogContent>
                    </fieldset>
                    <DialogActions>
                      <a
                        className={
                          imagesPreview.length > 0 &&
                          formik.values.fileName &&
                          images[0] === null
                            ? ""
                            : classes.hide
                        }
                        download={imagesPreview[0]}
                        href={imagesPreview[0]}
                      >
                        <Button color="primary" type="button">
                          Download Image
                        </Button>
                      </a>
                      <Button
                        color="primary"
                        type="submit"
                        className={props.canEdit ? "" : classes.hide}
                      >
                        Save Changed
                      </Button>
                      <Button
                        onClick={handleDetailTrademarkDialogClose}
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
          <Grid item xs={6} md={6} lg={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplicantDialogOpen}
            >
              Applicant
            </Button>
            <Dialog
              open={applicantDialogOpen}
              onClose={handleApplicantDialogClose}
              aria-labelledby="form-dialog-title"
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle onClose={handleApplicantDialogClose}>
                Applicant
              </DialogTitle>
              <Formik
                initialValues={{
                  applicants: formik.values.applicant || [],
                }}
                validationSchema={Yup.object().shape({
                  applicants: Yup.array()
                    .of(
                      Yup.object().shape({
                        name: Yup.string().required("Name is required"),
                        address: Yup.string().required("Address is required"),
                        country: Yup.string()
                          .nullable()
                          .required("Country is required"),
                      })
                    )
                    .min(1, "At least one applicant"),
                })}
                onSubmit={(values) => {
                  formik.setFieldValue("applicant", values.applicants);
                  setApplicantDialogOpen(false);
                  enqueueSnackbar("Save Applicant Success!", {
                    variant: "success",
                  });
                }}
              >
                {({ handleChange, setFieldValue, values, errors, touched }) => (
                  <Form>
                    <DialogContent dividers>
                      <Typography variant="h5">
                        {values.applicants.reduce(
                          (accumulator, currentValue) => {
                            return currentValue.isDeleted
                              ? accumulator
                              : accumulator + 1;
                          },
                          0
                        )}{" "}
                        Applicants
                      </Typography>
                      <FieldArray name="applicants">
                        {({ remove, push }) => (
                          <>
                            {values.applicants.length > 0 &&
                              values.applicants.map((applicant, index) => {
                                const name = `applicants.${index}.name`;
                                const address = `applicants.${index}.address`;
                                const country = `applicants.${index}.country`;
                                return (
                                  !applicant.isDeleted && (
                                    <Card
                                      elevation={3}
                                      className={classes.marginTop}
                                      key={index}
                                    >
                                      <fieldset
                                        disabled={!props.canEdit}
                                        className={classes.noBorder}
                                      >
                                        <CardContent>
                                          <TextField
                                            error={Boolean(
                                              getIn(touched, name) &&
                                                getIn(errors, name)
                                            )}
                                            helperText={
                                              getIn(touched, name) &&
                                              getIn(errors, name)
                                            }
                                            label="Applicant's Name*"
                                            name={name}
                                            value={applicant.name || ""}
                                            onChange={handleChange}
                                            variant="outlined"
                                            fullWidth
                                          />
                                          <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                              <TextField
                                                error={Boolean(
                                                  getIn(touched, address) &&
                                                    getIn(errors, address)
                                                )}
                                                helperText={
                                                  getIn(touched, address) &&
                                                  getIn(errors, address)
                                                }
                                                label="Address*"
                                                name={address}
                                                value={applicant.address || ""}
                                                onChange={handleChange}
                                                className={classes.marginTop}
                                                fullWidth
                                              />
                                            </Grid>
                                            <Grid item xs={6}>
                                              <DarkerDisabledAutocomplete
                                                value={applicant.country}
                                                disabled={!props.canEdit}
                                                onChange={(event, newValue) => {
                                                  setFieldValue(
                                                    country,
                                                    newValue
                                                  );
                                                }}
                                                options={countries}
                                                fullWidth
                                                className={classes.marginTop}
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    label="Country*"
                                                    error={Boolean(
                                                      getIn(touched, country) &&
                                                        getIn(errors, country)
                                                    )}
                                                    helperText={
                                                      getIn(touched, country) &&
                                                      getIn(errors, country)
                                                    }
                                                  />
                                                )}
                                              />
                                            </Grid>
                                          </Grid>
                                          {values.applicants.length > 1 && (
                                            <Button
                                              variant="contained"
                                              color="secondary"
                                              className={clsx(
                                                classes.deleteButton,
                                                {
                                                  [classes.hide]:
                                                    !props.canEdit,
                                                }
                                              )}
                                              onClick={() => {
                                                if (applicant.id) {
                                                  setFieldValue(
                                                    `applicants.${index}.isDeleted`,
                                                    true
                                                  );
                                                } else {
                                                  remove(index);
                                                }
                                              }}
                                            >
                                              Delete
                                            </Button>
                                          )}
                                        </CardContent>
                                      </fieldset>
                                    </Card>
                                  )
                                );
                              })}
                            <Button
                              color="primary"
                              variant="contained"
                              className={clsx(classes.marginTop, {
                                [classes.hide]: !props.canEdit,
                              })}
                              onClick={() =>
                                push({
                                  id: null,
                                  name: "",
                                  address: "",
                                  country: null,
                                  isDeleted: null,
                                })
                              }
                            >
                              Add More
                            </Button>
                          </>
                        )}
                      </FieldArray>
                      {errors.applicants && values.applicants.length === 0 && (
                        <Typography
                          variant="h6"
                          component="h6"
                          color="secondary"
                          className={classes.marginTop}
                        >
                          Must have at least 1 applicant
                        </Typography>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button
                        color="primary"
                        type="submit"
                        className={props.canEdit ? "" : classes.hide}
                      >
                        Save Changed
                      </Button>
                      <Button
                        onClick={handleApplicantDialogClose}
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
          <Grid item xs={6} key={formik.values.classDetailEN + "classDetailEN"}>
            <TextField
              error={Boolean(
                formik.touched.classDetailEN && formik.errors.classDetailEN
              )}
              helperText={
                formik.touched.classDetailEN && formik.errors.classDetailEN
              }
              id="classDetailEN"
              label="Detail of Class(in English)*"
              name="classDetailEN"
              defaultValue={formik.values.classDetailEN || ""}
              onBlur={formik.handleChange}
              multiline
              inputProps={{ readOnly: true }}
              rows={4}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} key={formik.values.classDetailVI + "classDetailVI"}>
            <TextField
              error={Boolean(
                formik.touched.classDetailVI && formik.errors.classDetailVI
              )}
              helperText={
                formik.touched.classDetailVI && formik.errors.classDetailVI
              }
              id="classDetailVI"
              label="Detail of Class(in Vietnamese)*"
              name="classDetailVI"
              defaultValue={formik.values.classDetailVI || ""}
              onBlur={formik.handleChange}
              multiline
              inputProps={{ readOnly: true }}
              rows={4}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <DarkerDisabledAutocomplete
              disabled={!props.canEdit}
              value={formik.values.country}
              onChange={(event, newValue) => {
                formik.setFieldValue("country", newValue);
              }}
              options={countries}
              fullWidth
              className={classes.marginTop}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country*"
                  error={Boolean(
                    formik.touched.country && formik.errors.country
                  )}
                  helperText={formik.touched.country && formik.errors.country}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <FormControl
              className={classes.formControl}
              fullWidth
              error={Boolean(formik.touched.poaId && formik.errors.poaId)}
            >
              <InputLabel id="power-of-attorney">Power Of Attorney*</InputLabel>
              <Select
                readOnly={!props.canEdit}
                labelId="power-of-attorney"
                value={formik.values.poaId || ""}
                onChange={(e) => {
                  formik.setFieldValue("poaId", e.target.value);
                  props.callbackChangePOAStatus(e.target.value);
                }}
                label="Country"
              >
                <MenuItem value={1}>Original document</MenuItem>
                <MenuItem value={2}>Copy document </MenuItem>
                <MenuItem value={3}>Submit later</MenuItem>
              </Select>
              <FormHelperText>
                {formik.touched.poaId && formik.errors.poaId}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePriorityDataDialogOpen}
            >
              Priority Data
            </Button>
            <Dialog
              open={priorityDataDialogOpen}
              onClose={handlePriorityDataDialogClose}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle onClose={handlePriorityDataDialogClose}>
                Priority Data
              </DialogTitle>
              <Formik
                initialValues={{
                  priorities: formik.values.priority || [],
                }}
                validationSchema={Yup.object().shape({
                  priorities: Yup.array().of(
                    Yup.object().shape({
                      priorityBasicId: Yup.number().required(
                        "Priority ID is required"
                      ),
                      number: Yup.string().required("Number is required"),
                      country: Yup.string()
                        .nullable()
                        .required("Country is required"),
                      date: Yup.date().nullable().required("Date is required"),
                    })
                  ),
                })}
                onSubmit={(values) => {
                  formik.setFieldValue("priority", values.priorities);
                  setPriorityDataDialogOpen(false);
                  enqueueSnackbar("Save Priority Data Success!", {
                    variant: "success",
                  });
                }}
              >
                {({ handleChange, setFieldValue, values, touched, errors }) => (
                  <Form>
                    <DialogContent dividers>
                      <Typography variant="h5">
                        {values.priorities.reduce(
                          (accumulator, currentValue) => {
                            return currentValue.isDeleted
                              ? accumulator
                              : accumulator + 1;
                          },
                          0
                        )}{" "}
                        Priorities Data
                      </Typography>
                      <FieldArray name="priorities">
                        {({ remove, push }) => (
                          <>
                            {values.priorities.length > 0 &&
                              values.priorities.map((priority, index) => {
                                const priorityBasicId = `priorities.${index}.priorityBasicId`;
                                const number = `priorities.${index}.number`;
                                const country = `priorities.${index}.country`;
                                const date = `priorities.${index}.date`;
                                return (
                                  !priority.isDeleted && (
                                    <Card
                                      elevation={3}
                                      className={classes.marginTop}
                                      key={index}
                                    >
                                      <CardContent>
                                        <Grid container spacing={3}>
                                          <Grid item xs={6}>
                                            <FormControl
                                              className={classes.formControl}
                                              fullWidth
                                              error={Boolean(
                                                getIn(
                                                  touched,
                                                  priorityBasicId
                                                ) &&
                                                  getIn(errors, priorityBasicId)
                                              )}
                                            >
                                              <InputLabel id="priority-basic">
                                                Priority Basic*
                                              </InputLabel>
                                              <Select
                                                readOnly={!props.canEdit}
                                                labelId="priority-basic"
                                                value={
                                                  priority.priorityBasicId || ""
                                                }
                                                onChange={(e) => {
                                                  setFieldValue(
                                                    priorityBasicId,
                                                    e.target.value
                                                  );
                                                }}
                                              >
                                                <MenuItem value={1}>
                                                  On the basis of earlier
                                                  application(s) filed in
                                                  Vietnam
                                                </MenuItem>
                                                <MenuItem value={2}>
                                                  On the basis of Paris
                                                  Convention
                                                </MenuItem>
                                                <MenuItem value={3}>
                                                  On the basis of other
                                                  Agreements
                                                </MenuItem>
                                              </Select>
                                              <FormHelperText>
                                                {getIn(
                                                  touched,
                                                  priorityBasicId
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    priorityBasicId
                                                  )}
                                              </FormHelperText>
                                            </FormControl>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <fieldset
                                              disabled={!props.canEdit}
                                              className={classes.noBorder}
                                            >
                                              <TextField
                                                error={Boolean(
                                                  getIn(touched, number) &&
                                                    getIn(errors, number)
                                                )}
                                                helperText={
                                                  getIn(touched, number) &&
                                                  getIn(errors, number)
                                                }
                                                label="Priority Number*"
                                                name={number}
                                                value={priority.number || ""}
                                                onChange={handleChange}
                                                className={classes.marginTop}
                                                fullWidth
                                              />
                                            </fieldset>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <DarkerDisabledAutocomplete
                                              disabled={!props.canEdit}
                                              value={priority.country}
                                              onChange={(event, newValue) => {
                                                setFieldValue(
                                                  country,
                                                  newValue
                                                );
                                              }}
                                              options={countries}
                                              fullWidth
                                              className={classes.marginTop}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  label="Country*"
                                                  error={Boolean(
                                                    getIn(touched, country) &&
                                                      getIn(errors, country)
                                                  )}
                                                  helperText={
                                                    getIn(touched, country) &&
                                                    getIn(errors, country)
                                                  }
                                                />
                                              )}
                                            />
                                          </Grid>
                                          <Grid item xs={6}>
                                            <MuiPickersUtilsProvider
                                              utils={MomentUtils}
                                            >
                                              <KeyboardDatePicker
                                                error={Boolean(
                                                  getIn(touched, date) &&
                                                    getIn(errors, date)
                                                )}
                                                helperText={
                                                  getIn(touched, date) &&
                                                  getIn(errors, date)
                                                }
                                                fullWidth
                                                disableToolbar
                                                readOnly={!props.canEdit}
                                                variant="inline"
                                                format="DD/MM/YYYY"
                                                label="Priority Date*"
                                                value={priority.date || null}
                                                onChange={(value) =>
                                                  setFieldValue(date, value)
                                                }
                                                KeyboardButtonProps={{
                                                  "aria-label": "change date",
                                                }}
                                                className={classes.marginTop}
                                              />
                                            </MuiPickersUtilsProvider>
                                          </Grid>
                                        </Grid>
                                        {values.priorities.length > 1 && (
                                          <Button
                                            variant="contained"
                                            color="secondary"
                                            className={clsx(
                                              classes.deleteButton,
                                              {
                                                [classes.hide]: !props.canEdit,
                                              }
                                            )}
                                            onClick={() => {
                                              if (priority.id) {
                                                setFieldValue(
                                                  `priorities.${index}.isDeleted`,
                                                  true
                                                );
                                              } else {
                                                remove(index);
                                              }
                                            }}
                                          >
                                            Delete
                                          </Button>
                                        )}
                                      </CardContent>
                                    </Card>
                                  )
                                );
                              })}

                            <Button
                              color="primary"
                              variant="contained"
                              className={clsx(classes.marginTop, {
                                [classes.hide]: !props.canEdit,
                              })}
                              onClick={() =>
                                push({
                                  id: null,
                                  trademarkId: null,
                                  priorityBasicId: "",
                                  number: "",
                                  date: null,
                                  country: null,
                                  isDeleted: null,
                                })
                              }
                            >
                              Add More
                            </Button>
                          </>
                        )}
                      </FieldArray>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        color="primary"
                        type="submit"
                        className={props.canEdit ? "" : classes.hide}
                      >
                        Save Changed
                      </Button>
                      <Button
                        onClick={handlePriorityDataDialogClose}
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
      </CardContent>
    </Card>
  );
};

export default TradeMarkItem;
