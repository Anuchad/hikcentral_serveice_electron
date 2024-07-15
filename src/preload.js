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
      isRunning = await ipcCheckSubscript();
      console.log("isRunning : ", isRunning);
    }

    setStatus(`${type}-status`, isRunning);
    setOperation(`${type}-operation`, isRunning);
  }

  //Action Button gateway-operation
  const gatewayOperation = document.getElementById("gateway-operation");

  gatewayOperation.addEventListener("click", async () => {
    const status = gatewayOperation.getAttribute("data-status");
    console.log("data-status : ", status);

    if (status === "stop") {
      const isStop = await ipcStopServer();
      console.log("isStop : ", isStop);
      if (isStop) {
        setStatus("gateway-status", false);
        setOperation("gateway-operation", false);
      }
    } else if (status === "restart") {
      const isRestart = await ipcRestartServer();
      console.log("isRestart : ", isRestart);
      if (isRestart) {
        setStatus("gateway-status", true);
        setOperation("gateway-operation", true);
      }
    }
  });

  //Action Button lpr subscript
  const lprOperation = document.getElementById("lpr-operation");

  lprOperation.addEventListener("click", async () => {
    const status = lprOperation.getAttribute("data-status");
    console.log("data-status : ", status);
    if (status === "stop") {
      const isCancelLpr = await ipcRenderer.invoke("cancel-subscript-lpr");
      console.log("isCancelLpr : ", isCancelLpr);
      if (isCancelLpr) {
        setStatus("lpr-status", false);
        setOperation("lpr-operation", false);
      }
    } else if (status === "restart") {
      const isRestartLpr = await ipcRenderer.invoke("subscript-lpr");
      console.log("isRestartLpr : ", isRestartLpr);
      if (isRestartLpr) {
        setStatus("lpr-status", true);
        setOperation("lpr-operation", true);
      }
    }
  });

  //Action Button Download Log
  document
    .getElementById("download-log")
    .addEventListener("click", async () => {
      const file = await ipcRenderer.invoke("open-dialog");

      if (!file.canceled) {
        await ipcRenderer.invoke("download-log", file.filePaths[0]);
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

async function ipcStopServer() {
  const status = await ipcRenderer.invoke("stop-server");
  return status;
}

async function ipcRestartServer() {
  const status = await ipcRenderer.invoke("restart-server");
  return status;
}

async function ipcCheckSubscript() {
  const status = await ipcRenderer.invoke("check-subscript");
  return status;
}
