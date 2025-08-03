const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

let appIcon = nativeImage.createFromPath("./assests/todo.png")

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'frontend/src/js/preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
            devTools: true,
            allowRunningInsecureContent: true
        },
        center: true,
        icon: appIcon
    });

    mainWindow.loadFile(path.join(__dirname, './frontend/src/pages/login.html'));
    mainWindow.setMenuBarVisibility(true);

}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('quit', () => {
    console.log('Server closed');
});
