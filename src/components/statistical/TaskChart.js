import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  colors,
  useTheme,
} from "@material-ui/core";
import LibraryAddCheckIcon from "@material-ui/icons/LibraryAddCheck";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import axiosConfig from "../../commons/Apis/axiosConfig";

const useStyles = makeStyles((theme) => ({
  // dividerStyle: {
  //   marginTop: 8,
  //   marginBottom: 8,
  // },
  header: {
    width: "120px",
  },
}));

const TaskChart = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [taskData, setTaskData] = useState([]);
  const [totalTask, setTotalTask] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth()+1);
  const [year, setYear] = useState(new Date().getFullYear());
  const handleChangeMonth = (e) => {
    setMonth(e.target.value);
  };

  const calculateTotalTask = (data) => {
    const totalTask = data.reduce((total, current) => {
      return total + current;
    }, 0);
    setTotalTask(totalTask);
  };

  //Call API to get trademarks
  const loadTaskData = async (month) => {
    try {
      const response = await axiosConfig.get(
        `/dashboard/report-task?month=${month}&year=2021`
      );
      if (response.data.status.code === "200") {
        let dataTask = [
          response.data.data.DONE,
          response.data.data.NOT_DONE,
          response.data.data.NOT_ASSIGN,
        ];
        setTaskData(dataTask);
        calculateTotalTask(dataTask);
      } else if (response.data.status.code === "500") {
        enqueueSnackbar(response.data.data, { variant: "error" });
      } else {
        enqueueSnackbar("Cannot Load Trademarks", { variant: "error" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTaskData(month);
    // return () => {
    //   loadTaskData([]);
    // };
  }, [month]);

  const data = {
    datasets: [
      {
        data: taskData,
        backgroundColor: [
          colors.indigo[500],
          colors.red[600],
          colors.orange[600],
        ],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white,
      },
    ],
    labels: ["Done", "Not Done", "Not Assign"],
  };
  const options = {
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };

  const tasks = [
    {
      title: "Done",
      value: ((taskData[0] / totalTask) * 100).toFixed(0),
      icon: LibraryAddCheckIcon,
      color: colors.indigo[500],
    },
    {
      title: "Not Done",
      value: ((taskData[1] / totalTask) * 100).toFixed(0),
      icon: LibraryBooksIcon,
      color: colors.red[600],
    },
    {
      title: "Not Assign",
      value: ((taskData[2] / totalTask) * 100).toFixed(0),
      icon: LibraryAddIcon,
      color: colors.orange[600],
    },
  ];
  const labels= [
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
  ]

  return (
    <Card>
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
              onChange={handleChangeMonth}
            >
              {
                labels.map((item, index) => 
                (new Date().getMonth() >= index) &&<MenuItem value={index+1}>{item+ " " + year}</MenuItem>)
              }
            </Select>
          </FormControl>
        }
        title="Task Overview"
      />
      <Divider />
      <CardContent>
        {totalTask !== 0 ? (
          <>
            <Box
              style={{
                height: 300,
                // position: "relative",
              }}
            >
              <Doughnut data={data} options={options} />
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                pt: 2,
              }}
            >
              {tasks.map(({ color, icon: Icon, title, value }) => (
                <Box
                  key={title}
                  style={{
                    padding: 16,
                    textAlign: "center",
                  }}
                >
                  <Icon color="primary" />
                  <Typography color="textPrimary" variant="body1">
                    {title}
                  </Typography>
                  <Typography style={{ color }} variant="h2">
                    {value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <Box
            style={{
              height: 100,
              // position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4">No tasks in this month</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskChart;
