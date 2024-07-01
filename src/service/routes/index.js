module.exports = (app) => {
  var express = require("express");
  const cors = require("cors");
  const logging = require("../../middlewares/logging");

  //cross site
  app.use(cors());

  app.use(logging.logResponseBody);

  // parse requests of content-type - application/json
  app.use(express.urlencoded({ limit: "80mb", extended: true }));
  app.use(express.raw());
  // parse application/json
  app.use(express.json({ limit: "80mb", extended: true }));

  app.get("/", (req, res) => {
    res.send("server running");
  });

  // app.use('/api/v1', hikcentral)
  // app.use('/api/v2', person)
  // app.use('/api/v2', vehicle)
  // app.use('/api/v2', access)

  app.get("*", (req, res) => {
    res.send({ error: 404, message: `find not found path ${req.originalUrl}` });
  });
};
