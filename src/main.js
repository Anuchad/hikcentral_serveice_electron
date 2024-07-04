const { app, ipcMain, BrowserWindow } = require("electron/main");
const path = require("node:path");
require('dotenv').config({path: path.join(__dirname, "../.env")});
// const appExpress = require("./service/index")
const {
  startServer,
  stopServer,
  restartServer,
  checkServerRunning,
} = require("./middlewares/serviceController");

// dotenv.config({ path: path.join(__dirname, '../.env') });

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 400,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  // win.webContents.openDevTools();
  win.loadFile(path.join(__dirname, "./html/index.html"));
}

app.whenReady().then(() => {
  startServer();
  // appExpress.listen(process.env.PORT,() => {
  //   console.log(`Server ${process.env.NAME} is running on port ${process.env.PORT}.`);
  // })
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  stopServer();

  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("check-server-status", async () => {
  console.log("Check server...");
  const processStatus = checkServerRunning();
  // return processStatus;
});

ipcMain.on("stop-server", () => {
  console.log("Stop server...");
  stopServer();
});

ipcMain.on("restart-server", () => {
  console.log("Restarting server...");
  restartServer();
});
