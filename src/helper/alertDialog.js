const { dialog } = require("electron/main");
const path = require("node:path");

// function alert dialog
function alertConfirm(win, action) {
  let messageAlert;
  if (action === "stop") {
    messageAlert = "Are you sure you want to stop?";
  } else {
    messageAlert = "Are you sure you want to restart?";
  }
  const choice = dialog.showMessageBoxSync(win, {
    type: "question",
    buttons: ["Yes", "No"],
    title: "Confirm",
    message: messageAlert,
    icon: path.join(__dirname, "../img/icon.png"),
  });

  return choice;
}

function alertNotRunning(win) {
  const choice = dialog.showMessageBoxSync(win, {
    type: "info",
    buttons: ["Yes"],
    title: "Confirm",
    message: "Please start the Letmein Gateway Service first.",
    icon: path.join(__dirname, "../img/icon.png"),
  });

  return choice;
}

module.exports = {
  alertConfirm,
  alertNotRunning,
};
