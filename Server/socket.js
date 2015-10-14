module.exports = function(server){
  var model = require('./model.js');
  var io = require('socket.io')(server);

  io.sockets.on('connection', function(socket){
    //envoie la liste des joueurs
    model.getPlayerList(function(result){
      socket.emit('getplayerlist', result.response);
    });
    //envoie la liste de équipes
    model.getTeamList(function(result){
      console.log(result.response);
      socket.emit('getteamlist', result.response);
    });

    //Inscription d'un joeur
    socket.on('subscribe', function(username, team){
      model.subscribe(username, team, function (result){
        console.log('Subscribe : ' + result.username + ' - ' + result.team + ' : ' + result.success);
        //mise à jour des autres clients
        model.getTeamList(function(result){
          console.log(result.response);
          io.emit('getteamlist', result.response);
        });
        model.getPlayerList(function(result){
          io.emit('getplayerlist', result.response);
        });

      });
    });
    //recupération des membres d'une équipe
    socket.on('getteam', function(team){
      model.getTeam(team, function(result){
        socket.emit('getteam', result.response);
      });
    });
    //récupération des détails d'un joueur
    socket.on('getuser', function(username){
      model.getUser(username, function(result){
        socket.emit('getuser', result.response);
      });
    });

  });
};
