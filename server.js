
/**

 * Created by Dell on 8/8/2017.

 */

const express = require('express');

var app = express();

const mongoose = require('mongoose');

const morgan = require('morgan');

const config = require('./config/database');

const appController = require('./app/appController');

const LoginController = require('./app/base/controller/LoginController');

mongoose.connect(config.database, { useMongoClient: true });

const cors =require('cors');

const bodyParser = require('body-parser');



const port = process.env.PORT || 8081;

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use(cors());

app.get('/m', function(req,res){

    console.log("M")

});

/*var redis = require('redis');
var client = redis.createClient();



client.on('connect', function() {

    console.log('connected');

});*/



app.use(function (req, res, next) {

    //var allowedOrigins = ['http://139.59.9.202', '139.59.9.202'];
    var allowedOrigins = ['http://www.zaloonz.in', 'http://www.139.59.9.221', 'http://139.59.9.221', 'http://zaloonz.in'];

   // console.log(req.headers.origin);
    var origin = req.headers.origin;

    if (allowedOrigins.indexOf(origin) > -1) {

        res.setHeader('Access-Control-Allow-Origin', origin);

    }

    res.header("Access-Control-Allow-Credentials", true);

    res.header("Access-Control-Allow-Methods", 'POST, GET, PUT, DELETE, OPTIONS');

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");

    //res.header("Access-Control-Allow-Headers", "Content-Type");
    //Access-Control-Allow-Methods: GET, POST, "OPTIONS")
    //res.header("Access-Control-Allow-Origin", "http://zaloonz.in");
    next();

});

app.use('/static', express.static('../Images'));




app.post('/getToken',LoginController.RETURN_TOKEN);
app.use('/',appController);




process.on('uncaughtException', function (err) {
    console.log(err);
});



app.listen(port, "0.0.0.0");

console.log('Your server is running on port ' + port + '.');

