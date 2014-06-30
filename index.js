var _ = require('lodash')
var $ = require('jquery')
var btoa = require('btoa')
var Backbone = require('backdash')

var Products = require('./sprintly/products')
var User = require('./sprintly/user')

var version = require('./package.json').version

exports.createClient = function(email, apiKey) {
  var authHeader = btoa(email + ":" + apiKey)

  Backbone.ajax = function(options) {
    return $.ajax(_.extend(options, {
      headers: {
        "Authorization": "Basic " + authHeader
      }
    }))
  }

  return {
    products: new Products(),
    user: new User(),
    VERSION: version
  }

}

exports.VERSION = version
