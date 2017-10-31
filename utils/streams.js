const minimist = require('minimist');
const fs = require('fs');
const through2= require('through2');
const split= require('split');
const request = require('request');

var ACTIONS = {
    IO: 'io',
    TRANSFORM: 'transform',
    TRANSFORM_FILE: 'transform-file', 
    BUNDLE_CSS:'bundle-css'
};

var ERRORS = {
    FILE_NOT_EXISTS: 'you need to set file',
    PATH_NOT_EXISTS: 'you need to set path'
}

function inputOutput(filePath) {
    const stream = fs.createReadStream(filePath);
    stream.pipe(process.stdout);
} 

function transformFile(filePath) {
    const stream = fs.createReadStream(filePath);
    let fieldNames = [];

    stream.pipe(split())
    .pipe(through2(function (chunk, enc, callback) {
        if(!fieldNames.length){
            fieldNames = chunk.toString().split(',')
        }else{
            const fieldValues = chunk.toString().split(',');

            const obj = {};
            for(let i = 0; i< fieldNames.length; i++){
                obj[fieldNames[i].trim()] = fieldValues[i];
            }
            this.push(JSON.stringify(obj));
        }
        callback();
   }))
   .pipe(fs.createWriteStream(filePath.replace('.csv','.json')));
   //.pipe(process.stdout);
} 

function transform() {
    process.stdin.pipe(through2(function (chunk, enc, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
   })).pipe(process.stdout);
    
}

function cssBundler(path){
    var remotePath = 'https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css';
    var output=fs.createWriteStream('bundle.css');
    fs.readdir(path, function(err, files){
        if(err){
            throw err;
        }

        files
            .filter(function(file){return file.endsWith('.css')})
            .forEach(function(file){
                var stream = fs.createReadStream(path + file).pipe(output, {end: false});
            });
    });
    request.get(remotePath).pipe(output);
}

function printHelpMessage() {
    console.log('bla bla bla');
} 

function checkParam(param, func, err){
    if(param){
        func(param);
    }else{
        console.log(err);
    }
}

const alias =  {
    h: 'help',
    a: 'action',
    f: 'file',
    p: 'path'
};
const string = ['action', 'file'];

function streams(){
    console.log(process.argv);
    var args=minimist(process.argv, {
        string,
        alias
    });

    if(args.help && (process.argv[2] === '-h' || process.argv[2] === '--help')){
        printHelpMessage();
    }else if(args.action){
        switch(args.action){
            case ACTIONS.IO:
                checkFileParam(args.file, inputOutput, ERRORS.FILE_NOT_EXISTS);
            break;
            case ACTIONS.TRANSFORM:
                transform();
            break;
            case ACTIONS.TRANSFORM_FILE:
                checkFileParam(args.file, inputOutput, ERRORS.FILE_NOT_EXISTS);
            break;
            case ACTIONS.BUNDLE_CSS:
                checkParam(args.path, cssBundler, ERRORS.PATH_NOT_EXISTS);
                break;
            default:
                console.log(`available actions: ${ACTIONS.IO}, ${ACTIONS.TRANSFORM}, ${ACTIONS.TRANSFORM_FILE}`);
                break;
        }
    }else{
        console.log('you need to set action');
        printHelpMessage();
    }
}

if (!module.parent){
    streams();
}else{
    module.exports = streams;
}