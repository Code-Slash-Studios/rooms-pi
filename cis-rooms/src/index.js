const { app, BrowserWindow } = require('electron');
const path = require('path');
const ping = require("ping");


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

async function checkESX() {
  try {
    const res = await ping.promise.probe("155.155.155.155", { timeout: 2, min_reply: 1 });

    if (!res.alive || res.packetLoss === "100.000") {
      console.error("No response received. ESX server is unavailable.");
      return false;
    }

    console.log("Internet is working.");
    return true;
  } catch (error) {
    console.error("Ping failed:", error);
    return false;
  }
}

async function checkCIS() {
  try {
    const res = await ping.promise.probe("155.155.155.155", { timeout: 2, min_reply: 1 });

    if (!res.alive || res.packetLoss === "100.000") {
      console.error("No response received. CIS server unavailable.");
      return false;
    }

    console.log("Internet is working.");
    return true;
  } catch (error) {
    console.error("Ping failed:", error);
    return false;
  }
}

const createWindow = (htmlFile) => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the specified HTML file
  mainWindow.loadFile(path.join(__dirname, htmlFile));
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  const esxOnline = await checkESX();
  const cisOnline = await checkCIS();

  // Load index.html if at least one check passes; otherwise, load unavailable.html
  const isOnline = esxOnline || cisOnline;
  createWindow(isOnline ? "index.html" : "unavailable.html");

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(isOnline ? "index.html" : "unavailable.html");
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
