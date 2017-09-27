import fs from 'fs';


class DirWatcher{
    constructor(emitter){
        this.emitter = emitter;
        this.files=[];
    }
    
    watch = (path, delay) => {
        setInterval(() => {
            fs.readdir(path, (err, files) => {
                if(err){
                    throw err;
                }

                files.forEach(file => {
                    if(this.files.findIndex(f => f === file) === -1 ){
                        this.emitter.emit('dirwatcher:changed', path + '/' + file );
                    }
                });

                this.files = files;
            });
        }, delay)
    }
}
export default DirWatcher