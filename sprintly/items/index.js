var qs = require('querystring');
var Backbone = require('backdash')
var config = require('../config')
var attachDeps = require('../mixins').attachDeps

module.exports = Backbone.Collection.extend({

  url: function() {
    var query = qs.stringify(this.config.toJSON())
    return config.BASE_URL + '/products/' + this.productId + '/items.json?' + query
  },

  dependencies: {
    productId: 'Product ID',
    people: 'People Collection'
  },

  constructor: function(models, options) {
    attachDeps.call(this, options)

    this.config = new Backbone.Model({
      offset: 0,
      limit: 100,
      status: 'backlog',
      order_by: 'newest'
    })

    Backbone.Collection.apply(this, arguments)
  }

})

