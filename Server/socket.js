module.exports = function(server, model){
  var io = require('socket.io')(server);

  io.sockets.on('connection', function(socket){
    //envoie la liste des joueurs
    model.getPlayerList(function(result){
      socket.emit('getplayerlist', result.response);
    });
    //envoie la liste de équipes
    model.getTeamList(function(result){
      socket.emit('getteamlist', result.response);
    });

    //récupérer tout les matchs
    model.getMatchs(function(result){
      socket.emit('getmatchlist', result.response);
    });

    //Inscription d'un joeur
    socket.on('subscribe', function(username, team){
      model.subscribe(username, team, function (result){
        console.log('Subscribe : ' + result.username + ' - ' + result.team + ' : ' + result.success);
        //mise à jour des autres clients
        model.getTeamList(function(result){
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
    //suppresion d'une équipe et de TOUT les membres de l'équipe
    socket.on('delteam', function(team){
      model.delTeam(team, function(result){
        socket.emit('delteam', result.response);
        //broadcast des listes
        model.getTeamList(function(result){
          io.emit('getteamlist', result.response);
        });
        model.getPlayerList(function(result){
          io.emit('getplayerlist', result.response);
        });
      });
    });
    //récupération des détails d'un joueur
    socket.on('getuser', function(username){
      model.getUser(username, function(result){
        socket.emit('getuser', result.response);
      });
    });
    //Suppression d'un joueur
    socket.on('deluser', function(username){
      model.delUser(username, function(result){
        socket.emit('deluser', result.response);
        //broadcast des listes
        model.getTeamList(function(result){
          io.emit('getteamlist', result.response);
        });
        model.getPlayerList(function(result){
          io.emit('getplayerlist', result.response);
        });
      })
    });
    //ajout match
    socket.on('setmatch', function(game, date, teamA, teamB, title){
      model.setMatch(game, date, teamA, teamB, title, function(result){
        //io.emit('getmatchs', result.response);
      });
    });

    //récupérer un match par rapport au joueur
    socket.on('getmatchsforgame', function (game){
      model.getMatchsForGame(game, function(result){
        socket.emit('getmatchsforgame', result.response);
      });
    });

  });
};
