import React from "react";
import { Helmet } from "react-helmet";
import { Box, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((them) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
  },
  img: {
    textAlign: "center",
  },
}));

const Error = () => {
  const classes = useStyles();
  return (
    <Box className={classes.wrapper}>
      <Helmet>
        <title>Error Page</title>
      </Helmet>
      <Container maxWidth="md">
      <Box className={classes.img}>
          <img
            alt="Under development"
            src="/assets/images/Error.png"
            style={{
              marginTop: 50,
              display: "inline-block",
              maxWidth: "100%",
              width: 560,
            }}
          />
        </Box>
        <Typography align="center" color="textPrimary" variant="h1">
          Oops !!! Something went wrong... Please try again later !
        </Typography>
      </Container>
    </Box>
  );
};

export default Error;
