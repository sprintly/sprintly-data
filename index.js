var Backbone = require('./lib/support/backbone')
var basicAuth = require('./lib/support/basic-auth');
var Products = require('./lib/products')
var User = require('./lib/user')

var version = require('./package.json').version

exports.createClient = function(email, apiKey) {

  Backbone.ajax = basicAuth(email, apiKey);

  return {
    products: new Products(),
    user: new User(),
    VERSION: version
  }

}

exports.VERSION = version

