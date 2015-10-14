module.exports = function(server){
  var model = require('./model.js');
  var io = require('socket.io')(server);

  io.sockets.on('connection', function(socket){
    //Inscription d'un joeur
    socket.on('subscribe', function(username, team){

      model.subscribe(username, team, function (result){
        console.log('Subscribe : ' + result.username + ' - ' + result.team + ' : ' + result.success);
      });
    });
    //recupération des membres d'une équipe
    socket.on('getteam', function(team){
      model.getTeam(team, function(result){
        console.log(result.response);
        io.emit('getteam', result.response);
      });
    });
    //récupération des détails d'un joueur
    socket.on('getuser', function(team){
      model.getUser(username, function(result){

      });
    });

  });
};
