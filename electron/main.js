
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// Register IPC handlers
require("./ipc/dashboard.ipc")(ipcMain);
require("./ipc/projects.ipc")(ipcMain);
require("./ipc/equipment.ipc")(ipcMain);
require("./ipc/manpower.ipc")(ipcMain);
require("./ipc/alerts.ipc")(ipcMain);

const isDev =
  process.env.NODE_ENV !== "production" && !app.isPackaged;

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: "Construction Monitor",
    backgroundColor: "#0f172a",

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDev) {
    const devUrl =
      process.env.VITE_DEV_SERVER_URL ||
      "http://localhost:5173";

    mainWindow.loadURL(devUrl);

  } else {
    mainWindow.loadFile(
      path.join(__dirname, "../dist/index.html")
    );
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
