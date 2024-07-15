const { axiosInstance } = require("./axios/axiosLocal.config");

async function checkSubscribeStatus() {
  const result = axiosInstance.get("/api/v1/access/check-status");
  if (result && result.code == 0) {
    if (
      result.data.detail.length != 0 &&
      result.data.detail[0].eventTypes[0].eventTypes[0] == "131622" &&
      result.data.detail[0].eventTypes[0].eventDest ==
        `http://${process.env.IP_LPR}:${process.env.PORT_LPR}/eventRcv`
    ) {
      return true;
    }
  }
  return false;
}

async function subscript() {
  const result = axiosInstance.post("/api/v1/access/subscript");
  if (result && result.code == 0) {
    return true;
  }
  return false;
}

async function cancelSubscript() {
  const result = axiosInstance.post("/api/v1/access/cancel-subscript");
  if (result && result.code == 0) {
    return true;
  }
  return false;
}

module.exports = {
  checkSubscribeStatus,
  subscript,
  cancelSubscript,
};
