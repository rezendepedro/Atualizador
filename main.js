const { resolve } = require('path');
const { app, Menu, Tray, dialog, BrowserWindow, ipcRenderer } = require('electron');
const fs = require('fs');
const AdmZip = require('adm-zip');
const net = require('net');
const child = require('child_process').execFile;
const schedule = require('node-schedule');


//ATUALIZADOR DESKTOP
const PATH_RAIZ = 'C:\\DELPHI\\ECFLBC';
const PATH_DOWLOAD = 'C:\\DELPHI\\ECFLBC\\download'
const PATH_BACKUP = 'C:\\DELPHI\\ECFLBC\\backup';
const FILE_PROCESS_BACKUP = '\\backupversionTEMP.zip';
const FILE_NAME = '\\backuplastversion.zip';
const FIE_DOWLOAD = '\\lastversion.zip';
const PATH_PDVREAL = 'C:\\DELPHI\\ECFLBC';//'C:\\Users\\LBC Sistemas\\Documents'//
const FILENAME_EXEPDV = '\\LbcDrbc.exe';//'\\ConversoesLBC.exe';
const PARAM_PDVSERVER = ['/NFCE', '/SQLSERVER'];

//TCP  
var HOST = '127.0.0.1'; // parametrizar o IP do Listen
var PORT = 139; // porta TCP LISTEN

// PDV
var appPDV = null;
var tcp = null;

//APP
let top = {}; // prevent gc to keep windows

SaveLog = (titulo, texto) => {

    if (!fs.existsSync(resolve(__dirname, 'LOGATUALIZADOR.ON')))
        return false;

    try {


        fs.writeFile('LOGATUALIZADOR.txt', titulo + ' - ' + new Date().toString() + ' \r\n ' + texto + ' \r\n \r\n ', { flag: 'a' }, function (erro) {

            if (erro) {
                throw erro;
            }

        });
    }
    catch (ex) {
        console.log(ex.message);
        return false;
    }


}


checkBackup = (pathBackup, fileName) => {
    console.log("Checando backup existente...");
    try {
        if (!fs.existsSync(pathBackup))
            return false;

        if (!fs.existsSync(pathBackup + fileName))
            return false;

        return true;
    } catch{
        return false;
    }
}

checkPath = (pathRaiz, pathDownload, pathBackup, diretorio) => {

    //diretorio  0.todos 1.raiz 2.dowanload 3.backup
    let result = false;
    try {

        SaveLog('checkPath', "checando diretorios tipo: " + diretorio);
        switch (diretorio) {
            case 0: {
                if (fs.existsSync(pathRaiz))
                    result = true;
                if (fs.existsSync(pathDownload))
                    result = true;
                if (fs.existsSync(pathBackup))
                    result = true;

                break;
            }
            case 1: {
                if (fs.existsSync(pathRaiz))
                    result = true;
                break;
            }
            case 2: {
                if (fs.existsSync(pathDownload))
                    result = true;
                break;
            }
            case 3: {
                if (fs.existsSync(pathBackup))
                    result = true;
                break;
            }
        }
    } catch (ex) {
        console.log('Erro ' + ex.message);
        SaveLog('checkpath', 'Erro ' + ex.message);
    }


    return result;

}

createPath = (pathRaiz, pathDownload, pathBackup) => {
    console.log("Criando diretorios...");
    SaveLog('createPath', 'Criando diretorios');

    fs.exists(pathRaiz, (exist) => {
        console.log('createPath RAIZ :' + pathRaiz);
        SaveLog('createPath RAIZ', pathRaiz);
        if (!exist) {
            fs.mkdir(pathRaiz, (data) => {
                { console.log(data) }
            });
        }

    });

    fs.exists(pathDownload, (exist) => {
        console.log('createPath Donwload : ' + pathDownload);
        SaveLog('createPath Donwload', pathDownload);
        if (!exist) {
            fs.mkdir(pathDownload, (data) => {
                console.log(data);

            });
        }

    });

    fs.exists(pathBackup, (exist) => {
        console.log('createPath Backup: ' + pathBackup);
        SaveLog('createPath Backup ', pathBackup);
        if (!exist) {
            fs.mkdir(pathBackup, (data) => {
                console.log(data);
            });
        }

    });

}

roolBack = (path, fileProcess, fileName) => {
    console.log("Roolback: " + path + fileProcess);

    if (checkBackup(path, fileName)) {

        if (fs.existsSync(path + fileProcess)) {

            if (fs.existsSync(path + fileName)) {
                fs.unlinkSync(path + fileName);
            }

            s.renameSync(path + fileProcess, path + fileName);
        }
    }
}

