import express from 'express';
import jwt  from 'jsonwebtoken';
import bodyParser from 'body-parser';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {Strategy as TwitterStrategy} from 'passport-twitter';
import {OAuthStrategy as GoogleStrategy} from 'passport-google-oauth';

import cookieParser  from './middlewares/cookie-parser'
import queryParser  from './middlewares/query-parser'
import checkToken from './middlewares/check-token'

import productsDef from './data/products';
import usersDef from './data/users';

const products=[...productsDef];
const users=[...usersDef];

const app = express();
app.use(cookieParser());
app.use(queryParser());
app.use(passport.initialize());

const jsonParse=bodyParser.json({type:'*/*'});
const verifyToken=checkToken();

app.get('/', function (req, res) {
    res.send('Hello World!');
});


app.get('/api/products', verifyToken, (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send(products);
});

app.get('/api/products/:id', verifyToken, (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send(products.find(product => product.id === +req.params.id));
});

app.get('/api/products/:id/reviews', verifyToken, (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send(products.find(product => product.id === +req.params.id).reviews);
});

app.post('/api/products', verifyToken, jsonParse, (req, res) => {
    const item = req.body;
    products.push(item);
    item.id=products.length;
        
    res.set('Content-Type', 'application/json');
    res.send(item);
});

app.get('/users', verifyToken, (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send(users);
});

app.get('/auth', (req, res) => {
    const user = users.find(usr => req.query.user === usr.name);
    if(user && user.password ===  req.query.password){
        res.set('Content-Type', 'application/json');
        const data =  {
            user: {
                email:'user@example.com',
                username:user.name
            }
        }
        res.send({
            code: 200,
            message: 'OK',
            data,
            token: jwt.sign(data,'bla bla bla')
        });
    }else{
        res.send({
            code: 404,
            message: "Not Found"
        });
    }

});

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new LocalStrategy( (username, password, done)=> {
    const user = users.find(usr => username === usr.name);
    if(user && user.password ===  password){
        done(null, user);
    } else {
        done(null, false, "Not Found");
    }
}));
 
app.get('/login', passport.authenticate('local'), (req, res) => {
    res.redirect('/');
});

passport.use(new FacebookStrategy({
    clientID: 'FACEBOOK_APP_ID',
    clientSecret: 'FACEBOOK_APP_SECRET',
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      done(null, profile);
  }
));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));

passport.use(new TwitterStrategy({
    consumerKey: 'TWITTER_CONSUMER_KEY',
    consumerSecret: 'TWITTER_CONSUMER_SECRET',
    callbackURL: "/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
      done(null, profile);
  }
));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));

passport.use(new GoogleStrategy({
    consumerKey: 'GOOGLE_CONSUMER_KEY',
    consumerSecret: 'GOOGLE_CONSUMER_SECRET',
    callbackURL: "/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
      done(null, profile)
  }
));

app.get('/auth/google', passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {res.redirect('/');});

export default app;

