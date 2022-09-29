import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import axiosConfig from "../../commons/Apis/axiosConfig";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

const useStyles = makeStyles(() => ({
  dividerStyle: {
    marginTop: 8,
    marginBottom: 8,
  },
  header: {
    width: "120px",
  },
}));

const getMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MUIDataTable: {
        root: {
          backgroundColor: "#FF000",
        },
        paper: {},
        liveAnnounce: {
          position: "relative",
        },
      },
      MUIDataTableBodyCell: {
        root: {},
      },
    },
  });

const UserList = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [userData, setUserData] = useState();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const handleChangeYear = (e) => {
    let value = e.target.value;
    let _month = parseInt(value);
    setMonth(_month);
  };

  //Call API to get trademarks
  const loadUserData = async (month, year) => {
    try {
      const response = await axiosConfig.get(
        `dashboard/report-user?month=${month}&year=${year}`
      );
      if (response.data.status.code === "200") {
        setUserData(response.data.data);
      } else if (response.data.status.code === "500") {
        enqueueSnackbar(response.data.data, { variant: "error" });
      } else {
        enqueueSnackbar("Cannot Load User", { variant: "error" });
      }
    } catch (e) {
      console.error(e);
    }
  };
  const toDataList = (user) => {
    return [user.id, user.username, user.total];
  };

  const sortByTasks = (item1, item2) => {
    return item2.total - item1.total;
  };

  const columns = [
    {
      name: "id",
      label: "User ID",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "username",
      label: "Username",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "numberOfTask",
      label: "Number of Task",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];

  useEffect(() => {
    loadUserData(month, year);
    return () => {
      setUserData([]);
    };
  }, [year, month]);
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const options = {
    filter: false,
    print: false,
    search: false,
    download: false,
    serverSide: true,
    pagination: false,
    count: null,
    onCellClick: (rowData, rowMeta) => {
      // if (amendments.length !== 0) {
      //   handleClickOpen(amendments[rowMeta.rowIndex]);
      // }
    },
    selectableRows: "none",
    selectableRowsOnClick: true,
    responsive: "standard",
    viewColumns: false,
    customToolbar: null,
  };
  return (
    <Box>
      <Card {...props}>
        <CardHeader
          classes={{
            action: classes.header,
          }}
          action={
            <FormControl fullWidth>
              <InputLabel>Select Month</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={month}
                onChange={handleChangeYear}
              >
                {labels.map(
                  (item, index) =>
                    new Date().getMonth() >= index && (
                      <MenuItem value={index + 1} key={index}>
                        {item + " " + year}
                      </MenuItem>
                    )
                )}
              </Select>
            </FormControl>
          }
          title="Employee Statistical"
        />
        <Divider />
        <CardContent>
          <MuiThemeProvider theme={getMuiTheme}>
            <MUIDataTable
              data={userData ? userData.sort(sortByTasks).map(toDataList) : []}
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserList;
