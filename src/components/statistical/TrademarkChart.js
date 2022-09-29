import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  useTheme,
  colors,
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TotalTrademark from "./TotalTrademark";
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

const TrademarkChart = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [trademarkData, setTrademarkData] = useState();
  const [totalTrademark, setTotalTrademark] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());

  const handleChangeYear = (e) => {
    setYear(e.target.value);
  };

  const calculateTotalTrademark = (data) => {
    const totalTrademark = data.reduce((total, current) => {
      return total + current;
    }, 0);
    setTotalTrademark(totalTrademark);
  };

  //Call API to get trademarks
  const loadTrademarkData = async (year) => {
    try {
      const response = await axiosConfig.get(
        `/dashboard/report-trademark/${year}`
      );
      if (response.data.status.code === "200") {
        setTrademarkData(response.data.data);
        calculateTotalTrademark(response.data.data);
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
    loadTrademarkData(year);
    return () => {
      setTrademarkData([]);
    };
  }, [year]);

  const data = {
    datasets: [
      {
        backgroundColor: colors.indigo[500],
        data: trademarkData,
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
    return years
  }

  return (
    <Grid container spacing={5}>
      <Grid item xs={8}>
        <Box>
          <Card {...props}>
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
                    {
                      getListYear(2019).map((item) => (
                        <MenuItem value={item}>{item}</MenuItem>    
                      ))
                    }
                  </Select>
                </FormControl>
              }
              title="Trademark Statistical"
            />
            <Divider />
            <CardContent>
              <Box style={{ height: 300 }}>
                <Bar data={data} options={options} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <TotalTrademark total={totalTrademark} year={year} />
      </Grid>
    </Grid>
  );
};

export default TrademarkChart;
