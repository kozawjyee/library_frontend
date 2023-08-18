import { Button, Card, TextField } from "@mui/material";
import styles from "./styles.module.css";
import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { register } from "../../../services/authservice";
import { ToastContainer, toast } from "react-toastify";
import { ErrorContext } from "../../../context/ErrorContext";
import { errorProvier } from "../../../util/errorProvider";

function Register() {
  const defaultInfo = {
    name: "",
    username: "",
    user_role: "user",
    email: "",
    phone_no: "",
    address: "",
    nrc: "",
    password: "",
    confirm_password: "",
  };
  const [userInfo, setUserInfo] = useState(defaultInfo);
  const navigate = useNavigate();
  const { showError } = useContext(ErrorContext);

  const updateInfo = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  console.log(console.log(userInfo));

  const registerHandler = async () => {
    if (userInfo.password !== userInfo.confirm_password) {
      return toast("Password Does not match");
    }
    const data = {
      name: userInfo.name,
      username: userInfo.username,
      user_role: "user",
      email: userInfo.email,
      phone_no: userInfo.phone_no,
      address: userInfo.address,
      nrc: userInfo.nrc,
      password: userInfo.password,
    };
    await register(data)
      .then((resp) => {
        toast(resp.data.message);
        navigate("/auth");
      })
      .catch((err) => {
        console.log(err);
        showError(errorProvier(err));
      });
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${styles.background} w-full min-h-screen grid place-items-center relative`}
      >
        <NavLink
          to="/auth"
          className="absolute left-3 top-3 text-white font-bold underline"
        >
          <ArrowBackIcon className="mr-2" />
          Back to login
        </NavLink>
        <Card
          className="w-full flex flex-col py-5 space-y-5 px-5"
          sx={{ maxWidth: 500 }}
        >
          <p className="text-center font-bold text-[25px]">User Registration</p>
          <TextField
            label="Name"
            size="small"
            id="name"
            type="text"
            value={userInfo.name}
            onChange={(e) => updateInfo("name", e.target.value)}
            variant="filled"
          />

          <TextField
            label="Username"
            size="small"
            id="username"
            type="text"
            value={userInfo.username}
            onChange={(e) => updateInfo("username", e.target.value)}
            variant="filled"
          />

          <TextField
            label="Email"
            size="small"
            id="email"
            type="text"
            value={userInfo.email}
            onChange={(e) => updateInfo("email", e.target.value)}
            variant="filled"
          />

          <TextField
            label="Phone No"
            size="small"
            id="phone_no"
            type="text"
            value={userInfo.phone_no}
            onChange={(e) => updateInfo("phone_no", e.target.value)}
            variant="filled"
          />

          <TextField
            label="Address"
            size="small"
            id="address"
            type="text"
            multiline
            value={userInfo.address}
            onChange={(e) => updateInfo("address", e.target.value)}
            variant="filled"
          />

          <TextField
            label="NRC"
            size="small"
            id="nrc"
            type="text"
            value={userInfo.nrc}
            onChange={(e) => updateInfo("nrc", e.target.value)}
            variant="filled"
          />

          <TextField
            label="Password"
            size="small"
            id="password"
            type="password"
            value={userInfo.password}
            onChange={(e) => updateInfo("password", e.target.value)}
            variant="filled"
          />

          <TextField
            label="Confirm Password"
            size="small"
            id="confirm_password"
            type="password"
            value={userInfo.confirm_password}
            onChange={(e) => updateInfo("confirm_password", e.target.value)}
            variant="filled"
          />

          <div className="flex justify-center">
            <Button onClick={registerHandler} variant="contained">
              {" "}
              Register{" "}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

export default Register;
