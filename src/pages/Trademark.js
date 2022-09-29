import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import TrademarkTab from "../components/trademark/trademarkTab/TrademarkTab";
import Renewal from "../components/trademark/renewalTab/Renewal";
import Assignment from "../components/trademark/assignmentTab/Assignment";
import Amendment from "../components/trademark/amendmentTab/Amendment";

import axiosConfig from "../commons/Apis/axiosConfig";
import Typography from "@material-ui/core/Typography";
import CachedIcon from "@material-ui/icons/Cached";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "../components/DialogTitle";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import VisibilityIcon from "@material-ui/icons/Visibility";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Formik, Form } from "formik";
import Iframe from "react-iframe";
import * as Yup from "yup";
import Loader from "../components/Loader";

import MetaData from "../components/MetaData";
import { dateFormat2 } from "../commons/ultils/DateUltil";
import { useHistory } from "react-router";
import { AppStatus } from "../commons/constants/trademarkStatusConstants";

function TabPanel(props) {
  const { children, value, tabIndex, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== tabIndex}
      id={`scrollable-auto-tabpanel-${tabIndex}`}
      aria-labelledby={`scrollable-auto-tab-${tabIndex}`}
      {...other}
      style={{ paddingTop: 24 }}
    >
      {value === tabIndex && <Box>{children}</Box>}
    </div>
  );
}
function a11yProps(tabIndex) {
  return {
    id: `scrollable-auto-tab-${tabIndex}`,
    "aria-controls": `scrollable-auto-tabpanel-${tabIndex}`,
  };
}

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

