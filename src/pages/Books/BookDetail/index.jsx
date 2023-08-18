import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  bookDetail,
  deletebook,
  getCategories,
  updatebook,
  uploadBookImage,
} from "../../../services/bookservice";
import { ErrorContext } from "../../../context/ErrorContext";
import { errorProvier } from "../../../util/errorProvider";
import {
  Backdrop,
  Button,
  Card,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  Snackbar,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveIcon from "@mui/icons-material/Remove";
import { UserContext } from "../../../context/UserContext";
import { createBorrow } from "../../../services/borrowservice";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

function BookDetail() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const { showError } = useContext(ErrorContext);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [book, setBook] = useState(null);
  const [cateList, setCateList] = useState([]);
  const [showCate, setShowCate] = useState(false);
  const [noti, setNoti] = useState({ show: false, message: "" });
  const navigate = useNavigate();

  const isAdmin = user.user_role === "librarian" ? true : false;

  const loadBook = async () => {
    setLoading(true);
    await bookDetail(id)
      .then((resp) => {
        setBook(resp.data.data);
      })
      .catch((err) => {
        console.log(err);
        showError(errorProvier(err));
        setLoading(false);
      });

    await getCategories()
      .then((resp) => {
        console.log("cate", resp.data.data);
        setCateList(resp.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        showError(errorProvier(err));
        setLoading(false);
      });
  };

  const categoryRemove = (cat) => {
    // console.log(cat);
    const newCategory = book.book_categories.filter(
      (value) => value._id !== cat._id
    );
    setBook({ ...book, book_categories: newCategory });
  };

  const addCategory = (cate) => {
    const isIncludeCate = book.book_categories.some(
      (value) => value._id === cate._id
    );
    if (!isIncludeCate) {
      const newCateList = book.book_categories;
      newCateList.push(cate);
      setBook({ ...book, book_categories: newCateList });
    }
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
        setNoti({ show: true, message: "Borrowed book successfully" });
        navigate("/books");
      })
      .catch((err) => {
        showError(errorProvier(err));
        setLoading(false);
      });
  };

  const updateBook = async () => {
    setLoading(true);
    const data = {
      ...book,
      book_categories: book.book_categories.map((value) => value._id),
    };
    await updatebook(id, data)
      .then(() => {
        setLoading(false);
        loadBook();
      })
      .catch((err) => {
        console.log(err);
        showError(errorProvier(err));
        setLoading(false);
      });
  };

  const deleteHandler = async () => {
    setLoading(true);
    await deletebook(id)
      .then(() => {
        setNoti({ show: true, message: "deleted successfully" });
        navigate("/books");
      })
      .catch((err) => {
        console.log(err);
        showError(errorProvier(err));
        setLoading(false);
      });
  };

  const onFileChange = async (e) => {
    console.log(e.target.files[0]);
    const data = new FormData();
    data.append("image", e.target.files[0], e.target.files[0].name);
    await uploadBookImage(data)
      .then((resp) => {
        console.log(resp.data);
        setBook({ ...book, image: resp.data.src });
      })
      .catch((err) => {
        console.log(err);
        showError(errorProvier(err));
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBook();
  }, []);
  return (
    <>
      <Snackbar
        open={noti.show}
        autoHideDuration={6000}
        onClose={() => setNoti({ ...noti, show: false })}
        message={noti.message}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>{" "}
      <div className="px-5 py-5">
        <IconButton onClick={() => navigate("/books")} variant="contained">
          <ArrowBackIosIcon sx={{ color: "blue" }} />
        </IconButton>
      </div>
      {book && (
        <div className="px-5 py-5 flex flex-col items-center">
          <div className="">
            <p className="text-2xl font-bold text-primary my-5">
              {book.book_name}
            </p>
          </div>
          <div className="tablet:flex laptop:space-x-10 space-y-5 tablet:space-y-0">
            <img
              className="w-full tablet:w-[300px] laptop:w-[400px] desktop:w-[500px]"
              alt={book.book_name}
              src={`${import.meta.env.VITE_IMAGE_HOST}${book.image}`}
            />
            <div>
              <Card sx={{ maxWidth: 500 }}>
                <List>
                  <ListItem>
                    <div className="w-full flex items-center justify-between">
                      <div
                        className={`${
                          book.is_available ? "bg-green-500" : "bg-red-500"
                        } text-white px-2 py-1 rounded-full shadow-md`}
                      >
                        {book.is_available ? "available" : "unavailable"}
                      </div>
                      {isAdmin && (
                        <div className="flex justify-end">
                          <Button
                            onClick={() => setIsEdit((prev) => !prev)}
                            variant="contained"
                          >
                            {" "}
                            Edit{" "}
                          </Button>
                        </div>
                      )}
                    </div>
                  </ListItem>
                  <ListItem>
                    <div className="grid grid-cols-2 w-full">
                      <label className="self-center"> Categories : </label>
                      <div className="flex">
                        {book.book_categories.map((cat) => (
                          <div
                            className="mr-2 bg-blue-500 text-white px-2 shadow-md text-sm py-1 rounded-full relative flex items-center"
                            key={cat._id}
                          >
                            <p>{cat.name}</p>
                            {isEdit && (
                              <button
                                onClick={() => categoryRemove(cat)}
                                className="absolute right-[-5px] top-[-10px] rounded-full bg-red-600"
                              >
                                <RemoveIcon />
                              </button>
                            )}
                          </div>
                        ))}
                        {isEdit && (
                          <div className="relative z-10">
                            <IconButton
                              onClick={() => setShowCate((prev) => !prev)}
                            >
                              <AddCircleIcon />
                            </IconButton>
                            {showCate && (
                              <div className="absolute flex flex-col bg-white overflow-scroll shadow-md h-[200px]">
                                {cateList.map((value) => (
                                  <button
                                    onClick={() => addCategory(value)}
                                    className="border-b border-x py-1 px-2"
                                    key={value._id}
                                  >
                                    {value.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </ListItem>
                  <ListItem>
                    <div className="grid grid-cols-2 w-full">
                      <label className="self-center"> Author : </label>
                      <input
                        className="w-full py-2 px-2"
                        disabled={!isEdit}
                        type="text"
                        value={book.author}
                        onChange={(e) =>
                          setBook({ ...book, author: e.target.value })
                        }
                      />
                    </div>
                  </ListItem>
                  <ListItem>
                    <div className="grid grid-cols-2 w-full">
                      <label className="self-center"> Published Date : </label>
                      <DatePicker
                        disabled={!isEdit}
                        onChange={(e) =>
                          setBook({ ...book, published_date: e.toDate() })
                        }
                        value={dayjs(
                          new Date(book.published_date).toDateString()
                        )}
                      />
                    </div>
                  </ListItem>
                  <ListItem>
                    <div className="grid grid-cols-2 w-full">
                      <label className="self-center"> Borrow Duration : </label>
                      <input
                        disabled={!isEdit}
                        className="w-full py-2 px-2"
                        type="number"
                        value={book.avialable_borrow_day}
                        onChange={(e) =>
                          setBook({
                            ...book,
                            avialable_borrow_day: e.target.value,
                          })
                        }
                      />
                    </div>
                  </ListItem>
                  {isAdmin && (
                    <ListItem>
                      <div className="grid grid-cols-2 w-full">
                        <label className="self-center"> Book Image : </label>
                        <input
                          disabled={!isEdit}
                          className="w-full py-2 px-2"
                          type="file"
                          name="book image"
                          onChange={(e) => onFileChange(e)}
                          accept="image/png, image/jpg, image/jpeg"
                        />
                      </div>
                    </ListItem>
                  )}
                </List>
              </Card>

              <div className="flex space-x-2 justify-end mt-3">
                {isAdmin && (
                  <>
                    <Button onClick={() => updateBook()} variant="contained">
                      {" "}
                      Update{" "}
                    </Button>
                    <Button
                      sx={{ backgroundColor: "red" }}
                      onClick={() => deleteHandler()}
                      variant="contained"
                    >
                      {" "}
                      Delete{" "}
                    </Button>
                  </>
                )}
                <Button onClick={() => borrowBook()} variant="contained">
                  {" "}
                  Borrow{" "}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BookDetail;
