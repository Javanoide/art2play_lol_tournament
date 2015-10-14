var express = require('express');
var bodyParser = require('body-parser');
var model = require('./model.js');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

var port = 8000;

//enabling cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/', urlencodedParser, function(req, res){

});

app.get('/', function(req, res){
  model.subscribe('florent', 'onifact', function(result){
    console.log('test');
  });
});


app.use(function(req, res, next){
	res.setHeader('Content-Type', 'text/plain');
	res.status(404).send('Page not found');
})

app.listen(port);
console.log('Server listen on : ' + port)
