const axios = require("axios");
var qs = require("qs");

// creating an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://api.dev.sanampao.letmein.asia/web",
  headers: {
    Authorization: "Bearer ZFpeYCwbX93X-cSDeCd696K2_P9og833",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // ตรวจสอบว่ามีพารามิเตอร์ที่ต้องแปลงเป็น query string หรือไม่
    if (config.method === "get" && config.params) {
      config.paramsSerializer = (params) => {
        return qs.stringify(params, { arrayFormat: "brackets" });
      };
    }
    // ตรวจสอบว่ามี data ที่ต้องแปลงเป็น query string หรือไม่
    if (["post", "put", "patch"].includes(config.method) && config.data) {
      config.data = qs.stringify(config.data);
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

module.exports = {
  axiosInstance,
};
