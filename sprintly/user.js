var Backbone = require('backdash')
var config = require('./config')

module.exports = Backbone.Model.extend({
  url: config.BASE_URL + '/user/whoami.json'
})

