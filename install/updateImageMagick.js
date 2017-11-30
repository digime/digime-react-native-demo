const path = require("path");
const updateFile = require("./updateFile.js");

// current app-icon dep references the 'convert' command
// however this is already used in Windows to convert Disk Volumes
// also in the new version of magick (for windows) "magick" is used
// perhaps this was their work around. Unsure if the same is present
// on Linux / macOS builds
updateFile(path.resolve("./node_modules/app-icon/src/resize/resize-image.js"), `convert`, `magick`);
