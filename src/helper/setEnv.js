const { app } = require("electron");
const fs = require("fs");
const path = require("node:path");

async function setDataEnv(key, value) {
  const envFilePath = path.join(path.join(__dirname, "../../"), ".env");

  // Read the existing .env file
  let envContent = "";
  try {
    envContent = fs.readFileSync(envFilePath, "utf8");
  } catch (err) {
    // If the file doesn't exist, create a new one
    if (err.code === "ENOENT") {
      envContent = "";
    } else {
      console.error("Error reading .env file:", err);
      return;
    }
  }

  // Update or add the new environment variable
  const regex = new RegExp(`^${key}=.*$`, "m");
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `${key}=${value}`);
  } else {
    envContent += `\n${key}=${value}`;
  }

  // Write the updated .env file
  try {
    await fs.writeFileSync(envFilePath, envContent, "utf8");
    console.log(`Set environment variable: ${key}=${value}`);
  } catch (err) {
    console.error("Error writing .env file:", err);
  }
}

module.exports = {
  setDataEnv,
};
