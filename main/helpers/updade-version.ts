import backupVersion from './backup-version';
import restoreVersion from './restore-version';
const fs = require('fs');
const AdmZip = require('adm-zip');

export default function updadeVersion(raiz, pathBackup, pathDowload, fileProcess, fileBackup, fileDowload): void {
    try {
        if (!backupVersion(raiz, pathBackup, pathDowload, fileProcess, fileBackup, fileDowload))
            throw "Erro ao realizar backup";

        if (!fs.existsSync(pathDowload))
            fs.mkdirSync(pathDowload);

        console.log('Extraindo versao...');
        const zip = new AdmZip(pathDowload + fileDowload);
        zip.extractAllTo(raiz, true);

        console.log('Versao extraida com sucesso!');

    } catch{
        restoreVersion(raiz, pathBackup, fileProcess, fileBackup);

    }

}