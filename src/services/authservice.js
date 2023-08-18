/* eslint-disable no-undef */
import axios from "axios";
import apiconfig from "./apiservice";
const url = "/auth/register";
const signInUrl = "/auth/signin";
const logoutUrl = "/auth/logout";
const userdetailUrl = "/auth";
export const register = async (data) => {
  const resp = await axios.post(`${import.meta.env.VITE_API_URL}${url}`, data);
  return resp;
};

export const userLogin = async (data) => {
  const resp = await axios.post(
    `${import.meta.env.VITE_API_URL}${signInUrl}`,
    data
  );
  return resp;
};

export const userLogout = async () => {
  const resp = await axios.get(`${import.meta.env.VITE_API_URL}${logoutUrl}`);
  return resp;
};

export const userDetail = async (id) => {
  const response = await apiconfig.get(`${userdetailUrl}/${id}`);
  return response;
};

export const userUpdate = async (id, data) => {
  const response = await apiconfig.put(`${userdetailUrl}/${id}`, data);
  return response;
};
