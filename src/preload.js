const { ipcRenderer } = require("electron");

function checkServer() {
  ipcRenderer.send("check-server");
}

function stopServer() {
  ipcRenderer.send("stop-server");
}

function restartServer() {
  ipcRenderer.send("restart-server");
}

window.addEventListener("DOMContentLoaded", async () => {
  // Update status all service
  const updateStatus = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerHTML = `<img class="icon-status" src="../img/icon/loading.png" /> <p class="flex-item-right">Starting...${process.env.PORT}</p>`;
      setTimeout(() => {
        element.innerHTML = text;
      }, 500);
    }
  };

  const updateOperation = (selector, obj) => {
    const element = document.getElementById(selector);
    if (element) {
      setTimeout(() => {
        element.innerHTML = obj.html;
        element.setAttribute("data-status", obj.status);
      }, 500);
    }
  };

  const iconOperation = (type, operation) => {
    let htmlButton;
    console.log("operation : ", operation);
    if (operation) {
      htmlButton = {
        html: `<center><button id="${type}" class="operation-button" data-status="stop"><img class="icon-button" src="../img/icon/stop.png" /></button></center>`,
        status: "stop",
      };
    } else {
      htmlButton = {
        html: `<center><button id="${type}" class="operation-button" data-status="restart"><img class="icon-button" src="../img/icon/restart.png" /></button></center>`,
        status: "restart",
      };
    }

    return htmlButton;
  };

  const iconStatus = (status) => {
    var htmlStatus;
    if (status) {
      htmlStatus = `<img class="icon-status" src="../img/icon/correct.png" /> <p class="flex-item-right">Started ${process.env.DOMAIN}</p>`;
    } else {
      htmlStatus = `<img class="icon-status" src="../img/icon/incorrect.png" /> <p class="flex-item-right">Stopped</p>`;
    }

    return htmlStatus;
  };

  for (const type of ["gateway", "lpr"]) {
    if (type === "gateway") {
      var dataStatus, dataOperation;
      const isRunning = await ipcRenderer.invoke("check-server-status");

      if (isRunning) {
        dataStatus = iconStatus(isRunning);
        dataOperation = iconOperation(isRunning);
      } else {
        dataStatus = iconStatus(isRunning);
        dataOperation = iconOperation(isRunning);
      }
    } else if (type === "lpr") {
      dataStatus = iconStatus(false);
      dataOperation = iconOperation(false);
    }

    updateStatus(`${type}-status`, dataStatus);
    updateOperation(`${type}-operation`, dataOperation);
  }

  //Action Button gateway-operation
  const gatewayOperation = document.getElementById("gateway-operation");

  gatewayOperation.addEventListener("click", () => {
    const status = gatewayOperation.getAttribute("data-status");
    const statusBool = status === "stop" ? false : true;
    if (status === "stop") {
      stopServer();
    } else if (status === "restart") {
      restartServer();
    }

    updateStatus(`gateway-status`, iconStatus(statusBool));
    updateOperation(`gateway-operation`, iconOperation("gateway", statusBool));
  });
});
