import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  colors,
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useSnackbar } from "notistack";
import axiosConfig from "../../commons/Apis/axiosConfig";
const useStyles = makeStyles((theme) => ({
  dividerStyle: {
    marginTop: 8,
    marginBottom: 8,
  },
  header: {
    width: "120px",
  },
}));

const TimeCompleteTrademarkChart = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [year, setYear] = useState(new Date().getFullYear());
  const [timeComplete, setTimeComplete] = useState([]);
  const handleChangeYear = (e) => {
    setYear(e.target.value);
  };

  //Call API to get trademarks
  const loadTimeCompleteTrademarkData = async (year) => {
    try {
      const response = await axiosConfig.get(
        `/dashboard/report-trademark-finish/${year}`
      );
      if (response.data.status.code === "200") {
        setTimeComplete(response.data.data);
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
    loadTimeCompleteTrademarkData(year);
    return () => {
      setTimeComplete([]);
    };
  }, [year]);

  const data = {
    datasets: [
      {
        backgroundColor: colors.indigo[500],
        data: timeComplete,
        label: year,
      },
    ],
    labels: [
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
    ],
  };

  const options = {
    animation: true,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: theme.palette.text.secondary,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0,
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider,
          },
        },
      ],
    },
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

  const getListYear = (startYear) => {
    let years = [];
    for (let i = startYear; i <= new Date().getFullYear(); i++) {
      years.push(i);
    }
    return years;
  };

  return (
    <Card {...props} className={classes.cardWidth}>
      <CardHeader
        classes={{
          action: classes.header,
        }}
        action={
          <FormControl fullWidth>
            <InputLabel>Select Year</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={year}
              onChange={handleChangeYear}
            >
              {getListYear(2019).map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>
        }
        title="Average time to complete Trademark"
      />
      <Divider />
      <CardContent>
        <Box style={{ height: 420 }}>
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TimeCompleteTrademarkChart;
