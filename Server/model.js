var redis = require('redis');
var client = redis.createClient(8080, '78.193.226.46', {});

module.exports.subscribe = function(username, team, callback){
  //inscription du joueur de une HM, contient nom de la team et autre si besoin (email, date de naissance, etc...)
  client.hmset('user:' + username, 'team', team);
  //ajout du joueur dans l'équipe
  client.zadd( 'team:' + team, Date.now(), username);
  callback({success : true, msg : 'Event add successfully'});
};

module.exports.getUser = function(username, callback){

};

module.exports.getTeam = function(team, callback){

};
