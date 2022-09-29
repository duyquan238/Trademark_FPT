import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import MoneyIcon from "@material-ui/icons/Money";
import { red } from "@material-ui/core/colors";

const TotalTrademark = (props) => {
  return (
    <Card {...props}>
      <CardContent>
        <Grid container spacing={3} justify="space-between">
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              TOTAL TRADEMARKS IN {props.year}
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {props.total}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              style={{
                backgroundColor: red[600],
                height: 56,
                width: 56,
              }}
            >
              <MoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          style={{
            paddingTop: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* <ArrowDownwardIcon style={{ color: red[900] }} />
          <Typography
            style={{
              color: red[900],
              marginRight: "4px",
            }}
            variant="body2"
          >
            12%
          </Typography>
          <Typography color="textSecondary" variant="caption">
            Since last month
          </Typography> */}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalTrademark;