const Trademark = () => {
  const { trademarkId } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const classes = useStyles();
  const history = useHistory();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [document_, setDocument_] = useState("");
  const [fileExport, setFileExport] = useState(null);
  const [isCheckExport, setIsCheckExport] = useState(false);
  const [exportBtn, setExportBtn] = useState();
  const [checkExportData, setCheckExportData] = useState("");
  const [trademarkVersions, setTrademarkVersions] = useState([]);

  useEffect(() => {
    getHistory();
  }, []);
  const getHistory = async () => {
    if (trademarkId) {
      let URL = "trademark/history/" + trademarkId + "/get-all";
      await axiosConfig
        .get(URL)
        .then((response) => {
          if (response.data.status.code === "200")
            setTrademarkVersions(response.data.data.data);
        })
        .catch(() => {});
    }
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [trademark, setTrademark] = useState(null);
  const [iframe, setIframe] = useState(null);
  const [timeOutMsg, setTimeOutMsg] = useState("");
  const getTrademarkData = (trademark) => {
    setTrademark(trademark);
  };
  const ifr = React.createRef();
  // select document export
  const onSelectDocument = async (idTrademark, typeId) => {
    setTimeOutMsg("");
    setIsCheckExport(false);
    try {
      setFileExport(null);
      const response = await axiosConfig.post(
        `/trademark/check-export/${idTrademark}/${typeId}`
      );
      if (response.data.status.code === "200") {
        setCheckExportData(response.data.data);
        setFileExport(
          `https://docs.google.com/gview?url=` +
            process.env.REACT_APP_API_ENDPOINT +
            `/trademark/export/${idTrademark}/${typeId}&embedded=true`
        );
        let loaded = false;
        let embedCheck;
        let timeoutCheck;
        timeoutCheck = setTimeout(() => {
          clearInterval(embedCheck);
          setTimeOutMsg(
            "Preview is not available. Please reload or export instead."
          );
          setIsCheckExport(true);
        }, 10000);
        clearInterval(embedCheck);
        embedCheck = setInterval(function () {
          try {
            if (
              document.getElementById("ifr").contentWindow.document.body
                .innerHTML.length == 0
            ) {
              loaded = false;
              setFileExport(null);
              setFileExport(
                `https://docs.google.com/gview?url=` +
                  process.env.REACT_APP_API_ENDPOINT +
                  `/trademark/export/${idTrademark}/${typeId}&embedded=true`
              );
            } else {
            }
          } catch (err) {
            loaded = true;
            setIsCheckExport(true);
          }

          if (loaded) {
            clearInterval(embedCheck);
            clearTimeout(timeoutCheck);
            setTimeOutMsg("");
          }
        }, 3000);

        // setInterval(() => {
        //   setFileExport(null);
        //   console.log("acv")

        //   setFileExport(
        //     `https://docs.google.com/gview?url=`+process.env.REACT_APP_API_ENDPOINT+`/trademark/export/${idTrademark}/${typeId}&embedded=true`
        //   );
        //   setIsCheckExport(true);
        // }, 5000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const callbackOpenExport = () => {
    if (exportBtn) {
      exportBtn.click();
    }
  };

  const isEnableTabs = (acceptStatus) => {
    let rs = trademark && acceptStatus.includes(trademark.application.status);
    return rs;
  };

  const [viewVersionDialogOpen, setViewVersionDialogOpen] = useState(false);
  const handleViewVersionDialogOpen = () => {
    setViewVersionDialogOpen(true);
  };

  const handleViewVersionDialogClose = () => {
    setViewVersionDialogOpen(false);
  };

  const handleViewClick = (index) => {
    // handle open trademark history
    history.push(
      `/trademark/${trademarkId}/version/${trademarkVersions[index].versionId}`
    );
    handleViewVersionDialogClose();
  };

  const [versionBtn, setVersionBtn] = useState();

  //Data Table Version
  const columns = [
    { id: "historyId", label: "Version ID" },
    { id: "time", label: "Created Time" },
    { id: "processedBy", label: "Processed By" },
    { id: "status", label: "Status" },
    { id: "view", label: "View" },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100%",
      }}
    >
      <MetaData title={"Trademark"} />
      <AppBar position="static" color="default">
        <Tabs
          value={tabValue}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Trademark" {...a11yProps(0)} />
          <Tab
            label="Renewal"
            disabled={!isEnableTabs([8, 11])}
            {...a11yProps(1)}
          />
          <Tab
            label="Amendment"
            disabled={!isEnableTabs([8, 10])}
            {...a11yProps(2)}
          />
          <Tab
            label="Assignment"
            disabled={!isEnableTabs([8, 9])}
            {...a11yProps(3)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} tabIndex={0}>
        <TrademarkTab
          callbackFetchTrademark={getTrademarkData}
          exportBtn={exportBtn}
          versionBtn={versionBtn}
        />
      </TabPanel>
      {!!trademark && (
        <>
          <TabPanel value={tabValue} tabIndex={1}>
            <Renewal
              trademark={trademark}
              callbackOpenExport={callbackOpenExport}
            />
          </TabPanel>
          <TabPanel value={tabValue} tabIndex={2}>
            <Amendment
              trademark={trademark}
              callbackOpenExport={callbackOpenExport}
            />
          </TabPanel>
          <TabPanel value={tabValue} tabIndex={3}>
            <Assignment
              trademark={trademark}
              callbackOpenExport={callbackOpenExport}
            />
          </TabPanel>
        </>
      )}

      <Button
        ref={(btn) => {
          setExportBtn(btn);
        }}
        onClick={() => {
          setExportDialogOpen(true);
          setTimeOutMsg("");
        }}
        className={classes.hide}
      />
      <Dialog
        open={exportDialogOpen}
        keepMounted
        onClose={() => {
          setExportDialogOpen(false);
        }}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle
          onClose={() => {
            setExportDialogOpen(false);
            setDocument_("");
            setFileExport(null);
            setCheckExportData("");
          }}
        >
          Export Document
        </DialogTitle>
        <Formik
          initialValues={{
            typeOfDocument: "",
          }}
          validationSchema={Yup.object().shape({
            typeOfDocument: Yup.number().required("Please select document"),
          })}
          onSubmit={(values) => {
            window.open(
              process.env.REACT_APP_API_ENDPOINT +
                `/trademark/export/${trademarkId}/${document_}`
            );
          }}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <DialogContent>
                <FormControl
                  fullWidth
                  error={Boolean(
                    touched.typeOfDocument && errors.typeOfDocument
                  )}
                >
                  <InputLabel id="demo-simple-select-label">
                    Select Document
                  </InputLabel>
                  <Select
                    value={document_}
                    onChange={(e) => {
                      setDocument_(e.target.value);
                      setFieldValue("typeOfDocument", e.target.value);
                      onSelectDocument(trademarkId, e.target.value);
                    }}
                  >
                    <MenuItem value={1}>Advise Decision</MenuItem>
                    <MenuItem value={2}>Advise Filing</MenuItem>
                    <MenuItem value={3}>Advise Grant</MenuItem>
                    <MenuItem value={4}>Application</MenuItem>
                    {/* <MenuItem value={5}>Certificate</MenuItem> */}
                    <MenuItem value={5}>Granted</MenuItem>
                    {/* <MenuItem value={6}>Decision</MenuItem> */}
                    {/* <MenuItem value={8}>Notice of Allowance</MenuItem> */}
                    <MenuItem value={6}>TO KHAI</MenuItem>
                  </Select>
                  <FormHelperText>
                    {touched.typeOfDocument && errors.typeOfDocument}
                  </FormHelperText>
                  <Typography
                    variant="h6"
                    component="h6"
                    className={classes.warning}
                  >
                    {checkExportData}
                  </Typography>
                  <Typography
                    variant="h5"
                    component="h5"
                    className={classes.warning}
                  >
                    {timeOutMsg}
                  </Typography>
                  {!isCheckExport && document_ !== "" && <Loader />}
                </FormControl>
                {fileExport && (
                  <Button
                    color="primary"
                    type="Button"
                    variant="contained"
                    endIcon={<CachedIcon />}
                    className={classes.reloadBtn}
                    onClick={() => {
                      let temp = fileExport;
                      setIsCheckExport(false);
                      setTimeOutMsg("");
                      let loaded = false;
                      let embedCheck;
                      let timeoutCheck;
                      timeoutCheck = setTimeout(() => {
                        clearInterval(embedCheck);
                        setTimeOutMsg(
                          "Preview is not available. Please reload or export instead."
                        );
                        setIsCheckExport(true);
                      }, 10000);
                      clearInterval(embedCheck);
                      embedCheck = setInterval(function () {
                        try {
                          if (
                            document.getElementById("ifr").contentWindow
                              .document.body.innerHTML.length == 0
                          ) {
                            loaded = false;
                            setFileExport(null);
                            setFileExport(temp);
                          } else {
                          }
                        } catch (err) {
                          loaded = true;
                          setIsCheckExport(true);
                        }

                        if (loaded) {
                          clearInterval(embedCheck);
                          clearTimeout(timeoutCheck);
                          setTimeOutMsg("");
                        }
                      }, 2000);
                    }}
                  >
                    Reload
                  </Button>
                )}
                {fileExport && (
                  //<FileViewer fileType={'docx'} filePath={fileExport} />
                  // <iframe id="iframe" src={fileExport} width={800} height={900}/>
                  // <Iframe  url={fileExport} width="100%" height="650px" />
                  <iframe
                    id="ifr"
                    ref={(ref) => setIframe(ref)}
                    src={fileExport}
                    width="100%"
                    height="650px"
                  ></iframe>
                )}
              </DialogContent>
              <DialogActions>
                <Button color="primary" type="submit" disabled={!isCheckExport}>
                  Export
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Button
        variant="contained"
        ref={(btn) => setVersionBtn(btn)}
        className={classes.hide}
        color="primary"
        onClick={handleViewVersionDialogOpen}
      >
        View Version Trademark
      </Button>
      <Dialog
        open={viewVersionDialogOpen}
        onClose={handleViewVersionDialogClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle onClose={handleViewVersionDialogClose}>
          List of Trademark's Versions
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
                {trademarkVersions.map((item, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{item.versionId}{trademarkVersions.length === index+1 ? " (current)":""}</StyledTableCell>
                    <StyledTableCell>
                      {dateFormat2(item.createdDate, "DD-MM-YYYY H:mm:ss")}
                    </StyledTableCell>
                    <StyledTableCell>{item.processedBy}</StyledTableCell>
                    <StyledTableCell>{AppStatus[item.status]}</StyledTableCell>
                    <StyledTableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled = {trademarkVersions.length === index+1}
                        endIcon={<VisibilityIcon />}
                        onClick={() => {
                          handleViewClick(index);
                        }}
                      >
                        View
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewVersionDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Trademark;
