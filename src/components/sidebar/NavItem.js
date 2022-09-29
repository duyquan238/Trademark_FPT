import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Link, useLocation } from "react-router-dom";

const ListItem = withStyles({
  root: {
    color: "black",
    "& .MuiListItemIcon-root": {
      color: "#0000008a",
    },
    "&$selected": {
      color: "#1976d2",
      "& .MuiListItemIcon-root": {
        color: "#1976d2",
      },
      "& .MuiTypography-body1": {
        fontWeight: 500,
      },
    },
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  selected: {},
})(MuiListItem);

const NavItem = ({ href, icon: Icon, title }) => {
  const location = useLocation();
  const active = href === location.pathname;

  return (
    <Link to={href}>
      <ListItem button selected={active}>
        <ListItemIcon>{Icon && <Icon />}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
    </Link>
  );
};

export default NavItem;
