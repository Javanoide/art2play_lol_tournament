var app = require('express')();
var model = require('./model.js');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

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

io.sockets.on('connection', function(socket){

  socket.on('subscribe', function(username, team){

    model.subscribe(username, team, function (result){
      console.log('Subscribe : ' + result.username + ' - ' + result.team + ' : ' + result.success);
    });
  });

  socket.on('getteam', function(team){
    model.getTeam(team, function(result){
      console.log(result.response);
      io.emit('getteam', result.response);
    });
  });

});

app.use(function(req, res, next){
	res.setHeader('Content-Type', 'text/plain');
	res.status(404).send('Page not found');
})

server.listen(port, function(){
  console.log('Server listen on : ' + port)
});