backupVersion = (raiz, path, pathDowload, fileProcess, fileName, fileDowload) => {
    try {
        SaveLog('Backup', 'Caminho do back up: ' + path);
        console.log('Caminho do back up: ' + path);

        // se existir um backup ele renomea temporariamente para fazer o processo
        if (checkBackup(path, fileName)) {
            fs.renameSync(path + fileName, path + fileProcess);
        }

        console.log("verificando diretorios");
        SaveLog('Backup', 'verificando diretorios ');

        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }

        let zipBackup = new AdmZip();
        // verifica se exist versão atualizada
        console.log("verificando dowaload da ultima versão");
        SaveLog('Backup', 'verificando dowaload da ultima versão');

        if (fs.existsSync(pathDowload + fileDowload)) {
            let zipDowload = new AdmZip(pathDowload + fileDowload);

            // carregar zip em  memoria
            let zipEntries = zipDowload.getEntries();
            console.log('Lendo arquivos de backup....');
            SaveLog('Backup', 'Lendo arquivos de backup....');

            zipEntries.forEach(function (zipEntry) {
                const nameFileCurrent = raiz + '\\' + zipEntry.entryName;
                if (fs.existsSync(nameFileCurrent)) {
                    zipBackup.addLocalFile(nameFileCurrent);
                }
            });
            console.log('compactando...');
            SaveLog('Backup', 'compactando...');
            // compactado arquivos selecionado 
            zipBackup.writeZip(path + fileName, (error) => {
                if (!error) {

                    // deletando arquivo temporario do backup anterior
                    if (fs.existsSync(path + fileProcess)) {
                        fs.unlinkSync(path + fileProcess);
                    }
                    console.log('sucesso');
                    SaveLog('Backup', 'Sucesso');

                    return true;


                }
                else {
                    // se o processo deu errado ele restaura o backup anterior
                    roolBack(path, fileProcess, fileName);
                    console.log('Erro ao compactar arquivo de backup');
                    SaveLog('Backup', 'Erro ao compactar arquivo de backup');
                    return false;
                }
            });
            return true;
        } else {
            console.log("Não foi possivel realizar backup! Ultima versão não foi baixada");
            SaveLog('Backup', 'Não foi possivel realizar backup! Ultima versão não foi baixada');
            roolBack(path, fileProcess, fileName);
            return false;
        }



    } catch (error) {
        // se o processo deu errado ele restaura o backup anterior    
        roolBack(path, fileProcess, fileName);
        console.log('Erro backup: ' + error.message);
        SaveLog('Backup', 'Erro backup: ' + error.message);
        return false

    }
}

restoreVersion = (raiz, pathBackup, fileProcess, fileBackup) => {
    console.log('Restaurando versao...');
    SaveLog('Restore', 'Restaurando versão');

    try {
        if (checkBackup(pathBackup, fileBackup)) {
            console.log('Extraindo backup versao...');
            SaveLog('Restore', 'Extraindo backup versao...');

            const zip = new AdmZip(pathBackup + fileBackup);
            zip.extractAllTo(raiz, true);
        } else {
            console.log('Backup nao encontrado, procurando outro backup...');
            SaveLog('Restore', 'Backup nao encontrado, procurando outro backup...');

            if (fs.existsSync(pathBackup + fileProcess)) {
                console.log(' Entraindo backup anteior...');
                SaveLog('Restore', 'Backup nao encontrado, procurando outro backup...');
                const zip = new AdmZip(pathBackup + fileProcess);
                zip.extractAllTo(raiz, true);
            }
        }

        console.log('Versao restaurada');
        SaveLog('Restore', 'Versao restaurada');

    } catch (ex) {
        console.log('Erro ao  restaurar versão: ' + ex.message);
        SaveLog('Restore', 'Erro ao  restaurar versão: ' + ex.message);
    }
}

updateVersion = (raiz, path, pathDowload, fileProcess, fileName, fileDowload) => {

    try {
        if (appPDV) {
            appPDV.kill();
            appPDV = null;
            if (tcp) {
                tcp.sock.close();
            }
        }

        if (!backupVersion(raiz, path, pathDowload, fileProcess, fileName, fileDowload))
            throw "Erro ao realizar backup";

        if (!fs.existsSync(pathDowload))
            fs.mkdirSync(pathDowload);

        console.log('Extraindo versao...');
        SaveLog('Atualização', 'Extraindo versao...');

        const zip = new AdmZip(pathDowload + fileDowload);
        zip.extractAllTo(raiz, true);

        console.log('Versao extraida com sucesso!');
        SaveLog('Atualização', 'Versao extraida com sucesso!');



    } catch (ex) {
        console.log('Erro ao atualizar versão: ' + ex.message);
        SaveLog('Atualização', 'Erro ao atualizar versão: ' + ex.message);

        restoreVersion();

    } finally {

    }
}

