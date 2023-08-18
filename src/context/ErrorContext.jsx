import { createContext, forwardRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";
export const ErrorContext = createContext();

const { VITE_ACS_TOKEN, VITE_REF_TOKEN } = import.meta.env;

function ErrorProvider({ children }) {
  const cookie = new Cookies();
  const [error, setError] = useState({
    isError: false,
    code: 0,
    title: "",
    message: "",
  });

  const handleClose = () => {
    if (error.code === 401) {
      setError({
        isError: false,
        code: 0,
        title: "",
        message: "",
      });
      const token = cookie.get(VITE_ACS_TOKEN, { path: "/" });
      const decoded = jwtDecode(token);

      if (decoded.user_role === "librarian") {
        cookie.remove(VITE_ACS_TOKEN, { path: "/" });
        cookie.remove(VITE_REF_TOKEN, { path: "/" });
        window.location.replace("/auth/adminlogin");
      } else {
        cookie.remove(VITE_ACS_TOKEN, { path: "/" });
        cookie.remove(VITE_REF_TOKEN, { path: "/" });
        window.location.replace("/auth");
      }
    }
    return setError({
      isError: false,
      code: 0,
      title: "",
      message: "",
    });
  };

  const showError = ({ code, title, message }) => {
    setError({
      isError: true,
      code: code,
      title: title,
      message: message,
    });
  };
  const defaultValue = { showError };

  const TransitionComponent = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });
  return (
    <ErrorContext.Provider value={defaultValue}>
      {error.isError && (
        <Dialog
          open={error.isError}
          TransitionComponent={TransitionComponent}
          keepMounted
          onClose={() => setError({ ...error, isError: false })}
        >
          <DialogTitle sx={{ minWidth: 300 }}>{error.title}</DialogTitle>
          <DialogContent sx={{ minWidth: 300 }}>
            <DialogContentText id="error desc">
              {error.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>OK</Button>
          </DialogActions>
        </Dialog>
      )}
      {children}
    </ErrorContext.Provider>
  );
}

export default ErrorProvider;

ErrorProvider.propTypes = {
  children: PropTypes.node,
};
