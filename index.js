var Backbone = require('./lib/support/backbone');
var basicAuth = require('./lib/support/basic-auth');
var Products = require('./lib/products');
var User = require('./lib/user');
var consumer = require('./lib/page_consumer');

var version = require('./package.json').version;

function Client(email, apiKey) {
  Backbone.ajax = basicAuth(email, apiKey);
  this.products = new Products();
  this.user = new User();
}

exports.createClient = function(email, apiKey) {
  return new Client(email, apiKey);
};

exports.VERSION = version;

exports.Client =  Client;
exports.collectionConsumer = consumer;
