import apiconfig from "./apiservice";
const url = "/borrow";

export const createBorrow = async (data) => {
  const resp = await apiconfig.post(url, data);
  return resp;
};

export const getBorrows = async () => {
  const resp = await apiconfig.get(url);
  return resp;
};

export const endBorrow = async (id, data) => {
  const resp = await apiconfig.put(`${url}/${id}`, data);
  return resp;
};
