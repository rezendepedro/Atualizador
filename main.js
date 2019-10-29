const { resolve } = require('path');
const { app, Menu , Tray, dialog } = require('electron');
const  fs  = require('fs');
const  AdmZip  = require ('adm-zip');



const PATH_BACKUP = resolve(__dirname, 'backup', '');
const FILE_PROCESS_BACKUP = 'lastversionTEMP.zip';
const FILE_NAME = 'lastversion.zip';
const PATH_EXTRACT = resolve(__dirname);



app.on('ready', () => {
    
    const tray = new Tray(resolve(__dirname, 'image','icon.png'));

    checkBackup = (pathBackup, filename) => {
        console.log(pathBackup + '/' + filename);

        if (!fs.exists(pathBackup))
          return false;

        if (!fs.exists(pathBackup + '/' + filename))
          return false;
          
        return true;  
    }

    backupVersion = (path, fileProcess, fileName) => {
        try{
            // se existir um backup ele renomea temporariamente para fazer o processo
            if(this.checkBackup(path, fileName)){
                fs.rename(path + fileName, path + fileProcess); 
            }
            
            if(!fs.exists(path)){
                fs.mkdir(path); 
            }

            let zip = new AdmZip();

            // colocar dentro de um repeat lista da raiz do sistema e uma lista de leitura com os arquivos da versão para comprar com a lista que esta pecorrendo 
            const nameFileCurrent = "LbcDrbc.exe";
            zip.addLocalFile(path + nameFileCurrent);
            
            // compactado arquivos selecionado   
            zip.writeZip(path + filename); 

            // deletando arquivo temporario do backup anterior
            if(fs.exists(path + fileProcess)){               
                fs.unlink(path + fileProcess);              
            }

        }catch{
            // se o processo deu errado ele restaura o backup anterior
            if(fs.exists(path + fileProcess)){
                if(fs.exists(path + filename)){
                    fs.unlink(path + filename);
                }
              
                fs.rename(path + fileProcess, path + fileName);    
                    
            }
              
        }finally{

        }
       

        
    }

    restoreVersion = () => {
        
    }

    updateVersion = () => {

        try{

            if(this.checkBackup(path, filename)){
                fs.rename(path + filename, path + fileProcess);
            }
            
            if(!fs.exists(path))
              fs.mkdir(path);

              const zip = new AdmZip(path + filename);
              const zipEntries = zip.getEntries();

              zip.extractAllTo(resolve(__dirname), true);



        }catch{
            if(fs.exists(pathProcess)){
                if(fs.exists(path))
                    fs.unlink(path);

                fs.rename(pathProcess, path);    
                    
            }
              
        }finally{

        }
       

    }
    
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Back-Up', type: 'radio', checked: true, click: () => {
            backupVersion(PATH_BACKUP, FILE_PROCESS_BACKUP, FILE_NAME);
        }},
        {label: 'Atualizar', type: 'radio', checked: true, click: () =>{
            dialog.showOpenDialog({properties: ['openfile'] }, (paths) => {
                console.log(paths);     
            });
        }},
        {label: 'Restore', type: 'radio', checked: true, click: () =>{
            dialog.showOpenDialog({properties: ['openfile'] }, (paths) => {
                console.log(paths);     
            });
        }}
    ]);


    tray.setToolTip('Atualizador');
    
    tray.setContextMenu(contextMenu);
    
})