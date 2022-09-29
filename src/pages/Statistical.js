import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import MetaData from "../components/MetaData";
import TrademarkChart from "../components/statistical/TrademarkChart";
import TimeCompleteTrademarkChartChart from "../components/statistical/TimeCompleteTrademarkChart";
import TaskChart from "../components/statistical/TaskChart";
import UserList from "../components/statistical/UserList";

const Statistical = () => {
  return (
    <Box style={{ paddingTop: 24 }}>
      <MetaData title={"Statistical"} />
      <Container maxWidth={false}>
        <Grid container spacing={5}>
          <Grid item xs={8}>
            <TimeCompleteTrademarkChartChart />
          </Grid>
          <Grid item xs={4}>
            <TaskChart />
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <TrademarkChart />
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={8}>
            <UserList />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Statistical;
