const fs = require('fs');
import checkBackup from './check-backup';
export default function roolback(path, fileProcess, fileName): void {

    console.log("Roolback: " + path + fileProcess);
    if (checkBackup(path, fileName)) {
        if (fs.existsSync(path + fileProcess)) {
            if (fs.existsSync(path + fileName)) {
                fs.unlinkSync(path + fileName);
            }
            fs.renameSync(path + fileProcess, path + fileName);
        }
    }

}