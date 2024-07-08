const { app, ipcMain, dialog, BrowserWindow } = require("electron/main");
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const {
  startServer,
  stopServer,
  restartServer,
  checkServerRunning,
} = require("./service/index");

const { validateToken } = require("./helper/validateToken");
const { setDataEnv } = require("./helper/setEnv");
const { downloadFolder } = require("./helper/download");

let tokenWindow;
let win;

function createWindowToken() {
  tokenWindow = new BrowserWindow({
    width: 800,
    height: 400,
    // resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "./preloadToken.js"),
    },
  });

  tokenWindow.webContents.openDevTools();
  tokenWindow.loadFile("./html/token.html");
}

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
  createWindowToken();

  ipcMain.handle("check-token", async (event, token) => {
    console.log("Check token...");

    const validate = await validateToken(token);
    if (validate && validate.staus == 1) {
      await setDataEnv("TOKEN", token);
      tokenWindow.close();
      startServer();
      createWindow();
    } else if (validate && validate.status == 2) {
      win.close();
      stopServer();
      createWindowToken();
    }

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
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

ipcMain.on("restart-server", async () => {
  console.log("Restarting server...");
  await restartServer();
});

ipcMain.handle("dowload-log", async (event, path) => {
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
