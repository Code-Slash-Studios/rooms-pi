const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const ping = require("ping");
const os = require("os");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  let localIP = '255.255.255.255';

  // Search for the first non-internal IP address
  for (let iface in interfaces) {
    interfaces[iface].forEach((details) => {
      if (details.family === 'IPv4' && !details.internal) {
        localIP = details.address;
        return;
      }
    });
  }
  return localIP;
}

async function checkESX() {
  try {
    const res = await ping.promise.probe("1.1.1.1", { timeout: 2, min_reply: 1 });

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
    const res = await ping.promise.probe("8.8.8.8", { timeout: 2, min_reply: 1 });

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
    fullscreen: true, // 👈 This enables fullscreen mode
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the initial loading screen
  mainWindow.loadFile(path.join(__dirname, 'loading.html'));

  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(async () => {
  // Bypass SSL certificate errors by setting the certificate verification procedure
  session.defaultSession.setCertificateVerifyProc((request, callback) => {
    callback(0); // Always accept the certificate
  });

  const mainWindow = createWindow(); // Create the main window and initially load the loading screen

  // Run both tests for ESX and CIS server
  const esxOnline = await checkESX();
  const cisOnline = await checkCIS();

  // Get local IP address after the tests have been completed
  const localIP = getLocalIP();
  console.log(localIP);

  // Send the results to the loading page
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('setLoadingResults', { esxOnline, cisOnline, localIP });
  });

  // Load either index.html or unavailable.html depending on the result
  const isOnline = esxOnline && cisOnline;

  if (isOnline) {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  } else {
    mainWindow.loadFile(path.join(__dirname, 'loading.html'));
  }

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
