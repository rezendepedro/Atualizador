
import checkBackup from './check-backup';
const fs = require('fs');
const AdmZip = require('adm-zip');

export default function restoreVersion(raiz, pathBackup, fileProcess, fileBackup): void {
    console.log('Restaurando versao...');
    try {
        if (checkBackup(pathBackup, fileBackup)) {
            console.log('Extraindo backup versao...');
            const zip = new AdmZip(pathBackup + fileBackup);
            zip.extractAllTo(raiz, true);
        } else {
            console.log('Backup nao encontrado, procurando outro backup...');
            if (fs.existsSync(pathBackup + fileProcess)) {
                console.log(' Entraindo backup anteior...');
                const zip = new AdmZip(pathBackup + fileProcess);
                zip.extractAllTo(raiz, true);
            }
        }

        console.log('Versao restaurada')

    } catch{

    }
}