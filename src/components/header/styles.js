import { SIDEBAR_WIDTH } from "../../commons/constants/styleConstant";

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  menuButton: {
    marginRight: theme.spacing(4),
  },
  logoWrapper: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
  },
  logo: {
    height: 64,
  },
  hide: {
    display: "none",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: SIDEBAR_WIDTH,
    width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  notiTitle: {
    paddingBottom: 8,
    paddingLeft: 8,
  },
  unSeenText: {
    color: "#172b4b",
    fontWeight: 500,
  },
  timeNoti: {
    fontSize: 13,
  },
  unseenTimeNoti: {
    color: "#5664d2",
  },
  moreBtn: {
    position: "absolute",
    top: 20,
    right: 0,
  },
});

export default styles;
