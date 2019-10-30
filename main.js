const { resolve } = require('path');
const { app, Menu , Tray, dialog } = require('electron');
const  fs  = require('fs');
const  AdmZip  = require ('adm-zip');



const PATH_BACKUP = resolve(__dirname, 'backup');
const FILE_PROCESS_BACKUP = '\\lastversionTEMP.zip';
const FILE_NAME = '\\lastversion.zip';
const PATH_EXTRACT = resolve(__dirname);



checkBackup = (pathBackup, filename) => {
    

    if (!fs.existsSync(pathBackup))
      return false;    

    if (!fs.existsSync(pathBackup  + filename))
      return false;
      
    return true;  
}

backupVersion = (path, fileProcess, fileName) => {
    try{

        console.log(path);
        // se existir um backup ele renomea temporariamente para fazer o processo
        if(checkBackup(path, fileName)){
            fs.rename(path + fileName, path + fileProcess); 
        }

        console.log("2");
        
        if(!fs.existsSync(path)){
            fs.mkdirSync(path); 
        }
        

        let zip = new AdmZip();

        // colocar dentro de um repeat lista da raiz do sistema e uma lista de leitura com os arquivos da versão para comprar com a lista que esta pecorrendo 
        const nameFileCurrent = "\\LbcDrbc.exe";

        if(!fs.existsSync(path + nameFileCurrent)){
            console.log("Arquivo nao encontrado!");
            return;
        }
        
        zip.addLocalFile(path + nameFileCurrent);
        
        console.log("4");
        // compactado arquivos selecionado   
        zip.writeZip(path + filename); 
        console.log("5");
        // deletando arquivo temporario do backup anterior
        if(fs.exists(path + fileProcess)){               
            fs.unlinkSync(path + fileProcess);              
        }
        console.log("6");

    }catch{
        // se o processo deu errado ele restaura o backup anterior
        if(fs.exists(path + fileProcess)){
            if(fs.exists(path + filename)){
                fs.unlinkSync(path + filename);
            }
          
            fs.rename(path + fileProcess, path + fileName);    
                
        }
    
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


show = (mensage) => {
    console.log(mensage);
}



app.on('ready', () => {
    
    const tray = new Tray(resolve(__dirname, 'image','icon.png'));

    
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Back-Up', type: 'radio', checked: true, click: () => {
           backupVersion(PATH_BACKUP, FILE_PROCESS_BACKUP, FILE_NAME);
           //show("Exemplo");
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