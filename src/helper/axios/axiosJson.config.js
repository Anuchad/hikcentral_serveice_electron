const axios = require("axios");
const { prepareConfigRequestToHCPAPI } = require("../../middlewares/sign");
// creating an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://127.0.0.1",
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers = prepareConfigRequestToHCPAPI(
      process.env.APP_KEY,
      process.env.SECRET_KEY,
      config.url
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

module.exports = {
  axiosInstance,
};
