import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { dateFormat } from "../../commons/ultils/DateUltil";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getUsers } from "../../redux/actions/userActions";
import { getDepartmentName, getRoleId } from "../../commons/ultils/userUtil";
import { ROLES } from "../../commons/constants/userConstants";

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

const ListUser = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    reloadUsers() {
      setReload(!reload);
    },
  }));

  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    dispatch(
      getUsers({
        page,
        size,
        name: employeeName,
        sortBy,
        sortDirection,
        roleId,
      })
    );
    if (error) {
      console.log("error here", error);
    }
  }, [
    dispatch,
    error,
    page,
    reload,
    size,
    employeeName,
    sortBy,
    sortDirection,
    roleId,
  ]);

  const searchHandle = (name) => {
    setEmployeeName(name);
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
    setRoleId(!listFilter.roleId ? null : listFilter.roleId);
    // setCreateBy(!listFilter.createBy ? null : listFilter.createBy);
  };

  const toDataList = (employee, index) => {
    return [
      employee.id,
      employee.name,
      employee.phoneNumber,
      employee.emailAddress,
      getDepartmentName(employee.departmentId),
      employee.role.name,
      dateFormat(employee.joinDate, "YYYY-MM-DD", "DD-MM-YYYY"),
    ];
  };

  const columns = [
    {
      name: "id",
      label: "Employee ID",
      options: {
        filter: false,
      },
    },
    {
      name: "name",
      label: "Employee Name",
      options: {
        filter: false,
      },
    },
    {
      name: "phoneNumber",
      label: "Phone",
      options: {
        filter: false,
      },
    },
    {
      name: "emailAddress",
      label: "Email",
      options: {
        filter: false,
      },
    },
    {
      name: "departmentId",
      label: "Department",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "role",
      label: "Role",
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
            const optionValues = ROLES.map((item) => item.name);
            return (
              <FormControl>
                <InputLabel htmlFor="select-multiple-chip">Role</InputLabel>
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
      name: "joinDate",
      label: "Joined Date",
      options: {
        filter: false,
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
    count: users.totalItems,
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
          let roleFilter = tableState.filterList[5];
          if (roleFilter.length && roleFilter[0] !== null) {
            filterObj.roleId = roleFilter
              .map((roleName) => getRoleId(roleName))
              .join(",");
          }
          filterHandle(filterObj);
          break;
        default:
          return;
      }
    },
    onCellClick: (rowData, rowMeta) => {
      if (users.data.length !== 0) {
        props.handleOpenUser(users.data[rowMeta.rowIndex]);
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
              Employee List
              {loading && (
                <CircularProgress
                  size={24}
                  style={{ marginLeft: 15, position: "relative", top: 4 }}
                />
              )}
            </Typography>
          }
          data={users.data ? users.data.map(toDataList) : []}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
    </Box>
  );
});

export default ListUser;
