import Cookies from "universal-cookie";
// import { userLogout } from "../services/authservice";
// eslint-disable-next-line no-undef
const { VITE_ACS_TOKEN, VITE_REF_TOKEN } = import.meta.env;
const cookie = new Cookies();

export const login = (acstoken, reftoken) => {
  cookie.set(VITE_ACS_TOKEN, acstoken, { path: "/" });
  cookie.set(VITE_REF_TOKEN, reftoken, { path: "/" });
};

export const logout = async (role) => {
  if (role === "librarian") {
    cookie.remove(VITE_ACS_TOKEN, { path: "/" });
    cookie.remove(VITE_REF_TOKEN, { path: "/" });
    window.location.replace("/auth/adminlogin");
  } else {
    cookie.remove(VITE_ACS_TOKEN, { path: "/" });
    cookie.remove(VITE_REF_TOKEN, { path: "/" });
    window.location.replace("/auth");
  }
  // await userLogout()
  //   .then((resp) => console.log(resp))
  //   .catch((err) => console.log(err));
};
