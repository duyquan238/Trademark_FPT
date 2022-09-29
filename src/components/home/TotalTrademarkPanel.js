import { Avatar, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ViewListIcon from "@material-ui/icons/ViewList";
import { red } from "@material-ui/core/colors";
import ButtonBase from "@material-ui/core/ButtonBase";
import axiosConfig from "../../commons/Apis/axiosConfig";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  red: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    height: 56,
    width: 56,
  },
}));

const TotalTrademark = (props) => {
  const classes = useStyles();
  const [numberTotal, setNumberTotal] = useState(0);
  useEffect(() => {
    getNumber();
  }, []);
  const getNumber = async () => {
    let params = {
      page: 1,
      size: 1,
    };
    let getURL = "/trademark/get-all?";
    const { data } = await axiosConfig.get(getURL, { params });
    setNumberTotal(data.data.totalItems);
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
                Total Trademark
              </Typography>
              <Typography color="textPrimary" variant="h3" align="left">
                {numberTotal}
              </Typography>
            </Grid>
            <Grid item>
              <Avatar className={classes.red}>
                <ViewListIcon />
              </Avatar>
            </Grid>
          </Grid>
        </CardContent>
      </ButtonBase>
    </Card>
  );
};

export default TotalTrademark;
