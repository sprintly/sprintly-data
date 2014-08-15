var _ = require('lodash')
var qs = require('querystring')
var Backbone = require('../support/backbone')
var config = require('../config')
var deps = require('ampersand-dependency-mixin')
var Item = require('./item')
var QueryConfig = require('./query-config');

var Items = Backbone.Collection.extend({

  url: function() {
    var query = qs.stringify(this.config.toJSON())
    return config.BASE_URL + '/products/' + this.productId + '/items.json?' + query
  },

  dependencies: {
    productId: 'Product ID',
    people: 'People Collection'
  },

  constructor: function(models, options) {
    options = options || {};
    this.attachDeps(options)
    this.config = new QueryConfig(options.config)
    options = _.omit(options, 'config');
    Backbone.Collection.apply(this, arguments)
  }

})

Items.ITEM_TYPES = Item.ITEM_TYPES;
Items.STAGES = Item.STAGES;

_.extend(Items.prototype, deps);

module.exports = Items;
