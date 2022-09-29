import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useParams } from "react-router-dom";
import axiosConfig from "../commons/Apis/axiosConfig";
import { useSnackbar } from "notistack";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

import SaveIcon from "@material-ui/icons/Save";
import PrintIcon from "@material-ui/icons/Print";
import DeleteIcon from "@material-ui/icons/Delete";
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: "absolute",
    "&.MuiSpeedDial-directionUp": {
      bottom: theme.spacing(2),
      right: theme.spacing(3),
    },
  },
}));

const actions = [
  { icon: <SaveIcon />, name: "Save", operation: "save" },
  { icon: <SaveIcon />, name: "Mark as Primary Version", operation: "chooseVersion" },
  { icon: <PrintIcon />, name: "Export", operation: "export" },
  { icon: <DeleteIcon />, name: "Delete", operation: "delete" },
  { icon: <LibraryBooksIcon />, name: "Version", operation: "version" },
];

const SimpleSpeedDial = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { trademarkId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  //call API delete trademark
  const deleteTrademark = async (trademarkId) => {
    try {
      const response = await axiosConfig.delete(
        `/trademark/delete/${trademarkId}`
      );
      if (response.data.status.code === "200") {
        enqueueSnackbar("Delete Trademark successfully", {
          variant: "success",
        });
        history.push("/");
      } else {
        enqueueSnackbar("Cannot delete Trademark", { variant: "error" });
      }
    } catch (e) {
      throw e;
    }
  };

  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const handleSpeedDialOpen = () => {
    setOpenSpeedDial(true);
  };
  const handleSpeedDialClose = () => {
    setOpenSpeedDial(false);
  };
  const [openDelete, setOpenDelete] = useState(false);

  const handleDialogDeleteClose = () => {
    setOpenDelete(false);
  };
  const handleDeleteTrademark = () => {
    deleteTrademark(trademarkId);
    setOpenDelete(false);
  };

  const handleClick = (e, operation) => {
    e.preventDefault();
    switch (operation) {
      case "save":
        props.submitBtn.click();
        break;
      case "chooseVersion":
        props.chooseVersionBtn.click();
        break;
      case "delete":
        setOpenDelete(true);
        break;
      case "export":
        props.exportBtn.click();
        break;
      case "version":
        props.versionBtn.click();
        break;
      default:
        return;
    }
    setOpenSpeedDial(false);
  };

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial example"
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        onClose={handleSpeedDialClose}
        onOpen={handleSpeedDialOpen}
        open={openSpeedDial}
        direction="up"
      >
        {actions.map(
          (action) =>
            (props.canEdit || action.operation !== "save") && 
            (props.trademarkId || action.operation !== "version") && 
            (props.trademarkId || action.operation !== "export") && 
            (props.canChooseVersion || action.operation !== "chooseVersion") && 
            (props.canDelete || action.operation !== "delete") && (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={(e) => handleClick(e, action.operation)}
                FabProps={{
                  size: "large",
                  style: { color: "#5664d2" },
                }}
              />
            )
        )}
      </SpeedDial>
      <Dialog
        open={openDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDialogDeleteClose}
      >
        <DialogTitle disableTypography={true}>
          <Typography variant="h4">
            Are you sure you want to delete this trademark?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This trademark will be deleted immediately. You can't undo this
            action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteTrademark} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SimpleSpeedDial;
