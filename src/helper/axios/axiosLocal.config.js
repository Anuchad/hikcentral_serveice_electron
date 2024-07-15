const axios = require("axios");
// creating an Axios instance
const axiosInstance = axios.create({
  baseURL: `http://127.0.0.1:${process.env.PORT}`,
});

module.exports = {
  axiosInstance,
};