show = (mensage) => {
    console.log(mensage);
}

executarExe = (path, filename, parameters) => {
    console.log('abrindoo pdv...');
    SaveLog('Executando .Exe', 'abrindoo exe path: ' + path + filename + ' - parametros : ' + parameters);

    appPDV = child(path + filename, parameters, (err, data, se) => {
        console.log('Executando err:' + err);
        console.log('Executando data' + data);
        SaveLog('Executando .Exe', data);
        SaveLog('Executando .Exe', 'erro: ' + err);
    });

}

TcpServer = () => {

    // Cria a instância do Server e aguarda uma conexão
    return net.createServer((sock) => {

        // recebemos uma conexão - um objeto socket é associado à conexão automaticamente
        console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
        SaveLog('SERVIDOR TCP', 'CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);


        sock.on('data', function (data) {

            console.log('menssagem: ' + data);
            SaveLog('SERVIDOR TCP', 'menssagem: ' + data);

            sock.write(data);
            if (data.includes('atualizar')) {
                updateVersion(PATH_RAIZ, PATH_BACKUP, PATH_DOWLOAD, FILE_PROCESS_BACKUP, FILE_NAME, FIE_DOWLOAD);
            }
        });

        sock.on('close', function (data) {
            console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
            SaveLog('SERVIDOR TCP', 'CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        });

    }).listen(PORT, HOST);

}

Main = (e) => {
    try {
        console.log('executando rotina 1 minuto...');

        if (!tcp) {
            console.log('conectando TCP');
            tcp = TcpServer();
        }

        if (!appPDV) {
            executarExe(PATH_PDVREAL, FILENAME_EXEPDV, PARAM_PDVSERVER);
        }

    } catch (Ex) {
        console.log('Erro ao abrir PDV:' + Ex.message);
        SaveLog('Ready', 'Erro:' + Ex.message);

    }

}


app.once("ready", ev => {

    appPDV = null;
    tcp = null;

    top.win = new BrowserWindow({
        width: 800, height: 600, center: true, minimizable: false, show: false,
        webPreferences: {
            nodeIntegration: false,
            webSecurity: true,
            sandbox: true,
        },
    });

    top.win.loadFile("index.html");
    top.win.on("close", ev => {
        ev.sender.hide();
        ev.preventDefault();
    });

    top.tray = new Tray(resolve(__dirname, 'image', 'icon.png'));
    const menu = Menu.buildFromTemplate([
        { label: 'Salvar', click: () => { backupVersion(PATH_RAIZ, PATH_BACKUP, PATH_DOWLOAD, FILE_PROCESS_BACKUP, FILE_NAME, FIE_DOWLOAD); } },
        { label: 'Atualizar', click: () => { updateVersion(PATH_RAIZ, PATH_BACKUP, PATH_DOWLOAD, FILE_PROCESS_BACKUP, FILE_NAME, FIE_DOWLOAD); } },
        { label: 'Restaurar', click: () => { restoreVersion(PATH_RAIZ, PATH_BACKUP, FILE_PROCESS_BACKUP, FILE_NAME); } },
        { label: 'abrir', click: () => { top.win.restore(); top.win.show(); } },
        { label: 'minimizar', click: () => { top.win.minimize(); } },
        {
            label: 'fechar', click: () => {
                top.win.removeAllListeners("close");
                top = null;
                app.quit();
            }
        }

    ]);

    top.tray.setToolTip("LBC Atualizador");
    top.tray.setContextMenu(menu);
    top.tray.on('double-click', (e) => {
        top.win.restore();
        top.win.show();
    })

    try {

        createPath(PATH_RAIZ, PATH_DOWLOAD, PATH_BACKUP);
        tcp = TcpServer();

        console.log('Server listening on ' + HOST + ':' + PORT);
        SaveLog('Ready', 'Server rodando: ' + HOST + ':' + PORT);

        executarExe(PATH_PDVREAL, FILENAME_EXEPDV, PARAM_PDVSERVER);

        let event = schedule.scheduleJob("*/1 * * * *", (e) => {
            Main(e);
        });


    } catch (Ex) {
        console.log('Erro ao abrir PDV:' + Ex.message);
        SaveLog('Ready', 'Erro:' + Ex.message);

    }
});

app.on("before-quit", ev => {
    top.win.removeAllListeners("close");
    top = null;
});








