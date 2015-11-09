var redis = require('redis');
var async = require ('async');
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
  client.hgetall('user:' + username, function (err, response){
    if(!err){
      callback({success : true, response : response});
    }else{
      callback({success : false});
    }
  });
};

module.exports.delUser = function(username, callback){
  client.hgetall('user:' + username, function (err, response){
    var teamName = response.team;
    console.log('zrem ' + response.team + ' '+ username);
    client.zrem('team:' + response.team, username);
    client.zrem('playerlist', username);
    client.del(username, function(err, response){
      if(!err){
        callback({success : true});
      }else{
        callback({success : false});
      }
    });
  });
};

module.exports.getTeam = function(team, callback){
  client.zrange('team:' + team, 0, -1, function (err, response){
    if(!err){
      callback({success : true, response : response});
    }else{
      callback({success : false});
    }
  });
};

module.exports.delTeam = function(team, callback){
  var successDel = false;
  console.log('delTeam ' + team);
  client.zrange('team:' + team, 0, -1, function(err, response){
    console.log("member " + response);
      async.each(response, function(value, asyncCallback){
        console.log("del user : " + value);
        client.del('user:' + value, function(err, response){});
        client.zrem('playerlist', value);
        asyncCallback();
      },function(err){
        if(err){
          successDel = false;
        }else{
          successDel = true;
        }
      });
      client.zrem('teamlist', team)
      client.del('team:' + team, function(err, result){});
      callback({success : successDel});
  })
};

module.exports.getTeamList = function(callback){
  client.zrange('teamlist', 0, -1, function (err, response){
    if(!err){
      callback({success : true, response : response});
    }else{
      callback({success : false});
    }
  });
};

module.exports.getPlayerList= function(callback){
  client.zrange('playerlist', 0, -1, function (err, response){
    if(!err){
      callback({success : true, response : response});
    }else{
      callback({success : false});
    }
  });
};

module.exports.setMatch = function(game, date, teamA, teamB, title, callback){
  client.incrby('matchNumber', 1, function(err, number){
    client.hmset('match:' + number, 'game', game, 'date', date, 'teamA', teamA, 'teamB', teamB, 'title', title);
    client.zadd('matchsforgame:' + game, Date.now(), number);
    client.zadd('matchs', Date.now(), number);
    callback({success : true});
  });
};

module.exports.getMatch = function(number, callback){
  client.hgetall('match:' + number, function (err, response){
    if(!err){
      callback({success : true, response : response});
    }else{
      callback({success : false});
    }
  });
};

module.exports.getMatchsForGame = function(game, callback){
  client.zrange('matchsforgame:' + game, 0, -1, function (err, response){
    if(!err){
      callback({success : true, response : response});
    }else{
      callback({success : false});
    }
  });
};

module.exports.getMatchs = function(game, callback){
  var matchTab = [];
  client.zrange('matchs', 0, -1, function (err, response){
    if(!err){
      async.each(response, function(value, asyncCallback){
        client.hgetall('match:' + value, function(err, response){
          matchTab.push(response);
        });
        asyncCallback();
      },function(err){
        if(err){
          successDel = false;
        }else{
          successDel = true;
        }
      });
      callback({success : true, response : matchTab});
    }else{
      callback({success : false});
    }
  });
};
