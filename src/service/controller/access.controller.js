const { axiosInstance } = require("../../helper/axios/axiosJson.config");

async function checkStatusSubscribeLpr(req, res, next) {
  const data = await axiosInstance.post(
    "/artemis/api/eventService/v1/eventSubscriptionView",
    {}
  );

  return res.send(data.data);
}

async function subscribeLpr(req, res, next) {
  const data = await axiosInstance.post(
    "/artemis/api/eventService/v1/eventSubscriptionByEventType",
    {
      eventTypes: [131622],
      eventDest: `http://${process.env.IP_LPR}:${porcess.env.PORT_LPR}/eventRcv`,
    }
  );

  return res.send(data.data);
}

async function cancelSubscribeLpr() {
  const data = await axiosInstance.post(
    "/artemis/api/eventService/v1/eventUnSubscriptionByEventTy",
    {
      eventTypes: [131622],
    }
  );

  return res.send(data.data);
}

module.exports = {
  checkStatusSubscribeLpr,
  subscribeLpr,
  cancelSubscribeLpr,
};
