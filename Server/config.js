var env = require('common-env/withLogger')();

module.exports = function() {
  return env.getOrElseAll({
    port: 8000,
    redis: {
      host: 'localhost',
      port: 6379,
      auth_pass: null
    }
  })
};
