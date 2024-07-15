module.exports = (app) => {
  var express = require("express");
  const cors = require("cors");
  const { errors } = require("celebrate");
  const { consumerMessage } = require("../../helper/mqtt/mqtt.controller");
  const logging = require("../../middlewares/logging");

  const accessRoute = require("./v1/access.route");
  const personRoute = require("./v1/person.route");

  //cross site
  app.use(cors());
  app.use(logging.logResponseBody);
  app.use(express.urlencoded({ limit: "80mb", extended: true }));
  app.use(express.raw());
  app.use(express.json({ limit: "80mb", extended: true }));

  app.use("/api/v1/access", accessRoute);
  app.use("/api/v1", personRoute);

  app.use(errors());

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
