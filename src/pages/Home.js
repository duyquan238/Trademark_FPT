import React, { useRef } from "react";
import MetaData from "../components/MetaData";

import { Box, Container, Grid, Button } from "@material-ui/core";
import TotalTrademark from "../components/home/TotalTrademarkPanel";
import NotCompletedTrademark from "../components/home/NotCompletedTrademarkPanel";
import Transfer from "../components/home/Transfer";
import ListTrademark from "../components/home/ListTrademark";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  styleBtn: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
}));

const Home = () => {
  const classes = useStyles();
  const childRef = useRef();
  const onClickTotal = () => {
    childRef.current.filterTotal();
  };
  const onClickNotCompleted = () => {
    childRef.current.filterNotCompleted();
  };
  const onClickTranfer = () => {
    childRef.current.filterTranfer();
  };

  return (
    <Box style={{ paddingTop: 24 }}>
      <MetaData title={"Home"} />
      <Container maxWidth={false}>
        <Grid container spacing={3} justify="space-between">
          <Grid item xs={12} md={6} lg={4} xl={4}>
            <TotalTrademark onClick={onClickTotal} />
          </Grid>
          <Grid item xs={12} md={6} lg={4} xl={4}>
            <NotCompletedTrademark onClick={onClickNotCompleted} />
          </Grid>
          <Grid item xs={12} md={6} lg={4} xl={4}>
            <Transfer onClick={onClickTranfer} />
          </Grid>
        </Grid>
        <Box className={classes.styleBtn}>
          <Link to="/create-trademark">
            <Button
              color="primary"
              variant="contained"
              endIcon={<PlaylistAddIcon />}
            >
              Add Trademark
            </Button>
          </Link>
        </Box>
        <ListTrademark ref={childRef} />
      </Container>
    </Box>
  );
};

export default Home;
