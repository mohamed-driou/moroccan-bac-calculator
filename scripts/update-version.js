const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");

function updateFile(filePath, pattern, replacement) {
  try {
    const fullPath = path.join(__dirname, "..", filePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, "utf8");
      content = content.replace(pattern, replacement);
      fs.writeFileSync(fullPath, content);
      console.log(`✓ Updated ${filePath} to v${pkg.version}`);
    }
  } catch (err) {
    console.error(`⚠️ Error updating ${filePath}:`, err.message);
  }
}

// Update files
updateFile("./src/App.jsx", /(version: ["'])(\d+\.\d+\.\d+)(["'])/, `$1${pkg.version}$3`);
updateFile("./.env", /VITE_APP_VERSION=\d+\.\d+\.\d+/, `VITE_APP_VERSION=${pkg.version}`);
