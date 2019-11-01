import { app } from 'electron';
import serve from 'electron-serve';
const { resolve } = require('path');
import {
  createWindow,
  exitOnChange,
} from './helpers';

const PATH_RAIZ = resolve(__dirname, 'raiz');
const PATH_DOWLOAD = resolve(__dirname, 'dowload');
const PATH_BACKUP = resolve(__dirname, 'backup');
const FILE_PROCESS_BACKUP = '\\backupversionTEMP.zip';
const FILE_NAME = '\\backuplastversion.zip';
const FIE_DOWLOAD = '\\lastversion.zip';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  exitOnChange();
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 400,
    height: 700,
    resizable: false,
    frame: false,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
