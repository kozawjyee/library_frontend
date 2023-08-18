import axios from "axios";
import apiconfig from "./apiservice";
import Cookies from "universal-cookie";
const url = "/book";
const cateUrl = "/bookcategory";
const imageupload = "/upload/image";
const cookie = new Cookies();

export const getAllBooks = async () => {
  const resp = await apiconfig.get(url);
  return resp;
};

export const bookDetail = async (id) => {
  const resp = await apiconfig.get(`${url}/${id}`);
  return resp;
};

export const createBook = async (data) => {
  const resp = await apiconfig.post(url, data);
  return resp;
};

export const deletebook = async (id) => {
  const resp = await apiconfig.delete(`${url}/${id}`);
  return resp;
};

export const updatebook = async (id, data) => {
  const resp = await apiconfig.put(`${url}/${id}`, data);
  return resp;
};

export const getCategories = async () => {
  const resp = await apiconfig.get(cateUrl);
  return resp;
};

export const uploadBookImage = async (formdata) => {
  const resp = await axios.post(
    `${import.meta.env.VITE_API_URL}${imageupload}`,
    formdata,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        secret_key: cookie.get(import.meta.env.VITE_ACS_TOKEN, { path: "/" }),
      },
    }
  );
  return resp;
};
