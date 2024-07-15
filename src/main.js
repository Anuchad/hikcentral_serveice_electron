const { app, ipcMain, dialog, BrowserWindow } = require("electron/main");
const { alertConfirm, alertNotRunning } = require("./helper/alertDialog");
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const {
  checkSubscribeStatus,
  subscript,
  cancelSubscript,
} = require("./helper/subscriptLpr");

const {
  startServer,
  stopServer,
  restartServer,
  checkServerRunning,
} = require("./service/index");

const { downloadFolder } = require("./helper/download");

let win;

function createWindow() {
  win = new BrowserWindow({
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

ipcMain.handle("stop-server", async () => {
  console.log("Stop server...");
  const confirm = alertConfirm(win, "stop");
  if (confirm == 0) {
    return await stopServer();
  }
  return false;
});

ipcMain.handle("restart-server", async () => {
  console.log("Restarting server...");
  const confirm = alertConfirm(win, "restart");
  if (confirm == 0) {
    return await restartServer();
  }
  return false;
});

ipcMain.handle("download-log", async (event, path) => {
  console.log("Start Download Log...", path);
  const download = downloadFolder(path);
  return download;
});

ipcMain.handle("open-dialog", async () => {
  const file = dialog.showOpenDialog({
    defaultPath: app.getPath("downloads"),
    properties: ["openDirectory"],
  });
  return file;
});

// for lpr
ipcMain.handle("check-subscript", async () => {
  return await checkSubscribeStatus();
});

ipcMain.handle("subscript-lpr", async () => {
  const confirm = alertConfirm(win, "restart");
  if (confirm == 0) {
    const processStatus = await subscript();
    if (!processStatus) {
      alertNotRunning(win);
    } else {
      return true;
    }
  }

  return false;
});

ipcMain.handle("cancel-subscript-lpr", async () => {
  const confirm = alertConfirm(win, "stop");
  if (confirm == 0) {
    const processStatus = await cancelSubscript();
    if (!processStatus) {
      alertNotRunning(win);
    } else {
      return true;
    }
  }

  return false;
});
