var Path = require('path'),
    ElectronApp = require('app'),
    BrowserWindow = require('browser-window'),
    Tray = require('tray'),
    GlobalShortcut = require('global-shortcut'),
    Ipc = require('ipc'),
    dialog = require('dialog')

//
// APP WINDOW
//

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null
var buildWindow = function() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 700,
    center: true,
    'auto-hide-menu-bar': false,
    //resizable: false,
    //frame: false
  })

  mainWindow.menu = null;
  // Load the index.html of the app.
  mainWindow.loadUrl(Path.join('file:/', __dirname, 'index.html'))

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object
    mainWindow = null
  })
}

//
// LOGGER
//

// This function sends messages to the mainWindow, to log stuff in developer tools
var logToBrowser = function() {
  if (mainWindow && mainWindow !== null) {
    var baseArgs = ['console.log']
    mainWindow.webContents.send.apply(mainWindow.webContents, baseArgs.concat([].slice.call(arguments)))
  }
}

//
// TRAY ICON
//

var iconPath = Path.join(__dirname, 'icon.png'),
    appIcon = null
var buildTray = function() {
  appIcon = new Tray(iconPath)
  appIcon.setTitle('BioCrawl')
  appIcon.on('clicked', function(e, bounds) {
    logToBrowser('app icon clicked', e)

    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.setPosition(parseInt(bounds.x - (bounds.width / 2) - 400), bounds.y - bounds.height - 380)
      mainWindow.show()
    }
  })
}


//
// WINDOW EVENTS
//
//
Ipc.on('select.media', function(event){

    dialog.showOpenDialog({ properties: [ 'openDirectory' ]}, function(result) {
      // we got the directory for media
      mainWindow.webContents.send('selected.media', result[0])
    });

});
//
// APP LIFECYCLE
//

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
ElectronApp.on('ready', function() {
  buildWindow()
  buildTray()
})

ElectronApp.on('will-quit', function() {
  GlobalShortcut.unregisterAll()
})
