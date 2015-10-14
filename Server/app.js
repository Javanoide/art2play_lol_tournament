var app = require('express')();
var server = require('http').createServer(app);
var socketconfig = require('./socket.js')(server);

var port = 8000;

//enabling cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.use(function(req, res, next){
	res.setHeader('Content-Type', 'text/plain');
	res.status(404).send('Page not found');
})

server.listen(port, function(){
  console.log('Server listen on : ' + port)
});
