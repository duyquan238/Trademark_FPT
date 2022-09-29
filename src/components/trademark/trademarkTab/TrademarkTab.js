import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { Prompt } from "react-router";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import axiosConfig from "../../../commons/Apis/axiosConfig";
import { GET_TRADEMARK_SUCCESS } from "../../../commons/constants/trademarkConstants";

import {
  createTrademark,
  updateTrademark,
  clearErrors,
} from "../../../redux/actions/trademarkAction";
import {
  INIT_TRADEMARK_VALUES,
  CREATE_TRADEMARK_RESET,
  UPDATE_TRADEMARK_RESET,
} from "../../../commons/constants/trademarkConstants";

import { Grid, Container } from "@material-ui/core";
import Button from "@material-ui/core/Button";

import AgentInfo from "./AgentInfo";
import TradeMarkItem from "./TradeMarkItem";
import Application from "./application/Application";
import SimpleSpeedDial from "../../SimpleSpeedDial";
import Loader from "../../Loader";

import { calTrademarkStatus } from "../../../commons/ultils/trademarkUtil";
import { stringToBoolean } from "../../../commons/ultils/ConvertUltil";

const useStyles = makeStyles((theme) => ({
  reloadBtn: {
    float: "right",
    marginBottom: theme.spacing(1),
  },
  hide: {
    display: "none",
  },
  warning: {
    color: "#f9a825",
  },
  noBorder: {
    border: 0,
  },
}));

