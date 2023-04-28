import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TableHead from "@mui/material/TableHead";
import axios from "axios";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { url } from "../config";

import "./AdminTable.css";

import { toast, ToastContainer } from "react-toastify";
import { Switch } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function CustomPaginationActionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rowValues, setRowValues] = React.useState([]);
  const [addUserOpen, setAddUserOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");
  const [enable, setEnable] = React.useState(false);

  const [sortOrder, setSortOrder] = React.useState("");
  const [sortColumn, setSortColumn] = React.useState("");
// sorting functionality
  const handleSortClick = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("desc");
      setSortColumn(column);
    }
  };
  const rowValuesSorted = rowValues.sort((a, b) => {
    const sortOrderVal = sortOrder === "asc" ? 1 : -1;
    console.log(sortColumn, "sortColumn");
    switch (sortColumn) {
      case "id":
        return (a.id - b.id) * sortOrderVal;
      case "email":
        return a.email.localeCompare(b.email) * sortOrderVal;
      case "firstname":
        return a.firstname.localeCompare(b.firstname) * sortOrderVal;
      case "lastname":
        return a.lastname.localeCompare(b.lastname) * sortOrderVal;
      case "username":
        return a.username.localeCompare(b.username) * sortOrderVal;
      case "action":
        return (a.action - b.action) * sortOrderVal;
      default:
        return 0;
    }
  });

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowValues.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddUserOpen = (e) => {
    e.preventDefault();
    setAddUserOpen(true);
  };
  const handleAddUserClose = () => {
    setAddUserOpen(false);
    setEmail("");
    setEmailError("");
  };
  //   enable  user here
  const enableUser = async (id, action) => {
    axios
      .patch(url.API + "restrictUser", { id, action: !action })
      .then((response) => {
        if (response.statusText === "OK") {
          console.log(response, "enableaction_working");
        }
      })
      .catch((error) => {
        console.log(error, "error from enable action");
      });
    console.log(id, "its working");
    setEnable(!enable);
  };
  // validate email and storing
  const storeEmail = (event) => {
    setEmail(event.target.value);
    const emailRegex = /\S+@\S+\.\S+/;
    if (event.target.value === "") {
      setEmailError("Enter Email");
    } else if (!emailRegex.test(event.target.value)) {
      setEmailError("Invalid Email");
    } else {
      setEmailError("");
    }
  };

  const sendMailData = () => {
    if (email === "") {
      setEmailError("Enter Email");
    } else if (emailError === "") {
      //  logic here
      axios
        .post(url.API + "sendMail", { email })
        .then((response) => {
          setEmail("");
          // toast sucesss
          toast.success(" Mail sent", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,

            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setTimeout(() => {
            setAddUserOpen(false);
          }, 2000);
          console.log(response);
        })
        .catch((error) => {
          setEmail("");
          toast.error(" Mail  not sent", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          console.log(error.data);
        });
      handleAddUserClose();
    }
  };
  const storingSearchValue = (event) => {
    setSearchValue(event.target.value);
    if (event.target.value.length > 3) {
      getSearchValues();
    }
    // if(event.target.value.length===0){
    //   getUSersData()
    // }
  };

  const getSearchValues = () => {
    axios
      // add id here
      .get(url.API + "getUsers?search_result=" + searchValue)
      .then((response) => {
        if (response.statusText === "OK") {
          /** console.log(response.data);*/

          setRowValues(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //geting userdata
  const getUSersData = () => {
    axios
      // add id here
      .get(url.API + "getUsers")
      .then((response) => {
        if (response.statusText === "OK") {
          /** console.log(response.data);*/

          setRowValues(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(rowValues);
  React.useEffect(() => {
    getUSersData();
  }, [enable, searchValue]);
  return (
    <div className="table-testing-admin-container">
      <div className="search-invite-admin-container ">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              borderWidth: "2px",
              borderColor: "E0E0E0",
              borderStyle: "solid",
              borderRadius: "8px",
            }}
          >
            <div className="search-container-div">
              <SearchIcon />
              <input
                className="input-search-table"
                type="text"
                placeholder="search username"
                value={searchValue}
                onChange={storingSearchValue}
              />
            </div>
          </Box>

          <button className="table-search-button" onClick={handleAddUserOpen}>
            AddUser
          </button>
          <Dialog open={addUserOpen} onClose={handleAddUserClose}>
            <DialogTitle>AddUser</DialogTitle>
            <DialogContent>
              <DialogContentText>
                please enter email address here.
              </DialogContentText>

              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                value={email}
                onChange={(e) => storeEmail(e)}
                error={emailError}
                helperText={emailError}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddUserClose}>Cancel</Button>
              <Button onClick={sendMailData} type="button">
                Send
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </div>
      <Paper sx={{ maxWidth: "1200px" }}>
        <TableContainer>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  <ArrowUpwardIcon
                    sx={{
                      fontSize: 15,

                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      handleSortClick("id");
                      setSortOrder("desc");
                    }}
                  />
                  ID
                  <ArrowDownwardIcon
                    sx={{
                      fontSize: 15,

                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      handleSortClick("id");
                      setSortOrder("asc");
                    }}
                  />
                </StyledTableCell>

                <StyledTableCell>
                  <ArrowUpwardIcon
                    sx={{
                      fontSize: 15,

                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      handleSortClick("firstname");
                      setSortOrder("desc");
                    }}
                  />
                  FirstName
                  <ArrowDownwardIcon
                    sx={{
                      fontSize: 15,

                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      handleSortClick("firstname");
                      setSortOrder("asc");
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <ArrowUpwardIcon
                    sx={{
                      fontSize: 15,

                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      handleSortClick("lastname");
                      setSortOrder("desc");
                    }}
                  />
                  LastName
                  <ArrowDownwardIcon
                    sx={{
                      fontSize: 15,

                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      handleSortClick("lastname");
                      setSortOrder("asc");
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <ArrowUpwardIcon
                    sx={{
                      fontSize: 15,

                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      handleSortClick("username");
                      setSortOrder("desc");
                    }}
                  />
                  UserName
                  <ArrowDownwardIcon
                    sx={{
                      fontSize: 15,

                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      handleSortClick("username");
                      setSortOrder("asc");
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <ArrowUpwardIcon
                    sx={{
                      fontSize: 15,

                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      handleSortClick("email");
                      setSortOrder("desc");
                    }}
                  />
                  Email{" "}
                  <ArrowDownwardIcon
                    sx={{
                      fontSize: 15,

                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      handleSortClick("email");
                      setSortOrder("asc");
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <ArrowUpwardIcon
                    sx={{
                      fontSize: 15,

                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      handleSortClick("action");
                      setSortOrder("desc");
                    }}
                  />
                  Action{" "}
                  <ArrowDownwardIcon
                    sx={{
                      fontSize: 15,

                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      handleSortClick("action");
                      setSortOrder("asc");
                    }}
                  />
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowValuesSorted

                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell style={{ width: 100 }}>
                      {row.id}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ width: 100 }}
                      component="th"
                      scope="row"
                    >
                      {row.firstname}
                    </StyledTableCell>

                    <StyledTableCell style={{ width: 100 }}>
                      {row.lastname}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: 100 }}>
                      {row.username}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: 100 }}>
                      {row.email}
                    </StyledTableCell>

                    <StyledTableCell style={{ width: 100 }}>
                      <Switch
                        onClick={() => {
                          enableUser(row.id, row.action);
                        }}
                        checked={row.action}
                        //  onChange={}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={3}
                  count={rowValues.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
    </div>
  );
}
