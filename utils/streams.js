const minimist = require('minimist');
const fs = require('fs');
const through2= require('through2');
const split= require('split');

var ACTIONS = {
    IO: 'io',
    TRANSFORM: 'transform',
    TRANSFORM_FILE: 'transform-file'
};

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

function httpClient() {

} 

function httpServer() {

} 

function printHelpMessage() {
    console.log('bla bla bla');
} 

function checkFileParam(file, func){
    if(file){
        func(file);
    }else{
        console.log('you need to set file');
    }
}

var alias =  {
    h: 'help',
    a: 'action',
    f: 'file'
};
var string = ['action', 'file'];
var args=minimist(process.argv, {
    string,
    alias
});

if(args.help && (process.argv[2] === '-h' || process.argv[2] === '--help')){
    printHelpMessage();
}else if(args.action){
    switch(args.action){
        case ACTIONS.IO:
            checkFileParam(args.file, inputOutput);
        break;
        case ACTIONS.TRANSFORM:
            transform();
        break;
        case ACTIONS.TRANSFORM_FILE:
            checkFileParam(args.file, transformFile);
        break;
        default:
            console.log(`available actions: ${ACTIONS.IO}, ${ACTIONS.TRANSFORM}, ${ACTIONS.TRANSFORM_FILE}`);
            break;
    }
}else{
    console.log('you need to set action');
    printHelpMessage();
}
