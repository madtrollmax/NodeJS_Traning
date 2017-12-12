import express from 'express';
import bodyParser from 'body-parser';
import {MongoClient} from 'mongodb'

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');

import models from './models'

const app = express();
const jsonParse=bodyParser.json({type:'*/*'});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', function (req, res) {
    // MongoClient.connect('mongodb://localhost:27017', function(err, client) {
    //     console.log("Connected successfully to server");
    //     const db = client.db('Test');
        
    //     const collection = db.collection('cities');

    //     collection.find({}).toArray(function(err, cities) {
    //         res.send(cities[Math.floor(Math.random()*cities.length)]);
    //         client.close();
    //     });
    // });

    models.Cities.find((err, cities) => {
        res.send(cities[Math.floor(Math.random()*cities.length)]);
    })
});
 
app.get('/api/products', (req, res) => {
    res.set('Content-Type', 'application/json');
    models.Products.find((err, productions) => {
        res.send(productions);
    })
});

app.get('/api/products/:id', (req, res) => {
    res.set('Content-Type', 'application/json');
    models.Products.find({_id: req.params.id}, (err, productions) => {
        res.send(productions[0]);
    })
});

app.get('/api/products/:id/reviews', (req, res) => {
    res.set('Content-Type', 'application/json');
    models.Products.find({_id: req.params.id}, (err, productions) => {
        res.send(productions[0].reviews);
    })
});

app.post('/api/products', jsonParse, (req, res) => {
    const item = req.body;
    
    res.set('Content-Type', 'application/json');
    const product = new models.Products(item);
    product.save((err, prod) => {
        res.send(prod);
    });
});

app.delete('/api/products/:id',  (req, res) => {
    models.Products.remove({_id: req.params.id}, err => {
        res.send('done');
    });
});

app.get('/api/users', (req, res) => {
    models.Users.find((err, users) => {
        res.send(users);
    })
});

app.delete('/api/users/:id',  (req, res) => {
    models.Users.remove({_id: req.params.id}, err => {
        res.send('done');
    });
});


app.get('/api/cities', (req, res) => {
    models.Cities.find((err, cities) => {
        res.send(cities);
    })
});

app.get('/api/cities/:id', (req, res) => {
    models.Cities.find({_id: req.params.id}, (err, cities) => {
        res.send(cities[0]);
    })
});


app.post('/api/cities', jsonParse, (req, res) => {
    const item = req.body;

    res.set('Content-Type', 'application/json');
    const city = new models.Cities(item);
    city.save((err, city) => {
        if(err){
            res.send('error');    
        }
        res.send(city);
    });
});

app.put('/api/cities/:id', jsonParse, (req, res) => {
    const item = req.body;
    item._id = req.params.id
    res.set('Content-Type', 'application/json');
    models.Cities.find({_id: req.params.id}, (err, cities) => {
        const item=cities[0];
        
        item.name=req.body.name;
        item.country=req.body.country;
        item.capital=req.body.capital;
        item.location=req.body.location;
        
        item.save((err, city) => {
            res.send(city);
        });
    })
});
 
app.delete('/api/cities/:id',  (req, res) => {
    models.Cities.remove({_id: req.params.id}, err => {
        res.send('done');
    });
});
export default app;

