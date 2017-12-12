import  express from 'express';
import cookieParser  from './middlewares/cookie-parser'
import queryParser  from './middlewares/query-parser'
import productsDef from './data/products';
import usersDef from './data/users';

import bodyParser from 'body-parser';

const products=[...productsDef];
const users=[...usersDef];

const app = express();
app.use(cookieParser());
app.use(queryParser());

const jsonParse=bodyParser.json({type:'*/*'});

app.get('/', function (req, res) {
    res.send('Hello World!');
});


app.get('/api/products', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(products);
});

app.get('/api/products/:id', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(products.find(product => product.id === +req.params.id));
});

app.get('/api/products/:id/reviews', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(products.find(product => product.id === +req.params.id).reviews);
});

app.post('/api/products', jsonParse, function (req, res) {
    const item = req.body;
    products.push(item);
    item.id=products.length;
        
    res.set('Content-Type', 'application/json');
    res.send(item);
});

app.get('/users', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(users);
});



export default app;

