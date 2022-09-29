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

const NotFound = () => {
  const classes = useStyles();
  return (
    <Box className={classes.wrapper}>
      <Helmet>
        <title>404</title>
      </Helmet>
      <Container maxWidth="md">
        <Typography align="center" color="textPrimary" variant="h1">
          404: The page you are looking for isn’t here
        </Typography>
        <Typography align="center" color="textPrimary" variant="subtitle2">
          You either tried some shady route or you came here by mistake.
          Whichever it is, try using the navigation
        </Typography>
        <Box className={classes.img}>
          <img
            alt="Under development"
            src="/assets/images/undraw_page_not_found.svg"
            style={{
              marginTop: 50,
              display: "inline-block",
              maxWidth: "100%",
              width: 560,
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
