const { resolve } = require('path');
const { app, Menu, Tray, dialog } = require('electron');
const fs = require('fs');
const AdmZip = require('adm-zip');

const PATH_RAIZ = resolve(__dirname, 'raiz');
const PATH_DOWLOAD = resolve(__dirname, 'dowload');
const PATH_BACKUP = resolve(__dirname, 'backup');
const FILE_PROCESS_BACKUP = '\\backupversionTEMP.zip';
const FILE_NAME = '\\backuplastversion.zip';
const FIE_DOWLOAD = '\\lastversion.zip';

export default function backupVersion(raiz, path, pathDowload, fileProcess, fileName, fileDowload): boolean {
    try {

        console.log('Caminho do back up: ' + path);

        // se existir um backup ele renomea temporariamente para fazer o processo
        /*if (checkBackup(path, fileName)) {
            fs.renameSync(path + fileName, path + fileProcess);
        }*/


        console.log("verificando diretorios");
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }

        let zipBackup = new AdmZip();
        // verifica se exist versão atualizada
        console.log("verificando dowaload da ultima versão");
        if (fs.existsSync(pathDowload + fileDowload)) {
            let zipDowload = new AdmZip(pathDowload + fileDowload);

            // carregar zip em  memoria
            let zipEntries = zipDowload.getEntries();
            console.log('Lendo arquivos de backup....');
            zipEntries.forEach(function (zipEntry) {

                const nameFileCurrent = raiz + '\\' + zipEntry.entryName;
                if (fs.existsSync(nameFileCurrent)) {
                    zipBackup.addLocalFile(nameFileCurrent);
                }


            });
            console.log('compactando...');
            // compactado arquivos selecionado
            zipBackup.writeZip(path + fileName, (error) => {
                if (!error) {

                    // deletando arquivo temporario do backup anterior
                    if (fs.existsSync(path + fileProcess)) {
                        fs.unlinkSync(path + fileProcess);
                    }
                    console.log('sucesso');

                    return true;


                } else {
                    // se o processo deu errado ele restaura o backup anterior
                    //roolBack(path, fileProcess, fileName);
                    console.log('Erro ao compactar arquivo de backup');
                    return false;
                }
            });

            return true;
        } else {
            console.log("Não foi possivel realizar backup! Ultima versão não foi baixada");
            //roolBack(path, fileProcess, fileName);
            return false;
        }



    } catch (error) {
        // se o processo deu errado ele restaura o backup anterior
        //roolBack(path, fileProcess, fileName);
        console.log('false');
        return false

    }

}




/*checkBackup = (pathBackup, fileName) => {
    console.log("Checando backup existente...");

    if (!fs.existsSync(pathBackup))
      return false;

    if (!fs.existsSync(pathBackup  + fileName))
      return false;

    return true;
}
roolBack = (path, fileProcess, fileName) =>{
    console.log("Roolback: " + path + fileProcess );
    if (checkBackup(path, fileName)){
        if(fs.existsSync(path + fileProcess)){
            if(fs.existsSync(path + fileName)){
                fs.unlinkSync(path + fileName);
            }
            fs.renameSync(path + fileProcess, path + fileName);
        }
    }
}

backupVersion = (raiz, path, pathDowload, fileProcess, fileName, fileDowload) => {
    try{

        console.log('Caminho do back up: ' +path);

        // se existir um backup ele renomea temporariamente para fazer o processo
        if(checkBackup(path, fileName)){
            fs.renameSync(path + fileName, path + fileProcess);
        }


        console.log("verificando diretorios");
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        }

        let zipBackup = new AdmZip();
        // verifica se exist versão atualizada
        console.log("verificando dowaload da ultima versão");
        if (fs.existsSync(pathDowload + fileDowload)){
            let zipDowload = new AdmZip(pathDowload + fileDowload);

            // carregar zip em  memoria
            let zipEntries = zipDowload.getEntries();
            console.log('Lendo arquivos de backup....');
            zipEntries.forEach(function(zipEntry) {

                const nameFileCurrent = raiz + '\\' + zipEntry.entryName;
                if (fs.existsSync(nameFileCurrent))    {
                    zipBackup.addLocalFile(nameFileCurrent);
                }


            });
            console.log('compactando...');
             // compactado arquivos selecionado
             zipBackup.writeZip(path + fileName, (error) =>{
                if (!error){

                    // deletando arquivo temporario do backup anterior
                    if(fs.existsSync(path + fileProcess)){
                        fs.unlinkSync(path + fileProcess);
                    }
                    console.log('sucesso');

                    return true;


                }else{
                    // se o processo deu errado ele restaura o backup anterior
                    roolBack(path, fileProcess, fileName);
                    console.log('Erro ao compactar arquivo de backup');
                    return false;
                }
            });

            return true;
        }else{
            console.log("Não foi possivel realizar backup! Ultima versão não foi baixada");
            roolBack(path, fileProcess, fileName);
            return false;
        }



    }catch(error){
        // se o processo deu errado ele restaura o backup anterior
        roolBack(path, fileProcess, fileName);
        console.log('false');
        return false

    }
}

restoreVersion = () => {
    console.log('Restaurando versao...')
}

updateVersion = (raiz, path, pathDowload, fileProcess, fileName, fileDowload) => {

    try{
        if (!backupVersion(raiz, path, pathDowload, fileProcess, fileName, fileDowload))
          throw "Erro ao realizar backup";



        if(!fs.existsSync(pathDowload))
          fs.mkdirSync(pathDowload);

        console.log('Extraindo versao...');
        const zip = new AdmZip(pathDowload + fileDowload);
        zip.extractAllTo(raiz, true);

        console.log('Versao extraida com sucesso!');

    }catch{
       restoreVersion();

    }finally{

    }
}


show = (mensage) => {
    console.log(mensage);
}*/
