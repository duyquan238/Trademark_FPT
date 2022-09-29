import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { withStyles } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Badge from "@material-ui/core/Badge";
import styles from "./styles";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import CheckIcon from "@material-ui/icons/Check";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useSnackbar } from "notistack";
import { useLocation, useHistory } from "react-router-dom";
import { logout } from "../../redux/actions/userActions";
import axiosConfig from "../../commons/Apis/axiosConfig";
import SockJsClient from "react-stomp";
import InfiniteScroll from "react-infinite-scroll-component";
import { timeDiffFromNow } from "../../commons/ultils/DateUltil";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    maxHeight: 500,
    minHeight: 100,
    minWidth: 300,
  },
})((props) => (
  <Menu
    elevation={1}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    whiteSpace: "inherit",
  },
}))(MenuItem);

const StyledMoreItem = withStyles((theme) => ({
  root: {
    width: 300,
  },
}))(MenuItem);

const StyleListItemIcon = withStyles((theme) => ({
  root: {
    minWidth: 40,
  },
}))(ListItemIcon);

const StyleListItemText = withStyles((theme) => ({
  root: {
    width: 360,
    paddingRight: 36,
  },
}))(ListItemText);

const Header = (props) => {
  const { classes } = props;
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  //define my own state
  const [totalUnseenNoti, setTotalUnseenNoti] = useState();
  const [totalNoti, setTotalNoti] = useState();
  const [notiList, setNotiList] = useState([]);
  const [clientRef, setClientRef] = useState();

  const handleDrawerOpen = () => {
    props.modifierOpenState(true);
  };

  const [title, setTitle] = useState("");

  //mock get notifications
  const getNotifications = async (params = {}) => {
    try {
      let getURL = "/notify/get-all?";
      // delete property null or empty
      let filteredParams = Object.keys(params)
        .filter(
          (key) => params[key] !== null && params[key].toString().trim() !== ""
        )
        .reduce((obj, key) => {
          obj[key] = params[key];
          return obj;
        }, {});
        
      const response = await axiosConfig.get(getURL, {
        params: { ...filteredParams },
      });

      if (response.data.status.code === "200") {
        setTotalUnseenNoti(response.data.data.unSeen);
        setTotalNoti(response.data.data.total);
        setNotiList(response.data.data.data);
        setCurrentNotiPage(1);
      } else {
        enqueueSnackbar("Cannot load notification", { variant: "error" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [currentNotiPage, setCurrentNotiPage] = useState(1)
  const fetchMoreData = async () => {
    let size = 10 
    let getURL = "/notify/get-all?";
    await axiosConfig.get(getURL, {
      params: {page:currentNotiPage + 1, size:size},
    }).then(res => {
      setNotiList([...notiList, ...res.data.data.data])
      setCurrentNotiPage(currentNotiPage+1)
    }).catch(err => {
      console.log(err)
    });
  }

  useEffect(() => {
    if(!notiList.length) getNotifications({page:1, size:10});
    switch (location.pathname.split("/")[1]) {
      case "":
        setTitle("Home");
        break;
      case "create-trademark":
        setTitle("Create Trademark");
        break;
      case "trademark":
        setTitle("Trademark");
        break;
      case "manage-tasks":
        setTitle("Manage Tasks");
        break;
      case "manage-users":
        setTitle("Manage Users");
        break;
      case "statistical":
        setTitle("Statistical");
        break;
      case "create-user":
        setTitle("Add New User");
        break;
      case "my-account":
        setTitle("My Account");
        break;
      default:
        break;
    }
  }, [location.pathname]);
  //open notification menu
  const [notiAnchorEl, setNotiAnchorEl] = useState(null);
  const handleOpenNotiList = (event) => {
    setNotiAnchorEl(event.currentTarget);
  };
  const handleCloseNotiList = () => {
    setNotiAnchorEl(null);
  };

  //open more options menu
  const [moreAnchorEl, setMoreAnchorEl] = useState([]);
  const handleOpenMoreList = (event, item) => {
    let temp = [...moreAnchorEl];
    temp[item.id] = event.currentTarget;
    setMoreAnchorEl(temp);
  };
  const handleCloseMoreList = (item) => {
    // moreAnchorEl[item.id] = null
    let temp = [...moreAnchorEl];
    temp[item.id] = null;
    setMoreAnchorEl(temp);
  };

  //function to handle logout
  const logoutHandler = () => {
    dispatch(logout());
    history.push("/login");
    enqueueSnackbar("Logout successfully", {
      variant: "success",
    });
  };

  //All function to handle notifications
  const notificationClickHandler = (noti, index) => {
    if (!noti.seen) {
      let listNotifications = [...notiList];
      let item = { ...listNotifications[index] };
      item.seen = !item.seen;
      if(item.seen) {
        setTotalUnseenNoti(totalUnseenNoti - 1);
      }
      listNotifications[index] = item;
      setNotiList(listNotifications);
      // setTotalUnseenNoti(totalUnseenNoti - 1);
      changeSeenNoti(noti);
    }
    // axiosConfig.get(URL).then(res => {

    // }).catch(err => {})
    // // handleOpenNotiList(notiListDialog)
    if (noti.taskId && noti.redirect) {
      handleCloseNotiList();
      history.push(`/task/${noti.taskId}`);
    } else {
      enqueueSnackbar("This task is no longer available", { variant: "error" });
    }
  };
  const changeSeenNoti = async (noti) => {
    try {
      const response = await axiosConfig.post(
        "/notify/change-seen?id=" + noti.id
      );
      if (response.data.status.code === "200") {
        // getNotifications();
      } else if (response.data.status.code === "500") {
        enqueueSnackbar(response.data.data, { variant: "error" });
      } else {
        enqueueSnackbar("Somwething wrong!", { variant: "error" });
      }
    } catch (e) {
      console.error(e);
    }
  };
  const removeNoti = async (noti) => {
    try {
      const response = await axiosConfig.delete(
        "/notify/" + noti.id
      );
      if (response.data.status.code === "200") {
        // getNotifications();
      } else if (response.data.status.code === "500") {
        enqueueSnackbar(response.data.data, { variant: "error" });
      } else {
        enqueueSnackbar("Somwething wrong!", { variant: "error" });
      }
    } catch (e) {
      console.error(e);
    }
  };
  const markAsReadHandler = (noti, index) => {
    let listNotifications = [...notiList];
    let item = { ...listNotifications[index] };
    item.seen = !item.seen;
    if(item.seen) {
      setTotalUnseenNoti(totalUnseenNoti - 1);
    } else {
      setTotalUnseenNoti(totalUnseenNoti + 1);
    }
    listNotifications[index] = item;
    setNotiList(listNotifications);
    changeSeenNoti(noti);
    handleCloseMoreList(noti);
  };
  const onMessageHandler = (msg) => {
    // different date fix
    // msg.date.year = msg.date.year+ 1900;
    // msg.date.month = msg.date.month+ 1;
    // let tempNotiList = [msg, ...notiList];
    // setNotiList(tempNotiList);
    enqueueSnackbar('New notification: "' + msg.content + '"', {
      variant: "success",
    });
    // setTotalUnseenNoti(totalUnseenNoti + 1);
    getNotifications({page:1, size:10})
  };
  const removeNotiHandler = (noti, index) => {
    let listNotifications = [...notiList];
    let item = { ...listNotifications[index] };
    if(!item.seen) {
      setTotalUnseenNoti(totalUnseenNoti - 1);
    }
    listNotifications.splice(index, 1);
    setNotiList(listNotifications);
    removeNoti(noti)
  };
  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: props.open,
        })}
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: props.open,
            })}
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4">{title}</Typography>
          <div className={classes.logoWrapper}>
            <img src="/assets/images/logo.png" className={classes.logo} />
          </div>

          <IconButton
            aria-label="show new notifications"
            color="inherit"
            onClick={handleOpenNotiList}
          >
            <Badge
              // badgeContent={notiList.filter((item) => !item.seen).length}
              badgeContent={totalUnseenNoti}
              color="secondary"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <StyledMenu
            id="notification-menu"
            anchorEl={notiAnchorEl}
            keepMounted
            open={Boolean(notiAnchorEl)}
            onClose={handleCloseNotiList}
          >
            <Typography variant="h4" className={classes.notiTitle}>
              Notifications
            </Typography>
            <Divider />
            <div id = "noti-scroll" style = {{overflow : "auto", minHeight:"90px", maxHeight : "448px"}}>
            <InfiniteScroll
              dataLength={notiList.length}
              scrollableTarget = "noti-scroll"
              next={fetchMoreData}
              hasMore={notiList.length < totalNoti}
              loader={<div style = {{textAlign : "center"}}><CircularProgress
                          size={20}
                          style={{ marginLeft: 15, position: "relative" }}
                      /></div>}
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <i>{notiList.length > 0? "-- That is everything. --":"-- Empty --"}</i>
                </p>
              }
            >
              {notiList.map((item, index) => (
              <div key={index}>
                <div style={{ position: "relative" }}>
                  <StyledMenuItem
                    onClick={() => notificationClickHandler(item, index)}
                  >
                    <StyleListItemIcon>
                      {!item.seen && (
                        <FiberManualRecordIcon
                          fontSize="small"
                          color="primary"
                        />
                      )}
                    </StyleListItemIcon>
                    <StyleListItemText
                      disableTypography
                      primary={
                        <div>
                          <Typography
                            type="body2"
                            className={!item.seen ? classes.unSeenText : null}
                          >
                            {item.content}
                          </Typography>
                          <Typography
                            type="body2"
                            className={clsx(classes.timeNoti, {
                              [classes.unSeenText]: !item.seen,
                              [classes.unseenTimeNoti]: !item.seen,
                            })}
                          >
                            {timeDiffFromNow(item.date)}
                          </Typography>
                        </div>
                      }
                    />
                  </StyledMenuItem>
                  <IconButton
                    aria-label="log out"
                    color="inherit"
                    onClick={(e) => handleOpenMoreList(e, item)}
                    className={classes.moreBtn}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                  <StyledMenu
                    id={"more-menu" + item.id}
                    anchorEl={moreAnchorEl[item.id]}
                    keepMounted
                    open={Boolean(moreAnchorEl[item.id])}
                    onClose={() => handleCloseMoreList(item)}
                  >
                    <StyledMoreItem
                      onClick={() => markAsReadHandler(item, index)}
                    >
                      <StyleListItemIcon>
                        <CheckIcon />
                      </StyleListItemIcon>
                      <StyleListItemText
                        primary={!item.seen ? "Mark as Read" : "Mark as Unread"}
                      />
                    </StyledMoreItem>
                    <StyledMoreItem onClick={() => removeNotiHandler(item, index)}>
                      <StyleListItemIcon>
                        <RemoveCircleIcon />
                      </StyleListItemIcon>
                      <StyleListItemText primary="Remove this noti" />
                    </StyledMoreItem>
                  </StyledMenu>
                </div>
              </div>
              ))}
              
            </InfiniteScroll>
            </div>
          </StyledMenu>
          <IconButton
            aria-label="log out"
            color="inherit"
            onClick={logoutHandler}
          >
            <ExitToAppIcon />
          </IconButton>
          <div>
            {user && user.id && (
              <SockJsClient
                url={
                  process.env.REACT_APP_SERVER_ENDPOINT + "/notify-websocket"
                }
                topics={["/user/notify/task"]}
                headers={{ id: user.id }}
                onMessage={onMessageHandler}
                onConnect={() => {
                }}
                onDisconnect={() => {
                }}
                ref={(client) => {
                  setClientRef(client);
                }}
              />
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withStyles(styles)(Header);
