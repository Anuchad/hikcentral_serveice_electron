const express = require("express");
const app = express();
const { logService } = require("../middlewares/logging");

require("./routes")(app);

// set port, listen for requests
const PORT = process.env.PORT;
let server;

function startServer() {
  server = app.listen(PORT, () => {
    const message = `Server ${process.env.name} is running on port ${PORT}.`;
    logService(message);
  });
  server.timeout = 1000 * 60 * 30;
}

function stopServer() {
  server.close(() => {
    const message = `Server is stopped ${process.env.TOKEN}`;
    logService(message);
  });
}

async function restartServer() {
  console.log("Server is restarted");
  logService("Server is restarted");
  await stopServer();
  await startServer();
}

function checkServerRunning() {
  logService("Check Service Running....");
  return server && !server.writableFinished;
}

module.exports = {
  startServer,
  stopServer,
  restartServer,
  checkServerRunning,
};
