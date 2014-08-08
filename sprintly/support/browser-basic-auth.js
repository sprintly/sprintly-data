var _ = require('lodash');
var $ = require('jquery');
var btoa = require('btoa');

module.exports = function(email, apiKey) {
  var authHeader = btoa(email + ":" + apiKey)
  return function(options) {
    return $.ajax(_.extend(options, {
      headers: {
        "Authorization": "Basic " + authHeader
      }
    }))
  }
}
