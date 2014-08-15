var _ = require('lodash')
var Backbone = require('../support/backbone')
var config = require('../config')
var deps = require('ampersand-dependency-mixin')

var PeopleCollection = Backbone.Collection.extend({

  url: function() {
    return config.BASE_URL + '/products/' + this.productId + '/people.json'
  },

  dependencies: {
    productId: 'Product ID'
  },

  initialize: function(models, options) {
    this.attachDeps(options)
    this.fetch()
  }

})

_.extend(PeopleCollection.prototype, deps);

module.exports = PeopleCollection
