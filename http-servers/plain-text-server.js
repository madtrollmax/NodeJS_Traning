var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'plain/text'});
    res.write('Hello World!');
    res.end();
}).listen(80);