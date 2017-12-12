var http = require('http');
var  product = {
    id: 1,
    name: 'Supreme T-Shirt',
    brand: 'Supreme',
    price: 99.99,
    options: [
        {color: 'blue'},
        {size: 'XL'}
    ]
}

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(product));
    res.end();
}).listen(80);