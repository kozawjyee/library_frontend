import { useContext, useEffect, useState } from "react";
import { getAllBooks } from "../../services/bookservice";
import { ErrorContext } from "../../context/ErrorContext";
import { errorProvier } from "../../util/errorProvider";
import {
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  Snackbar,
  Typography,
} from "@mui/material";
import { UserContext } from "../../context/UserContext";
import { createBorrow } from "../../services/borrowservice";
import { useNavigate } from "react-router-dom";

function BookList() {
  const { showError } = useContext(ErrorContext);
  const [books, setBooks] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [book, setBook] = useState(null);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [noti, setNoti] = useState({ show: false, message: "" });

  const handleClose = () => {
    setOpenModel(false);
  };

  const borrowHandler = (book) => {
    setOpenModel(true);
    setBook(book);
  };

  const borrowBook = async () => {
    setLoading(true);
    const data = {
      book_id: book._id,
      user_id: user._id,
      date: new Date().getTime(),
      dead_line: new Date().getTime() + 5 * 24 * 60 * 60 * 1000,
    };
    await createBorrow(data)
      .then((resp) => {
        console.log(resp.data.data);
        setOpenModel(false);
        loadBooks();
        setNoti({ show: true, message: "Borrowed book successfully" });
        setLoading(false);
      })
      .catch((err) => {
        showError(errorProvier(err));
        setLoading(false);
      });
  };

  const loadBooks = async () => {
    setLoading(true);
    await getAllBooks()
      .then((resp) => {
        setBooks(resp.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        const error = errorProvier(err);
        showError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBooks();
  }, []);
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={noti.show}
        autoHideDuration={6000}
        onClose={() => setNoti({ ...noti, show: false })}
        message={noti.message}
      />
      {book && (
        <Dialog
          open={openModel}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Do you want to borrow {book.book_name}
          </DialogTitle>
          <DialogContent>
            <List>
              <ListItem>
                <div className="grid grid-cols-2 w-full">
                  <span>Author : </span> <span>{book.author}</span>
                </div>
              </ListItem>
              <ListItem>
                <div className="grid grid-cols-2 w-full">
                  <span>Availibility : </span>
                  <span
                    className={`${
                      book.is_available ? "bg-green-500" : "bg-red-500"
                    } text-white text-sm rounded-full shadow-md px-2 w-fit py-1`}
                  >
                    {book.is_available ? "available" : "unavailable"}
                  </span>
                </div>
              </ListItem>
              <ListItem>
                <div className="grid grid-cols-2 w-full">
                  <span>Borrow Date : </span>{" "}
                  <span>{new Date().toDateString()}</span>
                </div>
              </ListItem>
              <ListItem>
                <div className="grid grid-cols-2 w-full">
                  <span>Borrow Date : </span>{" "}
                  <span>
                    {new Date(
                      new Date().getTime() + 5 * 24 * 60 * 60 * 1000
                    ).toDateString()}
                  </span>
                </div>
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={borrowBook}>borrow</Button>
            <Button onClick={handleClose} autoFocus>
              cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <div className="grid gap-5 place-items-center tablet-sm:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4">
        {books.length > 0 &&
          books.map((book) => (
            <Card className="w-full" key={book._id} sx={{ maxWidth: 300 }}>
              <CardMedia
                sx={{ height: 250 }}
                image={`${import.meta.env.VITE_IMAGE_HOST}${book.image}`}
                title={book.book_name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {book.book_name}
                  <div className="flex mt-2">
                    <p
                      className={`${
                        book.is_available ? "bg-green-500" : "bg-red-500"
                      } text-white text-sm rounded-full shadow-md px-2`}
                    >
                      {book.is_available ? "available" : "unavailable"}
                    </p>
                  </div>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {book.author}
                </Typography>
                <div className="mt-2">
                  {book.book_categories.map((cat) => (
                    <span
                      className="mr-2 text-sm border px-2 rounded-full shadow-sm py-1 bg-blue-600 text-white"
                      key={cat._id}
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardActions>
                <Button onClick={() => borrowHandler(book)} size="small">
                  borrow
                </Button>
                <Button
                  onClick={() => navigate(`/books/details/${book._id}`)}
                  size="small"
                >
                  Learn More
                </Button>
              </CardActions>
            </Card>
          ))}
      </div>
    </>
  );
}

export default BookList;
