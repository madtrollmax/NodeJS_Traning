import fs from 'fs';
import {EventEmitter} from 'events';

function processFileData(data){
    const res = [];
    const fileStrings = data.toString().split('\n');
                
    if(fileStrings.length > 0){
        const fieldNames = fileStrings[0].split(',');
        
        for(let i = 1; i<fileStrings.length; i++){
            const fieldValues = fileStrings[i].split(',');

            const obj = {};
            for(let j = 0; j< fieldNames.length; j++){
                obj[fieldNames[j].trim()] = fieldValues[j];
            }
            res.push(JSON.stringify(obj));
        }
    }
    return res;

}

class Importer {
    constructor(emmiter){
        this.emitter = emmiter;

        this.emitter.on('dirwatcher:changed',file =>{

            this.import(file).then(res => {
                console.log(res);
            });

            console.log(this.importSync(file));
        });
    }

    import = path => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data)=>{
                if(err){
                    reject(err);
                }
                const res = processFileData(data);
                resolve(res);
            })
        });
    }

    importSync = path => {
        const data = fs.readFileSync(path);
        return processFileData(data)
    }
}

export default Importer