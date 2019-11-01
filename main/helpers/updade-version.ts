import backupVersion from './backup-version';
import restoreVersion from './restore-version';
const fs = require('fs');
const AdmZip = require('adm-zip');

export default function updadeVersion(raiz, path, pathDowload, fileProcess, fileName, fileDowload): void {
    try {
        if (!backupVersion(raiz, path, pathDowload, fileProcess, fileName, fileDowload))
            throw "Erro ao realizar backup";

        if (!fs.existsSync(pathDowload))
            fs.mkdirSync(pathDowload);

        console.log('Extraindo versao...');
        const zip = new AdmZip(pathDowload + fileDowload);
        zip.extractAllTo(raiz, true);

        console.log('Versao extraida com sucesso!');

    } catch{
        restoreVersion();

    } finally {

    }

}