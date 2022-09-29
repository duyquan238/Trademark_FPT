import { Avatar, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ViewQuiltIcon from "@material-ui/icons/ViewQuilt";
import { purple } from "@material-ui/core/colors";
import axiosConfig from "../../commons/Apis/axiosConfig";
import { useEffect, useState } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  red: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    height: 56,
    width: 56,
  },
}));

const NotCompletedTrademark = (props) => {
  const classes = useStyles();
  const [numberNotCompleted, setNumberNotCompleted] = useState(0);
  useEffect(() => {
    getNumber();
  }, []);
  const getNumber = async () => {
    let params = {
      page: 1,
      size: 1,
      status: "1,2,3,4,5,6,7",
    };
    let getURL = "/trademark/get-all?";
    const { data } = await axiosConfig.get(getURL, { params });
    setNumberNotCompleted(data.data.totalItems);
  };
  return (
    <Card sx={{ height: "100%" }} {...props}>
      <ButtonBase style={{ width: "100%" }}>
        <CardContent style={{ width: "100%" }}>
          <Grid container spacing={3} justify="space-around">
            <Grid item>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="h5"
                align="left"
              >
                Not Completed Trademark
              </Typography>
              <Typography color="textPrimary" variant="h3" align="left">
                {numberNotCompleted}
              </Typography>
            </Grid>
            <Grid item>
              <Avatar className={classes.red}>
                <ViewQuiltIcon />
              </Avatar>
            </Grid>
          </Grid>
        </CardContent>
      </ButtonBase>
    </Card>
  );
};

export default NotCompletedTrademark;
