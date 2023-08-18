export const errorProvier = (err) => {
  const error = {
    code: err.response ? err.response.status : 0,
    title: err.message ? err.message : "Error",
    message: err.response ? err.response.data.message : err.message,
  };
  return error;
};
