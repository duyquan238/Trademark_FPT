import { Avatar, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ViewCompactIcon from "@material-ui/icons/ViewCompact";
import { green } from "@material-ui/core/colors";
import axiosConfig from "../../commons/Apis/axiosConfig";
import { useEffect, useState } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";

const useStyles = makeStyles((theme) => ({
  red: {
    color: theme.palette.getContrastText(green[600]),
    backgroundColor: green[600],
    height: 56,
    width: 56,
  },
}));

const Transfer = (props) => {
  const classes = useStyles();
  useEffect(() => {
    getNumber();
  }, []);

  const [numberTotal, setNumberTotal] = useState(0);
  const getNumber = async () => {
    let params = {
      page: 1,
      size: 1,
      status: "9,10,11",
    };
    let getURL = "/trademark/get-all?";
    const { data } = await axiosConfig.get(getURL, { params });
    setNumberTotal(data.data.totalItems);
  };
  return (
    <Card sx={{ height: "100%" }} {...props}>
      <ButtonBase style={{ width: "100%" }}>
        <CardContent style={{ width: "100%" }}>
          <Grid container spacing={1} justify="space-around">
            <Grid item>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="h5"
                align="left"
              >
                Assigment - Renewal - Amendment
              </Typography>
              <Typography color="textPrimary" variant="h3" align="left">
                {numberTotal}
              </Typography>
            </Grid>
            <Grid item>
              <Avatar className={classes.red}>
                <ViewCompactIcon />
              </Avatar>
            </Grid>
          </Grid>
        </CardContent>
      </ButtonBase>
    </Card>
  );
};

export default Transfer;
