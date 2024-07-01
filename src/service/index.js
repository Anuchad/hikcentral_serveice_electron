const express = require("express");
// config env
const app = express();

require("./routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || process.env.port;
var server = app.listen(PORT, () => {
  console.log(`Server ${process.env.name} is running on port ${PORT}.`);
});
server.timeout = 1000 * 60 * 30;

// เพื่อให้สามารถรีสตาร์ทได้ เราจะต้องจัดการกับ shutdown
function shutdown() {
  server.close(() => {
    console.log("Express server closed.");
    process.exit(0);
  });
}

// process.on("SIGTERM", shutdown);
// process.on("SIGINT", shutdown);
