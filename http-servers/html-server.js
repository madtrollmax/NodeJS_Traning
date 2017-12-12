const fs = require('fs');
var http = require('http');
const through2= require('through2');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    // var data = fs.readFileSync('./http-servers/index.html').toString().replace('{message}', 'Bla bla bla');
    // res.write(data);
    // res.end();
    
    const stream = fs.createReadStream('./http-servers/index.html');
    stream.pipe(through2(function (chunk, enc, callback) {
        res.write(chunk.toString().replace('{message}', 'Bla bla bla'));
        callback();
    })).on('finish', function () {
        res.end();
    })

}).listen(80);