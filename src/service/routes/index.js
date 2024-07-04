module.exports = (app) => {
  var express = require("express");
  const cors = require("cors");
  const logging = require("../../middlewares/logging");
  const { consumerMessage } = require("../../helper/mqtt/mqtt.controller");

  const accessRoute = require("./access.route");

  //cross site
  app.use(cors());
  app.use(logging.logResponseBody);
  app.use(express.urlencoded({ limit: "80mb", extended: true }));
  app.use(express.raw());
  app.use(express.json({ limit: "80mb", extended: true }));
  app.use("/api/v1", accessRoute);

  app.get("/", (req, res) => {
    res.send("server running");
  });

  app.get("*", (req, res) => {
    res.send({ error: 404, message: `find not found path ${req.originalUrl}` });
  });

  (async () => {
    await consumerMessage();
  })();
};
