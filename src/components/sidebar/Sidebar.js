import React from "react";
import { withStyles } from "@material-ui/core";
import clsx from "clsx";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AssessmentIcon from "@material-ui/icons/Assessment";
import Avatar from "@material-ui/core/Avatar";

import Typography from "@material-ui/core/Typography";

import styles from "./styles";
import NavItem from "./NavItem";

import { useSelector } from "react-redux";

const items = [
  {
    href: "/",
    icon: HomeIcon,
    title: "Home",
    displayRole: [1, 2, 3],
  },
  {
    href: "/manage-tasks",
    icon: InboxIcon,
    title: "Manage Tasks",
    displayRole: [1, 2, 3],
  },
  {
    href: "/manage-users",
    icon: PeopleIcon,
    title: "Manage Users",
    displayRole: [1],
  },
  {
    href: "/statistical",
    icon: AssessmentIcon,
    title: "Statistical",
    displayRole: [1],
  },
  {
    href: "/my-account",
    icon: AccountBoxIcon,
    title: "My Account",
    displayRole: [1, 2, 3],
  },
];

const Sidebar = (props, theme) => {
  const { classes } = props;
  const { user } = useSelector((state) => state.auth);
  const handleDrawerClose = () => {
    props.modifierOpenState(false);
  };
  const getFirstLetterAva = (name) => {
    if (name) {
      let firstName = name.split(" ");
      return firstName[firstName.length - 1].split("")[0].toUpperCase();
    } else {
      return "";
    }
  };
  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: props.open,
        [classes.drawerClose]: !props.open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: props.open,
          [classes.drawerClose]: !props.open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <Box className={classes.avaContainer}>
        <Avatar
          aria-label="recipe"
          className={clsx(
            classes.avatar,
            user && user.id % 2 === 0 ? classes.orange : classes.purple
          )}
        >
          {getFirstLetterAva(user.name || "#")}
        </Avatar>
        <Box className={classes.avatarTitle}>
          <Typography color="textPrimary" variant="h5" noWrap={true}>
            {user.name}
          </Typography>
          <Typography color="textSecondary" variant="h6">
            {user.role.name}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {items.map((item, index) =>
          item.displayRole.includes(user.role.id) ? (
            <NavItem
              href={item.href}
              key={index}
              title={item.title}
              icon={item.icon}
            />
          ) : (
            <div key={index}></div>
          )
        )}
      </List>
      <Divider />
    </Drawer>
  );
};

export default withStyles(styles)(Sidebar);
