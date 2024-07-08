const { ipcRenderer } = require("electron");

const statusStarted = `<img class="icon-status" src="../img/icon/correct.png" /> <p class="flex-item-right">Started</p>`;
const statusStopped = `<img class="icon-status" src="../img/icon/incorrect.png" /> <p class="flex-item-right">Stopped</p>`;
const statusStarting = `<img class="icon-status" src="../img/icon/loading.png" /> <p class="flex-item-right">Starting...</p>`;
const statusStopping = `<img class="icon-status" src="../img/icon/loading.png" /> <p class="flex-item-right">Stopping...</p>`;

window.addEventListener("DOMContentLoaded", async () => {
  for (const type of ["gateway", "lpr"]) {
    let isRunning;
    if (type === "gateway") {
      isRunning = await ipcCheckServer();
      console.log("isRunning : ", isRunning);
    } else if (type === "lpr") {
    }

    setStatus(`${type}-status`, isRunning);
    setOperation(`${type}-operation`, isRunning);
  }

  //Action Button gateway-operation
  const gatewayOperation = document.getElementById("gateway-operation");

  gatewayOperation.addEventListener("click", () => {
    const status = gatewayOperation.getAttribute("data-status");
    console.log("data-status : ", status);

    if (status === "stop") {
      ipcStopServer();
      setStatus("gateway-status", false);
      setOperation("gateway-operation", false);
    } else if (status === "restart") {
      ipcRestartServer();
      setStatus("gateway-status", true);
      setOperation("gateway-operation", true);
    }
  });

  document.getElementById("dowload-log").addEventListener("click", async () => {
    const file = await ipcRenderer.invoke("open-dialog");

    if (!file.canceled) {
      await ipcRenderer.invoke("dowload-log", file.filePaths[0]);
    }
  });
});

//function for update status
function setStatus(id, status) {
  let statusNow, statusWait;
  if (status) {
    statusNow = statusStarted;
    statusWait = statusStarting;
  } else {
    statusNow = statusStopped;
    statusWait = statusStopping;
  }

  const txtStatus = document.getElementById(id);
  txtStatus.innerHTML = statusWait;
  setTimeout(() => {
    txtStatus.innerHTML = statusNow;
  }, 500);
}

function setOperation(id, status) {
  let operation, action;
  if (status) {
    operation = `<center><button id="${id}" class="operation-button" data-status="stop"><img class="icon-button" src="../img/icon/stop.png" /></button></center>`;
    action = "stop";
  } else {
    operation = `<center><button id="${id}" class="operation-button" data-status="restart"><img class="icon-button" src="../img/icon/restart.png" /></button></center>`;
    action = "restart";
  }

  const txtStatus = document.getElementById(id);
  setTimeout(() => {
    txtStatus.innerHTML = operation;
    txtStatus.setAttribute("data-status", action);
  }, 500);
}

//ipc for action service api
async function ipcCheckServer() {
  const status = await ipcRenderer.invoke("check-server-status");
  return status;
}

function ipcStopServer() {
  ipcRenderer.send("stop-server");
}

function ipcRestartServer() {
  ipcRenderer.send("restart-server");
}
