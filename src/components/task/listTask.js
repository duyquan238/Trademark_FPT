import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import MUIDataTable from "mui-datatables";
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { getTasks } from "../../redux/actions/taskAction";
import { dateFormat, dateDiffFromNow } from "../../commons/ultils/DateUltil";
import Chip from "@material-ui/core/Chip";
import {
  getCategoryName,
  getTaskStatusName,
  getTaskPriorityName,
  getCategoryId,
  getTaskPriorityId,
  getTaskStatusId,
} from "../../commons/ultils/taskUtil";
import { ROLES } from "../../commons/constants/userConstants";
import {
  CATEGORIES,
  TASK_PRIORITY,
  TASK_STATUS,
} from "../../commons/constants/taskContants";
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

const StyleChip = withStyles({
  root: {
    fontSize: "10px",
    height: "20px",
    fontWeight: "bold",
  },
})(Chip);

const ListTask = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    reloadTasks() {
      setReload(!reload);
    },
  }));

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(false);
  const [title, setTitle] = useState("");
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [assignee, setAssignee] = useState(null);
  const [priority, setPriority] = useState(null);
  const [category, setCategory] = useState(null);
  const [status, setStatus] = useState(null);
  //list user for filter
  const [listUser, setListUser] = useState([]);
  const toListUser = (item) => {
    return item.username;
  };
  const getUserIdByUsername = (username) => {
    return listUser.find((user) => user.username === username).id;
  };
  const getListUserFilter = async () => {
    if (user.name) {
      if (user.roleId !== 3) {
        const { data } = await axiosConfig.get("/user/get-role");
        setListUser(data.data);
      } else if (user.roleId === 3) {
        setListUser([user]);
      }
    }
  };

  useEffect(() => {
    dispatch(
      getTasks({
        page,
        size,
        title,
        sortBy,
        sortDirection,
        assignee,
        priority,
        category,
        status,
      })
    );
    getListUserFilter();
    if (error) {
      console.log("error here", error);
    }
  }, [
    dispatch,
    error,
    page,
    reload,
    size,
    title,
    sortBy,
    sortDirection,
    assignee,
    priority,
    category,
    status,
  ]);

  const searchHandle = (name) => {
    setTitle(name);
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
    setAssignee(!listFilter.assignee ? null : listFilter.assignee);
    setCategory(!listFilter.category ? null : listFilter.category);
    setPriority(!listFilter.priority ? null : listFilter.priority);
    setStatus(!listFilter.status ? null : listFilter.status);
  };

  const toDataList = (task, index) => {
    return [
      task.id,
      task.title,
      getCategoryName(task.categoryId),
      getTaskPriorityName(task.priority),
      getTaskStatusName(task.status),
      dateFormat(task.deadline, "YYYY-MM-DD", "DD-MM-YYYY"),
      task.content,
      task.assigneeName,
    ];
  };

  const calculateTag = (task) => {
    let dayDiff = dateDiffFromNow(task.deadline, "YYYY-MM-DD");
    if(task.status === 3){
      return { title: task.title };
    }
    if (dayDiff < 0)
      return { color: "secondary", tag: "Out-of-date", title: task.title };
    if (dayDiff < 15)
      return { color: "primary", tag: "Running-out", title: task.title };
    return { title: task.title };
  };
  const columns = [
    {
      name: "taskId",
      label: "Task ID",
      options: {
        filter: false,
        display: false,
      },
    },
    {
      name: "title",
      label: "Title",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          let tagInfo = calculateTag(tasks.data[dataIndex]);
          return (
            <>
              <span style={{ marginRight: 8 }}>{tagInfo.title}</span>
              {!!tagInfo.color && (
                <StyleChip
                  color={tagInfo.color}
                  label={tagInfo.tag}
                  size="small"
                />
              )}
            </>
          );

          // if(tasks.data.map(toDataList)[dataIndex][1] === "Demo task getall") {
          //   return (<>
          //   <span style={{marginRight: 8}}>{tasks.data.map(toDataList)[dataIndex][1]}</span>
          //   <Chip color="secondary" label={"Out of date"} size="small"/></>);
          // } else {
          //   return (<>
          //   <span style={{marginRight: 8}}>{tasks.data.map(toDataList)[dataIndex][1]}{calculateTag(tasks.data[dataIndex])}</span>
          //   <Chip color="primary" label={"Running out"} size="small"/></>);
          // }
        },
      },
    },
    {
      name: "category",
      label: "Category",
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
            const optionValues = CATEGORIES.map((item) => item.name);
            return (
              <FormControl>
                <InputLabel htmlFor="select-multiple-chip">Category</InputLabel>
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
      name: "priority",
      label: "Priority",
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
            const optionValues = TASK_PRIORITY.map((item) => item.name);
            return (
              <FormControl>
                <InputLabel htmlFor="select-multiple-chip">Priority</InputLabel>
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
            const optionValues = TASK_STATUS.map((item) => item.name);
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
    {
      name: "deadline",
      label: "Deadline",
      options: {
        filter: false,
      },
    },
    {
      name: "content",
      label: "Content",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "assignee",
      label: "Assignee",
      options: {
        filter: user.roleId !== 3,
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
                <InputLabel htmlFor="select-multiple-chip">Assignee</InputLabel>
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
  var searchTimeout = null;
  const options = {
    textLabels: {
      body: {
        noMatch: loading ? "Loading..." : "Sorry, no records were found",
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
    count: tasks.totalItems,
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
          //filter assignee
          let assigneeFilter = tableState.filterList[7];
          if (assigneeFilter.length && assigneeFilter[0] !== null) {
            filterObj.assignee = assigneeFilter
              .map(getUserIdByUsername)
              .join(",");
          }
          //filter category
          let categoryFilter = tableState.filterList[2];
          if (categoryFilter.length && categoryFilter[0] !== null) {
            filterObj.category = categoryFilter
              .map((category) => getCategoryId(category))
              .join(",");
          }
          //filter priority
          let priorityFilter = tableState.filterList[3];
          if (priorityFilter.length && priorityFilter[0] !== null) {
            filterObj.priority = priorityFilter
              .map((priority) => getTaskPriorityId(priority))
              .join(",");
          }
          //filter status
          let statusFilter = tableState.filterList[4];
          if (statusFilter.length && statusFilter[0] !== null) {
            filterObj.status = statusFilter
              .map((status) => getTaskStatusId(status))
              .join(",");
          }
          filterHandle(filterObj);
          break;
        default:
          return;
      }
    },
    onCellClick: (cellData, rowMeta) => {
      if (tasks.data.length !== 0) {
        history.push(
          `/task/${tasks.data.map(toDataList)[rowMeta.dataIndex][0]}`
        );
      }
    },
    selectableRows: "none",
    selectableRowsOnClick: true,
    filterType: "dropdown",
    responsive: "standard",
  };

  return (
    <Box>
      <MuiThemeProvider theme={getMuiTheme}>
        <MUIDataTable
          title={
            <Typography variant="h6">
              Task List
              {/* {loading && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />} */}
            </Typography>
          }
          data={tasks.data ? tasks.data.map(toDataList) : []}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
    </Box>
  );
});

export default ListTask;