const TrademarkTab = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [trademarkStringData, setTrademarkStringData] = useState("");
  const [instructionDate, setInstructionDate] = useState("1900-01-01");
  const { trademarkId, versionId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  //define state
  const [hasData, setHasData] = useState(false);
  const [submitBtn, setSubmitBtn] = useState();
  const [chooseVersionBtn, setChooseVersionBtn] = useState();

  const [statusPOA, setStatusPOA] = useState("");
  const callbackChangePOAStatus = (status) => {
    if (status === 1) {
      setStatusPOA(20);
    } else {
      setStatusPOA(10);
    }
  };

  //call Redux state
  const {
    error: createTrademarkErr,
    loading: createLoading,
    code: createCode,
  } = useSelector((state) => state.createTrademark);
  const {
    message,
    error: updateTrademarkErr,
    loading: updateLoading,
    code: updateCode,
  } = useSelector((state) => state.updateTrademark);

  //define function here
  const handleInputFieldRequired = () => {
    if (!formik.values.agent.address) {
      enqueueSnackbar("Agent's Address is required!", {
        variant: "warning",
      });
    }
    if (
      !formik.values.listOfInstructor ||
      formik.values.listOfInstructor.length === 0
    ) {
      enqueueSnackbar("Instructor's Information is required", {
        variant: "warning",
      });
    }
    if (
      !formik.values.typeId ||
      !formik.values.colorEn ||
      !formik.values.descEn ||
      !formik.values.colorVi ||
      !formik.values.descVi
    ) {
      enqueueSnackbar("Detail of Trademark is required", {
        variant: "warning",
      });
    }
    if (!formik.values.applicant || formik.values.applicant.length === 0) {
      enqueueSnackbar("Applicant is required!", {
        variant: "warning",
      });
    }
  };
  //call API to get Trademark
  const fetchTrademark = async (id, source) => {
    try {
      const response = await axiosConfig.get(`/trademark/${id}`, {
        cancelToken: source.token,
      });
      if (response.data.status.code === "200") {
        formik.setValues(response.data.data);
        setInstructionDate(response.data.data.instructionDate);
        setTrademarkStringData(JSON.stringify(response.data.data));
        setHasData(true);
        setCanEdit(calEditable(response.data.data));
        setCanDelete(calDelete());
        dispatch({
          type: GET_TRADEMARK_SUCCESS,
          payload: response.data.data,
        });
        props.callbackFetchTrademark(response.data.data);
      } else {
        enqueueSnackbar("Trademark not found", { variant: "error" });
        history.push("/");
      }
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log("Caught cancel");
      } else {
        throw e;
      }
    }
  };

  const fetchTrademarkVersion = async (versionId, source) => {
    try {
      const response = await axiosConfig.get(
        `/trademark/history/${versionId}`,
        { cancelToken: source.token }
      );
      if (response.data.status.code === "200") {
        formik.setValues(response.data.data);
        setHasData(true);
        setCanEdit(false);
        setCanDelete(false);
        props.callbackFetchTrademark(response.data.data);
      } else {
        enqueueSnackbar("Trademark not found", { variant: "error" });
        history.push("/");
      }
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log("Caught cancel");
      } else {
        throw e;
      }
    }
  };

  useEffect(() => {
    let source = axios.CancelToken.source();
    if (versionId) {
      fetchTrademarkVersion(versionId, source);
    } else if (trademarkId) {
      fetchTrademark(trademarkId, source);
    }
    if (createCode === "200") {
      history.push("/");
      enqueueSnackbar("Create Trademark Success!", { variant: "success" });
      dispatch({ type: CREATE_TRADEMARK_RESET });
    } else if (createCode !== undefined && createCode !== "") {
      enqueueSnackbar("Create Trademark Error!", { variant: "error" });
      dispatch({ type: CREATE_TRADEMARK_RESET });
    }
    if (createTrademarkErr) {
      enqueueSnackbar("Cannot save trademark!", { variant: "error" });
      dispatch(clearErrors());
    }
    if (updateCode === "200") {
      dispatch({ type: UPDATE_TRADEMARK_RESET });
      history.push("/");
      enqueueSnackbar("Update Trademark Success!", { variant: "success" });
      return;
    } else if (updateCode !== undefined && updateCode !== "") {
      dispatch({ type: UPDATE_TRADEMARK_RESET });
      enqueueSnackbar(message, { variant: "error" });
      return;
    }
    if (updateTrademarkErr) {
      enqueueSnackbar("Cannot update trademark!", { variant: "error" });
      dispatch(clearErrors());
    }
    return () => {
      source.cancel();
    };
  }, [
    dispatch,
    enqueueSnackbar,
    createTrademarkErr,
    createCode,
    updateTrademarkErr,
    updateCode,
    history,
    trademarkId,
    versionId,
    user.id,
  ]);

  //compare Data

  const compareDataUpdate = () => {
    return trademarkStringData === JSON.stringify(formik.values);
  };

  const validationSchema = Yup.object().shape({
    agent: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      address: Yup.string().required("Address is required"),
      yourRef: Yup.string().required("YourRef is required"),
    }),
    typeId: Yup.number().required("Type of Trademark is required"),
    descEn: Yup.string().required("Description EN is required"),
    descVi: Yup.string().required("Description VI is required"),
    colorEn: Yup.string().required("Color EN is required"),
    colorVi: Yup.string().required("Color VI is required"),
    listOfInstructor: Yup.array().min(1, "Must have at least one instructor"),
    applicant: Yup.array().min(1, "Must have at least one applicant"),
    instructionDate: Yup.date()
      .nullable()
      .typeError("Invalid Date")
      .required("Instruction Date is required"),
    name: Yup.string().required("Trademark Name is required"),
    classList: Yup.string().required("Class is required"),
    country: Yup.string().nullable().required("Country is required"),
    poaId: Yup.number().required("Power Of Attorney"),
    classDetailEN: Yup.string().required(
      "Detail of Class (in English) is required"
    ),
    classDetailVI: Yup.string().required(
      "Detail of Class (in Vietnamese) is required"
    ),
    application: Yup.object().shape({
      number: Yup.string()
        .nullable()
        .matches(/^4-[0-9]{4}-[0-9-]{5}$/, "Must be in format: 4-XXXX-XXXXX"),
      fillingDate: Yup.date()
        .nullable()
        .typeError("Invalid Date")
        .min(new Date(instructionDate), "Date cannot before Instruction Date")
        .max(new Date(), "Date cannot be in future"),
      acceptanceNumber: Yup.string()
        .nullable()
        .matches(
          /^[0-9]{6,8}$/,
          "Must be a number and length from 6 to 8 digits"
        ),
      allowanceNumber: Yup.string()
        .nullable()
        .matches(
          /^[0-9]{6,8}$/,
          "Must be a number and length from 6 to 8 digits"
        ),
      registerNumber: Yup.string()
        .nullable()
        .matches(
          /^[0-9]{6,8}$/,
          "Must be a number and length from 6 to 8 digits"
        ),
      decisionNumber: Yup.string()
        .nullable()
        .matches(
          /^[0-9]{6,8}$/,
          "Must be a number and length from 6 to 8 digits"
        ),
    }),
  });

  const normalizeFormik = (values) => {
    // normalize isInternational
    values.application.isInternational = stringToBoolean(
      values.application.isInternational
    );
  };

  const calEditable = (data) => {
    let preventEditStatus = [8, 9, 10, 11];
    if (
      data &&
      data.application.status &&
      preventEditStatus.indexOf(data.application.status) !== -1
    ) {
      return false;
    }
    if (data.processedBy && user.id !== data.processedBy) {
      return false;
    }

    return true;
  };
  const calDelete = () => {
    let listRoleAcceptDelete = [1];
    if (listRoleAcceptDelete.includes(user.role.id)) {
      return true;
    }
    return false;
  };
  const [canEdit, setCanEdit] = useState(true);
  const [canDelete, setCanDelete] = useState(false);

  //define formik
  const formik = useFormik({
    initialValues: INIT_TRADEMARK_VALUES,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      normalizeFormik(values);
      values.application.status = calTrademarkStatus(values);
      if (!trademarkId) {
        values.createdBy = user.id;
        values.processedBy = user.id;
      }
      const formData = new FormData();
      if (values.file !== undefined && values.file !== null) {
        formData.set("file", values.file);
      }
      formData.set("data", JSON.stringify(values));
      //call API action
      if (trademarkId) {
        dispatch(updateTrademark(formData));
      } else {
        dispatch(createTrademark(formData));
        resetForm();
      }
    },
  });

  const handleChooseVersion = async () => {
    let URL = "trademark/restore?restore_id=" + versionId;
    await axiosConfig
      .post(URL)
      .then((response) => {
        if (response.data.status.code === "200") {
          history.push(`/trademark/${trademarkId}`);
          enqueueSnackbar("Apply Trademark's version successfully!", {
            variant: "success",
          });
        } else {
          enqueueSnackbar("Apply Trademark's version fail!", {
            variant: "error",
          });
        }
      })
      .catch(() => {
        enqueueSnackbar("Apply Trademark's version fail!", {
          variant: "error",
        });
      });
  };

  return (
    <Container maxWidth={false}>
      {(versionId || trademarkId) && !hasData ? (
        <Loader />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Button
            ref={(btn) => setSubmitBtn(btn)}
            type="submit"
            onClick={handleInputFieldRequired}
            className={classes.hide}
          />
          <Button
            ref={(btn) => setChooseVersionBtn(btn)}
            onClick={handleChooseVersion}
            type="button"
            className={classes.hide}
          />

          {createLoading || updateLoading ? (
            <Loader />
          ) : (
            <fieldset disabled={!canEdit} className={classes.noBorder}>
              <Prompt
                when={
                  formik.dirty &&
                  formik.submitCount === 0 &&
                  !compareDataUpdate() &&
                  !versionId
                }
                message="Are you sure you want to leave? You have with unsaved changes."
              />
              <Grid container spacing={3}>
                <Grid item xs={12} lg={4}>
                  <AgentInfo formik={formik} canEdit={canEdit} />
                </Grid>
                <Grid item xs={12} lg={8}>
                  <TradeMarkItem
                    formik={formik}
                    callbackChangePOAStatus={callbackChangePOAStatus}
                    canEdit={canEdit}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={12}
                  className={!trademarkId && !versionId ? classes.hide : ""}
                >
                  <Application
                    formik={formik}
                    status={statusPOA}
                    canEdit={canEdit}
                  />
                </Grid>
              </Grid>
            </fieldset>
          )}
          {((user.id && formik.values.processedBy) || !trademarkId) && (
            <SimpleSpeedDial
              submitBtn={submitBtn}
              exportBtn={props.exportBtn}
              versionBtn={props.versionBtn}
              canEdit={canEdit}
              canDelete={canDelete}
              canChooseVersion={
                !!versionId && user.id === formik.values.processedBy
              }
              chooseVersionBtn={chooseVersionBtn}
              trademarkId={trademarkId}
            />
          )}
        </form>
      )}
    </Container>
  );
};

export default TrademarkTab;
