var config = require('./config')();
var app = require('express')();
var server = require('http').createServer(app);

var model = require('./model')(config.redis);
var socketconfig = require('./socket')(server, model);


//enabling cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(function(req, res, next){
	res.setHeader('Content-Type', 'text/plain');
	res.status(404).send('Page not found');
})

server.listen(config.port, function(){
  console.log('Server listen on : ' + config.port)
});
