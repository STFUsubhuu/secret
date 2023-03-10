require("dotenv").config();
const express = require('express');
const ejs = require('ejs');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended : true}));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/SecretsDB");


const userSchema = new mongoose.Schema({
  email : String,
  password : String
});

userSchema.plugin(encrypt, {secret : process.env.SECRET, encryptedFields : ['password']});

const User = mongoose.model('User', userSchema);



app.get('/', function(req, res){
  res.render('home');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email : username}, function(err, foundUser){
    if(!err){
      if(foundUser){
        if(foundUser.password === password){
          res.render('secrets');
        }
      }
    }
    else
      res.send(err);
  });
});

app.get('/register', function(req, res){
  res.render('register');
});


app.post('/register', function(req, res){
  const newUser = new User({
    email : req.body.username,
    password : req.body.password
  });
  newUser.save(function(err){
    if(!err)
      res.render('secrets');
    else
      res.send(err);
  })
});


app.listen('3000', function(req, res){
  console.log('server started');
})
