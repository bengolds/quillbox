const electron = require('electron');
const {app, BrowserWindow, globalShortcut, Menu, Tray} = electron
const path = require('path')
const url = require('url')

let win;

function createWindow() {
    let width = 100;
    let height = 100;
    const {width:screenWidth, height:screenHeight} = electron.screen.getPrimaryDisplay().workAreaSize;
    let left = screenWidth/2 - width/2;
    let top = screenHeight/2 - height/2;
    win = new BrowserWindow({
        width:width,
        height: height,
        x: left,
        y: top,
        frame:false,
        alwaysOnTop: true,
        skipTaskbar: true,
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'popup.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.on('closed', () => {
        win=null;
    });
}

function toggleWindow() {
    if (win) {
        win.close();
    }
    else {
        createWindow();
    }
}


let tray = null
app.on('ready', () => {
    globalShortcut.register('CommandOrControl+Shift+M', () => {
        toggleWindow();
    });

    let iconPath = path.join(__dirname, 'quill.png');
    tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Quit', role: 'quit'}
    ]);
    tray.setToolTip('Quillbox');
    tray.setContextMenu(contextMenu);
});

app.on('window-all-closed', () => {});
