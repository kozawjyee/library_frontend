import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../context/UserContext";
import {
  Backdrop,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Snackbar,
} from "@mui/material";
import { userDetail, userUpdate } from "../../services/authservice";
import { ErrorContext } from "../../context/ErrorContext";
import { errorProvier } from "../../util/errorProvider";
import ProfileImg from "../../assets/images/dummyProfile.jpg";
import TableComponent from "../../components/TableComponent";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user } = useContext(UserContext);
  const [loading, setloading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const { showError } = useContext(ErrorContext);
  const [noti, setNoti] = useState({ show: false, message: "" });
  const navigate = useNavigate();

  const loadUser = async () => {
    setloading(true);
    await userDetail(user._id)
      .then((resp) => {
        setProfile(resp.data.data);
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
        showError(errorProvier(err));
        setloading(false);
      });
  };

  const updateProfile = async () => {
    setloading(true);
    console.log(profile);
    const data = {
      name: profile.name,
      username: profile.user_name,
      user_role: profile.user_role,
      email: profile.email,
      phone_no: profile.ph_no,
      nrc: profile.nrc,
      password: profile.password,
      address: profile.address,
    };
    await userUpdate(profile._id, profile, data)
      .then((resp) => {
        console.log(resp.data);
        setloading(false);
        setNoti({ show: true, message: "updated successfully" });
      })
      .catch((err) => {
        console.log(err);
        showError(errorProvier(err));
        setloading(false);
      });
  };

  const createRow = (data) =>
    data.map((value) => {
      value["book_name"] = value.book_id.book_name;
      value["borrowed_date"] = new Date(value.date).toLocaleDateString();
      value["ended_date"] = value.ended_date ? value.ended_date : "";
      value["dead_line"] = new Date(value.dead_line).toLocaleDateString();
      value["is_ended"] = value.is_ended ? "ENDED" : "PENDING";

      return value;
    });

  const changeProfileValue = (field, value) => {
    setProfile({
      ...profile,
      [field]: value,
    });
  };

  const columns = [
    {
      id: 1,
      name: "Book Name",
      code: "book_name",
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

  const data = useMemo(() => {
    if (profile) {
      const data = createRow(profile.borrowed_books);
      return data;
    }
    return [];
  }, [profile]);

  useEffect(() => {
    loadUser();
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
      {profile && (
        <div className="grid place-items-center">
          <Card
            sx={{ maxWidth: 1000 }}
            elevation={3}
            className="w-full px-5 py-5 text-primary my-5"
          >
            <p className="mb-5 text-2xl font-bold text-primary">Profile</p>
            <div className="flex justify-end">
              <Button
                sx={{
                  backgroundColor: isEdit ? "red" : "green",
                  ":hover": { backgroundColor: isEdit ? "red" : "green" },
                }}
                onClick={() => setIsEdit((prev) => !prev)}
                variant="contained"
              >
                Edit
              </Button>
            </div>
            <div className="laptop:grid laptop:grid-cols-3">
              <div className="grid place-items-center">
                <img
                  src={ProfileImg}
                  className="w-[200px] h-[200px] rounded-full"
                />
                <input
                  type="text"
                  disabled={!isEdit}
                  value={profile.name}
                  className="text-2xl font-semibold text-primary mt-5 text-center"
                  onChange={(e) => changeProfileValue("name", e.target.value)}
                />
              </div>
              <div className="mt-5 col-span-2">
                <div className="grid grid-cols-2 mt-5">
                  <label className="self-center">Available books :</label>
                  <p
                    className={`${
                      profile.borrow_count > 0
                        ? "text-green-600"
                        : "text-red-600"
                    } font-semibold`}
                  >
                    {profile.borrow_count}
                  </p>
                </div>

                <div className="grid grid-cols-2 mt-5">
                  <label className="self-center">Username :</label>
                  <input
                    disabled={!isEdit}
                    className="shadow-inner bg-[#ececec] px-3 py-2"
                    type="text"
                    value={profile.username}
                    onChange={(e) =>
                      changeProfileValue("username", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 mt-5">
                  <label className="self-center">Role :</label>
                  <input
                    disabled
                    className="shadow-inner bg-[#ececec] px-3 py-2"
                    type="text"
                    value={profile.user_role}
                  />
                </div>

                <div className="grid grid-cols-2 mt-5">
                  <label className="self-center">Email :</label>
                  <input
                    disabled={!isEdit}
                    className="shadow-inner bg-[#ececec] px-3 py-2"
                    type="text"
                    value={profile.email}
                    onChange={(e) =>
                      changeProfileValue("email", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 mt-5">
                  <label className="self-center">Phone No :</label>
                  <input
                    disabled={!isEdit}
                    className="shadow-inner bg-[#ececec] px-3 py-2"
                    type="text"
                    value={profile.phone_no}
                    onChange={(e) =>
                      changeProfileValue("phone_no", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 mt-5">
                  <label className="self-center">NRC :</label>
                  <input
                    disabled={!isEdit}
                    className="shadow-inner bg-[#ececec] px-3 py-2"
                    type="text"
                    value={profile.nrc}
                    onChange={(e) => changeProfileValue("nrc", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <Button onClick={() => updateProfile()} variant="contained">
                Update
              </Button>
            </div>
          </Card>

          <div className="w-full flex justify-center overflow-scroll">
            <Card
              className="w-full px-5 py-5 text-primary my-5"
              sx={{ maxWidth: 1000 }}
            >
              <p className="text-2xl font-semibold text-primary mt-5 mb-5">
                Borrowed Books{" "}
              </p>
              {profile.borrowed_books.length > 0 ? (
                <TableComponent data={data} columns={columns} />
              ) : (
                <p> NO Borrowed Books</p>
              )}
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
