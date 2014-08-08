var Backbone = require('./backbone');

module.exports = function(email, apiKey) {

  Backbone.sync.editRequest = function(req) {
    req.auth(email, apiKey);
  };

  return Backbone.ajax;
};
