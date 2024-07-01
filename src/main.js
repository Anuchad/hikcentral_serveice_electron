const { app, ipcMain, BrowserWindow } = require("electron/main");
const {
  startServer,
  stopServer,
  restartServer,
  checkServerRunning,
} = require("./middlewares/service_control");
const path = require("node:path");

require("dotenv").config();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 400,
    // resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  win.webContents.openDevTools();
  win.loadFile("./html/index.html");
}

app.whenReady().then(() => {
  startServer();
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
  return processStatus;
});

ipcMain.on("stop-server", () => {
  console.log("Stop server...");
  stopServer();
});

ipcMain.on("restart-server", () => {
  console.log("Restarting server...");
  restartServer();
});
