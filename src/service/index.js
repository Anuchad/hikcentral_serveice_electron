const express = require("express");
const app = express();
const { logService } = require("../middlewares/logging");

require("./routes")(app);
// set port, listen for requests
const PORT = process.env.PORT;
let server;

function startServer() {
  if (PORT) {
    server = app.listen(PORT, () => {
      const message = `Server ${process.env.name} is running on port ${PORT}.`;
      logService(message);
    });
    server.timeout = 1000 * 60 * 30;
    return true;
  }
  return false;
}

function stopServer() {
  if (PORT) {
    if (server) {
      server.close(() => {
        const message = `Server is stopped ${process.env.TOKEN}`;
        logService(message);
      });
      server = "";
    }
    return true;
  }
  return false;
}

async function restartServer() {
  if (PORT) {
    console.log("Server is restarted");
    logService("Server is restarted");
    await stopServer();
    await startServer();
    return true;
  }
  return false;
}

function checkServerRunning() {
  logService("Check Service Running....");
  return server && PORT && !server.writableFinished;
}

module.exports = {
  startServer,
  stopServer,
  restartServer,
  checkServerRunning,
};
