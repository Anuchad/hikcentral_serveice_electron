const { axiosInstance } = require("../helper/axios/axiosForm.config");

async function validateToken(token) {
  //   const data = axiosInstance.post("/validate-token", {
  //     token: token,
  //   });

  return {
    staus: 1,
    message: "",
    token: token,
    base_url: "https://api.dev.sanampao.letmein.asia/web",
    app_key: "",
    secret_key: "",
    ip_lpr: "",
    port_lpr: "",
    mqtt: {
      username: "",
      password: "",
      publish: "",
      consumer: "",
    },
  };
}

module.exports = {
  validateToken,
};
