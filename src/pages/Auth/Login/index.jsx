import { useContext, useState } from "react";
import LoginComponent from "../../../components/LoginComponent";
import style from "./styles.module.css";
import { NavLink } from "react-router-dom";
import { userLogin } from "../../../services/authservice";
import { login } from "../../../util/authProvider";
import { UserContext } from "../../../context/UserContext";
import { ErrorContext } from "../../../context/ErrorContext";
import { errorProvier } from "../../../util/errorProvider";
import { Backdrop, CircularProgress } from "@mui/material";
import jwtDecode from "jwt-decode";

function Login() {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const { setUser } = useContext(UserContext);
  const { showError } = useContext(ErrorContext);
  const [loading, setLoading] = useState(false);

  const updateUserInfo = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  const LoginHandler = async () => {
    setLoading(true);
    await userLogin(userInfo)
      .then((resp) => {
        login(resp.data.data.accessToken, resp.data.data.refreshToken);
        const decoded = jwtDecode(resp.data.data.accessToken);
        if (decoded.user_role === "user") {
          setUser(resp.data.data.user);
          return window.location.replace("/books");
        }
        setLoading(false);
        return showError({
          code: 0,
          title: "Permission Denied",
          message: "Only admins can login here",
        });
      })
      .then((err) => {
        showError(errorProvier(err));
        setLoading(false);
      });
  };
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div
        className={`${style.background} w-full min-h-[100vh] flex flex-col justify-center items-center`}
      >
        <LoginComponent
          label="User Login"
          title="Library In Your PC"
          username={userInfo.username}
          password={userInfo.password}
          setUserName={(e) => updateUserInfo("username", e)}
          setPassword={(e) => updateUserInfo("password", e)}
          onLogin={LoginHandler}
        />

        <NavLink
          to="/auth/register"
          className="text-[#1565C0] bg-white px-2 rounded-sm underline font-bold mt-3"
        >
          Register user
        </NavLink>
      </div>
    </>
  );
}

export default Login;
