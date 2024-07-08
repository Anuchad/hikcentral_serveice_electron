const { remote, dialog, ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("submit").addEventListener("click", async () => {
    const token = document.getElementById("token");
    await ipcRenderer.invoke("check-token", token.value);
  });
});
