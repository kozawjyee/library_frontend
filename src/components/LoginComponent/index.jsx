import { Button, Card, TextField } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import PropTypes from "prop-types";

function LoginComponent({
  label,
  title,
  username,
  password,
  setUserName,
  setPassword,
  onLogin,
}) {
  const [isShowPw, setIsShowPw] = useState(false);

  return (
    <div className="space-y-5 w-full grid place-items-center">
      {/* <Paper elevation={3} sx={{ maxWidth: 500 }}> */}
      <p className="text-center text-white text-[45px] font-bold drop-shadow-md px-5 py-3">
        {" "}
        {title}
      </p>
      {/* </Paper> */}
      <Card
        className="px-5 w-full py-5 space-y-5 grid place-items-center"
        elevation={3}
        sx={{ maxWidth: 500 }}
      >
        <p className="text-center text-primary text-[25px] font-semibold px-5">
          {" "}
          {label}
        </p>

        <TextField
          className="w-full px-5"
          id="username"
          label="Username"
          variant="filled"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />

        <div className="w-full relative">
          <TextField
            type={isShowPw ? "text" : "password"}
            className="w-full"
            id="password"
            label="Password"
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => setIsShowPw((prev) => !prev)}
            className="absolute h-full right-0 top-0 bottom-0 px-3"
          >
            {isShowPw ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
          </button>
        </div>

        <Button onClick={onLogin} variant="contained">
          Login
        </Button>
      </Card>
    </div>
  );
}

export default LoginComponent;

LoginComponent.propTypes = {
  label: PropTypes.string.isRequired,
  title: PropTypes.string,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setUserName: PropTypes.func,
  setPassword: PropTypes.func,
  onLogin: PropTypes.func,
};
