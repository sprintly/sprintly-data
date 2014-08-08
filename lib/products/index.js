var Backbone = require('../support/backbone')
var Product = require('./product')
var config = require('../config')

module.exports = Backbone.Collection.extend({

  model: Product,

  url: config.BASE_URL + '/products.json'

})
