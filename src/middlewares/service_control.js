const { spawn } = require("child_process");

let serverProcess;

function startServer() {
  // รัน Express server
  serverProcess = spawn("node", ["./src/service/index.js"]);

  // serverProcess.stdout.on("data", (data) => {
  //   console.log(`stdout: ${data}`);
  // });

  // serverProcess.stderr.on("data", (data) => {
  //   console.error(`stderr: ${data}`);
  // });

  serverProcess.on("close", (code) => {
    console.log(`Express server exited with code ${code}`);
  });
}

function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
  }
}

function restartServer() {
  if (serverProcess) {
    serverProcess.kill(); // หยุด server เดิม
    serverProcess = null;
  }
  startServer(); // รัน server ใหม่
}

function checkServerRunning() {
  // ตรวจสอบว่าสถานะของ process ยังไม่ถูก kill
  return serverProcess && !serverProcess.killed;
}

module.exports = {
  startServer,
  stopServer,
  restartServer,
  checkServerRunning,
};
