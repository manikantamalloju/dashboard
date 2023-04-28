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

import "./UserTable.css";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";

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
  const [sortOrder, setSortOrder] = React.useState("");
  const [sortColumn, setSortColumn] = React.useState("");
  const userId = Cookies.get("id");
  console.log(rowValues.length);
  // Avoid a layout jump when reaching the last page with empty rows.

  // sortlogic
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
      case "date":
        return new Date(a.survey_date) - new Date(b.survey_date) * sortOrderVal;
      case "status":
        return (a.status - b.status) * sortOrderVal;
      default:
        return 0;
    }
  });

  // pagination
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

  // email validation and  mial sending
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
    const userId = Cookies.get("id");
    if (email === "") {
      setEmailError("Enter Email");
    } else if (emailError === "") {
      //  logic here
      axios
        .post(url.API + "survey", { email, user_id: userId })
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
    // api
    // if event.target.value length > 3...true...api
    // if (event.target.value.length > 3) {
    // }
  };

  //geting userdata
  const getSurveyData = () => {
    axios
      // add id here

      .get(url.API + `userSurveys/${userId}?search_result=` + searchValue)
      .then((response) => {
        if (response.statusText === "OK") {
          console.log(response);
          setRowValues(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  React.useEffect(() => {
    getSurveyData();
  }, [searchValue]);
  // React.useEffect(() =>{

  // },[sortOrder]);
  console.log(sortOrder, "order");
  console.log(rowValuesSorted);
  return (
    <div className="table-testing-container">
      <div className="search-invite-container">
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
                placeholder="search email"
                value={searchValue}
                onChange={storingSearchValue}
              />
            </div>
          </Box>

          <button
            className="user-table-search-button"
            onClick={handleAddUserOpen}
          >
            Invite
          </button>
          <Dialog open={addUserOpen} onClose={handleAddUserClose}>
            <DialogTitle>Invite</DialogTitle>
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
                  Id
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
                      handleSortClick("email");
                      setSortOrder("desc");
                    }}
                  />
                  Email
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
                      handleSortClick("date");
                      setSortOrder("desc");
                    }}
                  />
                  Date
                  <ArrowDownwardIcon
                    sx={{
                      fontSize: 15,

                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      handleSortClick("date");
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
                      handleSortClick("status");
                      setSortOrder("desc");
                    }}
                  />
                  Status
                  <ArrowDownwardIcon
                    sx={{
                      fontSize: 15,

                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      handleSortClick("status");
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
                      // ￼sendMail
                      // ￼sebleCell
                      style={{ width: 100, marginLeft: 10, marginRight: 20 }}
                      component="th"
                      scope="row"
                    >
                      {row.email}
                    </StyledTableCell>

                    <StyledTableCell style={{ width: 100 }}>
                      {row.survey_date}
                    </StyledTableCell>

                    <StyledTableCell style={{ width: 100 }}>
                      {row.status ? "Completed" : "Incompleted"}
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
// testing data=[

// {id: 1, user_id: 3, survey_date: '08/04/2023', email: 'naidu@gmail.com', status: true},
//
//
// {id: 2, user_id: 3, survey_date: '14/04/2023', email: 'mani@gmail.com', status: false},
//
//
// {id: 3, user_id: 3, survey_date: '18/06/2023', email: 'manikanta@gmail.com', status: false},
//
//
// {id: 4, user_id: 3, survey_date: '19/04/2023', email: 'manikanta@gmail.com', status: false},
//
//
// {id: 5, user_id: 3, survey_date: '19/04/2023', email: 'naidu@gmail.com', status: false},
//
//
// {id: 6, user_id: 3, survey_date: '19/04/2023', email: 'naidu@gmail.com', status: false},
//
//
// {id: 7, user_id: 3, survey_date: '25/04/2023', email: 'galirajapraveenreddy@gmail.com', status: false},
//
//
// {id: 8, user_id: 3, survey_date: '25/04/2023', email: 'galirajapraveenreddy@gmail.com', status: false},
//
//
// {id: 9, user_id: 3, survey_date: '25/04/2023', email: 'galirajapraveenreddy@gmail.com', status: false},
//
//
// {id: 10, user_id: 3, survey_date: '25/04/2023', email: 'galirajapraveenreddy@gmail.com', status: false},
//
//
// {id: 11, user_id: 3, survey_date: '25/04/2023', email: 'galirajapraveenreddy@gmail.com', status: false},
//
//
// {id: 12, user_id: 3, survey_date: '25/04/2023', email: 'galirajapraveenreddy@gmail.com', status: false},
//
//
// {id: 15, user_id: 3, survey_date: '25/04/2023', email: 'galirajapraveenreddy@gmail.com', status: false},
//
//
// {id: 17, user_id: 3, survey_date: '26/04/2023', email: 'ram999jayaram@gmail.com', status: false},
//
//
// {id: 20, user_id: 3, survey_date: '26/04/2023', email: 'ram999jayaram@gmail.com', status: false},
// ]
