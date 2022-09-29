import { SIDEBAR_WIDTH } from "../../commons/constants/styleConstant";
import { deepOrange, deepPurple } from '@material-ui/core/colors';
const styles = (theme) => ({
  drawer: {
    width: SIDEBAR_WIDTH,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  drawerOpen: {
    width: SIDEBAR_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(8),
    },
  },
  avaContainer : {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: '8px 12px'
  },
  avatar: {
    width: 36,
    height: 36,
  },
  avatarTitle: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 4,
    paddingLeft: 26,
    maxWidth: 170
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
});

export default styles;
