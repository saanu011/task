var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var path = require('path');

var config = require('./config/config');
var routeUser = require('./routes/user');
var routeMentor = require('./routes/mentor');

var app = express();

mongoose.connect(config.db, { useNewUrlParser : true });

mongoose.connection.on('connected', ()=> {
    console.log('Connection established with the database');
});

mongoose.connection.on('error', (err)=> {
    if (err) console.log(err);
});

//middlewares
app.use(bodyparser.json({ useNewUrlParser : true}));
app.use(cors());


//getting routes
app.use('/', routeUser);
app.use('/mentor', routeMentor);

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname, '/')));
app.set('views', path.join(__dirname, '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, if-none-match");
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        // console.log('Request received: ' + new Date());
        next();
    }
});

app.get('/', (req, res)=> {
    res.send('Invalid request');
});

// app.get('*', (req, res)=>{
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// })

//listening to port
app.listen(config.port, (err)=> {
    if (err) console.log(err); 
    else console.log('Server running on port: ' + config.port);
});