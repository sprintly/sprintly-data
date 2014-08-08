var _ = require('lodash')
var $ = require('jquery')
var btoa = require('btoa')
var Backbone = require('./sprintly/support/backbone')
var basicAuth = require('./sprintly/support/basic-auth');
var Products = require('./sprintly/products')
var User = require('./sprintly/user')

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

