const { app, BrowserWindow } = require('electron');
const path = require('path');
const ping = require("ping");


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

async function checkESX() {
  try {
    const res = await ping.promise.probe("8.8.8.8", { timeout: 2, min_reply: 1 });

    if (!res.alive || res.packetLoss === "100.000") {
      console.error("No response received. ESX server is unavailable.");
      return false;
    }

    console.log("ESX is working.");
    return true;
  } catch (error) {
    console.error("Ping failed:", error);
    return false;
  }
}

async function checkCIS() {
  try {
    const res = await ping.promise.probe("1.1.1.1", { timeout: 2, min_reply: 1 });

    if (!res.alive || res.packetLoss === "100.000") {
      console.error("No response received. CIS server unavailable.");
      return false;
    }

    console.log("CIS is working.");
    return true;
  } catch (error) {
    console.error("Ping failed:", error);
    return false;
  }
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the initial loading screen
  mainWindow.loadFile(path.join(__dirname, 'loading.html'));

  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(async () => {
  const mainWindow = createWindow(); // Create the main window and initially load the loading screen

  // Run both tests for ESX and CIS server
  const esxOnline = await checkESX();
  const cisOnline = await checkCIS();

  // Load either index.html or unavailable.html depending on the result
  const isOnline = esxOnline || cisOnline;
  const nextPage = isOnline ? "index.html" : "unavailable.html";

  mainWindow.loadFile(path.join(__dirname, nextPage)); // Update the window to load the next page after the tests are completed

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();  // Optional
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
