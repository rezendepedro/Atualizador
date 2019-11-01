const fs = require('fs');
export default function checkBackup(pathBackup, fileName) {

    console.log("Checando backup existente...");

    if (!fs.existsSync(pathBackup))
        return false;

    if (!fs.existsSync(pathBackup + fileName))
        return false;

    return true;

}