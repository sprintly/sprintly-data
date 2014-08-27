var _ = require('lodash');
var Backbone = require('../support/backbone');
var config = require('../config');
var deps = require('ampersand-dependency-mixin');
var Item = require('./item');
var QueryConfig = require('./query-config');

var Items = Backbone.Collection.extend({

  constructor: function(models, options) {
    options = options || {};
    this.attachDeps(options);
    this.config = options.config.attributes ? options.config : new QueryConfig(options.config);
    options = _.omit(options, 'config');
    Backbone.Collection.apply(this, arguments);
  },

  url: function() {
    return config.BASE_URL + '/products/' + this.productId + '/items';
  },

  sync: function(method, model, options) {
    options = options || {};
    var url = options.url || (typeof model.url == 'function' ? model.url() : model.url);
    if (method === 'read') {
      var query = this.config.serialize();
      options.url = url + '.json?' + query;
    } else {
      options.url = url + '.json';
    }
    return Backbone.Collection.prototype.sync.call(this, method, model, options);
  },

  dependencies: {
    productId: 'Product ID'
  }
});

Items.ITEM_TYPES = Item.ITEM_STATUSES;
Items.STAGES = Item.STAGES;

_.extend(Items.prototype, deps);

module.exports = Items;
