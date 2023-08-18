import axios from "axios";
import Cookies from "universal-cookie";

const cookie = new Cookies();

const apiconfig = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    secret_key: cookie.get(import.meta.env.VITE_ACS_TOKEN, { path: "/" }),
  },
});

export default apiconfig;
