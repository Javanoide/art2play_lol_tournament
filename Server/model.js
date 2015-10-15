var redis = require('redis');
var client = redis.createClient(6379, '78.193.226.46', {});

module.exports.subscribe = function(username, team, callback){
  //inscription du joueur de une HM, contient nom de la team et autre si besoin (email, date de naissance, etc...)
  client.hmset('user:' + username, 'team', team);
  //ajout du joueur dans l'équipe
  client.zadd('team:' + team, Date.now(), username);
  //Ajout de la team à la liste des team
  client.zadd('teamlist', Date.now(), team);
  //Ajout du joueur à la liste des joueurs
  client.zadd('playerlist', Date.now(), username);

  callback({success : true, username : username, team : team});
};

module.exports.getUser = function(username, callback){
  clietn.hgetall('user:' + username, function (err, response){
    if(!err){
      callback({success : true, response : response});
    }
  });
};

module.exports.getTeam = function(team, callback){
  client.zrange('team:' + team, 0, -1, function (err, response){
    if(!err){
      callback({success : true, response : response});
    }
  });
};

module.exports.getTeamList = function(callback){
  client.zrange('teamlist', 0, -1, function (err, response){
    if(!err){
      callback({success : true, response : response});
    }
  });
};

module.exports.getPlayerList= function(callback){
  client.zrange('playerlist', 0, -1, function (err, response){
    if(!err){
      callback({success : true, response : response});
    }
  });
};
