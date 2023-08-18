import { useContext, useEffect, useState } from "react";
import { endBorrow, getBorrows } from "../../services/borrowservice";
import { ErrorContext } from "../../context/ErrorContext";
import { errorProvier } from "../../util/errorProvider";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Backdrop, Button, CircularProgress, Snackbar } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
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

function BorrowedBooks() {
  const [loading, setloading] = useState(false);
  const [borrowedList, setBorrowedList] = useState([]);
  const { showError } = useContext(ErrorContext);
  const [noti, setNoti] = useState({ show: false, message: "" });

  const loadData = async () => {
    await getBorrows()
      .then((resp) => {
        const data = resp.data.data;
        const rows = createRow(data);
        setBorrowedList(rows);
      })
      .catch((err) => {
        showError(errorProvier(err));
        setloading(false);
      });
  };

  const createRow = (data) =>
    data.map((value) => {
      value["book_name"] = value.book_id.book_name;
      value["user_name"] = value.user_id.name;
      value["borrowed_date"] = new Date(value.date).toLocaleDateString();
      value["ended_date"] = value.ended_date
        ? new Date(value.ended_date).toLocaleDateString()
        : "";
      value["dead_line"] = new Date(value.dead_line).toLocaleDateString();
      value["is_ended"] = value.is_ended ? "ENDED" : "PENDING";

      return value;
    });

  const columns = [
    {
      id: 1,
      name: "Book Name",
      code: "book_name",
    },
    {
      id: 2,
      name: "User Name",
      code: "user_name",
    },
    {
      id: 3,
      name: "Borrowed Date",
      code: "borrowed_date",
    },
    {
      id: 4,
      name: "Ended Date",
      code: "ended_date",
    },
    {
      id: 5,
      name: "Dead Line",
      code: "dead_line",
    },
    {
      id: 6,
      name: "Returned",
      code: "is_ended",
    },
  ];

  const returnHandler = async (id) => {
    setloading(true);
    await endBorrow(id, { ended_date: new Date().toLocaleDateString() })
      .then((resp) => {
        loadData();
        setNoti({ show: true, message: resp.data.message });
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
        showError(errorProvier(err));
        setloading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={noti.show}
        autoHideDuration={6000}
        onClose={() => setNoti({ ...noti, show: false })}
        message={noti.message}
      />
      <div className="px-5 py-5">
        <p className="text-2xl text-primary font-bold mb-5">Borrowed Books</p>
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <StyledTableCell key={col.id}>{col.name}</StyledTableCell>
                  ))}
                  <StyledTableCell>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {borrowedList.map((row) => (
                  <StyledTableRow key={row._id}>
                    {columns.map((col) => (
                      <StyledTableCell key={col.id}>
                        {row[col.code]}
                      </StyledTableCell>
                    ))}
                    <StyledTableCell>
                      <Button
                        onClick={() => returnHandler(row._id)}
                        variant="contained"
                      >
                        Return
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}

export default BorrowedBooks;
