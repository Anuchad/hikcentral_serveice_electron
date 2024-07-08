const { app } = require("electron");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

// Function to download a folder as a zip
async function downloadFolder(pathSave) {
  try {
    const pathLog = path.join(__dirname, "../log");
    // console.log("test : ", path.join(__dirname, "../log"));
    console.log("pathSave : ", pathSave);
    const output = fs.createWriteStream(`${pathSave}/logs.zip`);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on("close", function () {
      console.log(archive);
      console.log(archive.pointer() + " total bytes");
      console.log(
        "archiver has been finalized and the output file descriptor has closed."
      );
    });
    archive.pipe(output);

    const logFiles = await findLogFiles(path.join(__dirname, "../log"));

    for (const logFile of logFiles) {
      archive.file(logFile, { name: path.basename(logFile) });
    }

    archive.finalize();
    console.log("Folder downloaded as zip successfully!");
  } catch (err) {
    console.error("Error downloading folder as zip:", err);
  }
}

async function findLogFiles(directory) {
  const files = await fs.promises.readdir(directory);
  const logFiles = [];

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = await fs.promises.stat(filePath);

    if (stats.isDirectory()) {
      logFiles.push(...(await findLogFiles(filePath)));
    } else if (path.extname(file).toLowerCase() === ".log") {
      logFiles.push(filePath);
    }
  }

  return logFiles;
}

module.exports = {
  downloadFolder,
};
