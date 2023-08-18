import { Button } from "@mui/material";
import BookList from "../../components/BookListComponents";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

function Books() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  return (
    <div className="px-5 py-5">
      <p className="my-5 text-2xl text-primary font-bold">Books</p>
      <div className="my-5 flex justify-end px-5">
        {user.user_role === "librarian" && (
          <Button onClick={() => navigate("/books/add")} variant="contained">
            Add New Book
          </Button>
        )}
      </div>
      <BookList />
    </div>
  );
}

export default Books;
