import express from 'express';
import bodyParser from 'body-parser';

import models from './models'

const app = express();
const jsonParse=bodyParser.json({type:'*/*'});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/api/products', (req, res) => {
    res.set('Content-Type', 'application/json');
    models.Products.findAll().then(data => {
        res.send(data);
    });
});

app.get('/api/products/:id', (req, res) => {
    res.set('Content-Type', 'application/json');
    models.Products.findById(+req.params.id).then(data => {
        console.log(data.getReviews().then(data => {console.log(data)}));
        res.send(data);
    });
});

app.get('/api/products/:id/reviews', (req, res) => {
    res.set('Content-Type', 'application/json');
    models.Products.findById(+req.params.id).then(data => {
       data.getReviews().then(reviews => {
           res.send(reviews);
        });
    });
});

app.post('/api/products', jsonParse, (req, res) => {
    const item = req.body;
    
    res.set('Content-Type', 'application/json');
    models.Products.create({Title: item.title}).then(data => {
        res.send(data);
    });
});

app.get('/api/users', (req, res) => {
    models.Users.findAll().then(data => {
        res.send(data);
    });
});

export default app;

