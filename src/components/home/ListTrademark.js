import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@material-ui/core";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { getTrademarks } from "../../redux/actions/trademarkAction";
import { dateFormat } from "../../commons/ultils/DateUltil";
import { AppStatus } from "../../commons/constants/trademarkStatusConstants";
import axiosConfig from "../../commons/Apis/axiosConfig";

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
      MUIDataTableToolbar: {
        filterPaper: {
          width: "400px",
        },
      },
      MUIDataTableBodyCell: {
        root: {},
      },
      MuiChip: {
        root: {
          backgroundColor: "#8bc34a",
          color: "white",
        },
        deleteIcon: {
          color: "white",
        },
      },
    },
  });

const ListTrademark = forwardRef((props, ref) => {
  const history = useHistory();
  const { user } = useSelector((state) => state.auth);
  useImperativeHandle(ref, () => ({
    filterTotal() {
      filterHandle({});
    },
    filterNotCompleted() {
      filterHandle({ status: "1,2,3,4,5,6,7" });
    },
    filterTranfer() {
      filterHandle({ status: "9,10,11" });
    },
  }));
  //list user for filter
  const [listUser, setListUser] = useState([]);
  const toListUser = (item) => {
    return item.username;
  };
  const getListUserFilter = async () => {
    if (user.name)
      if (user.roleId !== 3) {
        const { data } = await axiosConfig.get("/user/get-role");
        setListUser(data.data);
      } else if (user.roleId === 3) {
        setListUser([user]);
      }
  };
  const columns = [
    {
      name: "trademarkId",
      label: "Trademark ID",
      options: {
        filter: false,
      },
    },
    {
      name: "trademarkName",
      label: "Trademark Name",
      options: {
        filter: false,
      },
    },
    {
      name: "agentName",
      label: "Agent Name",
      options: {
        filter: false,
      },
    },
    {
      name: "numberApplication",
      label: "Application Number",
      options: {
        filter: false,
      },
    },
    {
      name: "instructionDate",
      label: "Instruction Date",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "createdBy",
      label: "Create By",
      options: {
        filter: true,
        display: true,
        filterType: "custom",
        customFilterListOptions: {
          render: (v) => v.map((l) => l.toUpperCase()),
          update: (filterList, filterPos, index) => {
            filterList[index].splice(filterPos, 1);
            return filterList;
          },
        },

        filterOptions: {
          logic: (status, filters, row) => {
            if (filters.length) return !filters.includes(status);
            return false;
          },
          display: (filterList, onChange, index, column) => {
            const optionValues = listUser.map(toListUser);
            return (
              <FormControl>
                <InputLabel htmlFor="select-multiple-chip">
                  Created By
                </InputLabel>
                <Select
                  multiple
                  value={filterList[index]}
                  renderValue={(selected) => selected.join(", ")}
                  onChange={(event) => {
                    filterList[index] = event.target.value;
                    onChange(filterList[index], index, column);
                  }}
                >
                  {optionValues.map((item) => (
                    <MenuItem key={item} value={item}>
                      <Checkbox
                        color="primary"
                        checked={filterList[index].indexOf(item) > -1}
                      />
                      <ListItemText primary={item} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          },
        },
      },
    },
    {
      name: "processedBy",
      label: "Process By",
      options: {
        filter: true,
        filterType: "custom",
        customFilterListOptions: {
          render: (v) => v.map((l) => l.toUpperCase()),
          update: (filterList, filterPos, index) => {
            filterList[index].splice(filterPos, 1);
            return filterList;
          },
        },

        filterOptions: {
          logic: (status, filters, row) => {
            if (filters.length) return !filters.includes(status);
            return false;
          },
          display: (filterList, onChange, index, column) => {
            const optionValues = listUser.map(toListUser);
            return (
              <FormControl>
                <InputLabel htmlFor="select-multiple-chip">
                  Processed By
                </InputLabel>
                <Select
                  multiple
                  value={filterList[index]}
                  renderValue={(selected) => selected.join(", ")}
                  onChange={(event) => {
                    filterList[index] = event.target.value;
                    onChange(filterList[index], index, column);
                  }}
                >
                  {optionValues.map((item) => (
                    <MenuItem key={item} value={item}>
                      <Checkbox
                        color="primary"
                        checked={filterList[index].indexOf(item) > -1}
                      />
                      <ListItemText primary={item} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          },
        },
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        filterType: "custom",
        customFilterListOptions: {
          render: (v) => v.map((l) => l.toUpperCase()),
          update: (filterList, filterPos, index) => {
            filterList[index].splice(filterPos, 1);
            return filterList;
          },
        },
        filterOptions: {
          logic: (status, filters, row) => {
            if (filters.length) return !filters.includes(status);
            return false;
          },
          display: (filterList, onChange, index, column) => {
            const optionValues = ["Completed", "Uncompleted"];
            return (
              <FormControl>
                <InputLabel htmlFor="select-multiple-chip">Status</InputLabel>
                <Select
                  multiple
                  value={filterList[index]}
                  renderValue={(selected) => selected.join(", ")}
                  onChange={(event) => {
                    filterList[index] = event.target.value;
                    onChange(filterList[index], index, column);
                  }}
                >
                  {optionValues.map((item) => (
                    <MenuItem key={item} value={item}>
                      <Checkbox
                        color="primary"
                        checked={filterList[index].indexOf(item) > -1}
                      />
                      <ListItemText primary={item} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          },
        },
      },
    },
  ];

  const dispatch = useDispatch();
  const { trademarks, loading, error } = useSelector(
    (state) => state.trademarks
  );
  const [page, setPage] = useState(1);
  const [trademarkName, setTrademarkName] = useState("");
  const [size, setSize] = useState(10);
  const [status, setStatus] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [processedBy, setProcessedBy] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  useEffect(() => {
    
    if(user.name) {
      dispatch(
        getTrademarks({
          page,
          size,
          trademarkName,
          status,
          createdBy: createdBy,
          processedBy: processedBy,
          sortBy,
          sortDirection,
        })
      ); 
    }
    getListUserFilter();
    if (error) {
      console.log("error here", error);
    }
  }, [
    dispatch,
    error,
    page,
    user,
    size,
    trademarkName,
    status,
    createdBy,
    processedBy,
    sortBy,
    sortDirection,
  ]);
  const searchHandle = (name) => {
    setTrademarkName(name);
    setPage(1);
    setSortBy(null);
    setSortDirection(null);
  };

  const sortHandle = (sortBy, sortDirection) => {
    setSortBy(sortBy);
    setSortDirection(sortDirection);
    setPage(1);
  };

  const filterHandle = (listFilter) => {
    setPage(1);
    setStatus(!listFilter.status ? null : listFilter.status);
    setCreatedBy(!listFilter.createdBy ? null : listFilter.createdBy);
    setProcessedBy(!listFilter.processedBy ? null : listFilter.processedBy);
  };

  const toDataList = (trademark, index) => {
    return [
      trademark.trademarkId,
      trademark.trademarkName,
      trademark.agentName,
      trademark.numberApplication,
      dateFormat(trademark.instructionDate, "YYYY-MM-DD", "DD-MM-YYYY"),
      trademark.createdBy,
      trademark.processedBy,
      AppStatus[trademark.status],
    ];
  };
  var searchTimeout = null;
  const options = {
    textLabels: {
      body: {
        noMatch: (!user.name || loading) ? "Loading..." : "Sorry, no records were found",
        toolTip: "Sort",
        columnHeaderTooltip: (column) => `Sort for ${column.label}`,
      },
    },
    filter: true,
    confirmFilters: true,
    customFilterDialogFooter: (currentFilterList, applyNewFilters) => {
      return (
        <div style={{ marginTop: "40px" }}>
          <Button variant="contained" onClick={applyNewFilters}>
            Apply Filters
          </Button>
        </div>
      );
    },
    print: false,
    download: false,
    serverSide: true,
    rowsPerPageOptions: [1, 5, 10, 15, 30],
    // page : props.page,
    count: trademarks.totalItems,
    rowPerPage: 10,
    onTableChange: (action, tableState) => {
      // a developer could react to change on an action basis or
      // examine the state as a whole and do whatever they want
      switch (action) {
        case "changePage":
          setPage(tableState.page + 1);
          break;
        case "sort":
          sortHandle(tableState.sortOrder.name, tableState.sortOrder.direction);
          break;
        case "search":
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => {
            searchHandle(tableState.searchText);
          }, 600);
          break;
        case "changeRowsPerPage":
          setSize(tableState.rowsPerPage);
          setPage(1);
          setSortBy(null);
          setSortDirection(null);
          break;
        case "filterChange":
          let filterObj = {};
          //filter status
          let statusFilter = tableState.filterList[7];
          statusFilter = statusFilter.map((item) => {
            if (item === "Completed") return "8";
            if (item === "Uncompleted") return "1,2,3,4,5,6,7,9,10,11";
          });
          if (statusFilter.length && statusFilter[0] !== null) {
            filterObj.status = statusFilter.join(",");
          }
          //filter created by
          let createdByFilter = tableState.filterList[5];
          if (createdByFilter.length && createdByFilter[0] !== null) {
            filterObj.createdBy = createdByFilter.join(",");
          }
          //filter process by
          let processedByFilter = tableState.filterList[6];
          if (processedByFilter.length && processedByFilter[0] !== null) {
            filterObj.processedBy = processedByFilter.join(",");
          }
          filterHandle(filterObj);
          break;
        default:
          return;
      }
    },
    onCellClick: (rowData, rowMeta) => {
      if (trademarks.data.length !== 0) {
        history.push(
          `/trademark/${trademarks.data.map(toDataList)[rowMeta.dataIndex][0]}`
        );
      }
    },
    selectableRows: "none",
    selectableRowsOnClick: true,
    filterType: "dropdown",
    responsive: "standard",
  };

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      <MUIDataTable
        title={
          <Typography variant="h6">
            Trademark List
            {loading && (
              <CircularProgress
                size={24}
                style={{ marginLeft: 15, position: "relative", top: 4 }}
              />
            )}
          </Typography>
        }
        data={trademarks.data ? trademarks.data.map(toDataList) : []}
        columns={columns}
        options={options}
      /> 
    </MuiThemeProvider>
  );
});

export default ListTrademark;
