var Backbone = require('../support/backbone');
var config = require('../config');
var Items = require('../items');
var Model = require('../items/item');
var People = require('./people');
var QueryConfig = require('../items/query-config');

module.exports = Backbone.Model.extend({

  constructor: function(attrs) {
    this.members = new People(null, {
      productId: attrs.id
    });

    // Use Supermodel to create a trackable Item model for this collection
    var ItemModel = this.ItemModel = Model.extend({
      urlRoot: this.url(attrs.id).replace('.json', '/items')
    });

    // Expose getter for the Supermodel backing collection
    Object.defineProperty(this, 'items', {
      get: function() {
        return ItemModel.all();
      }
    });

    // cache for Item Collection filters
    this._filters = {};

    Backbone.Model.apply(this, arguments);
  },

  url: function(id) {
    id = id || this.id;
    return config.BASE_URL + '/products/' + id + '.json';
  },

  createItem: function(attrs, options) {
    return this.ItemModel.create(attrs, options);
  },

  createItemsCollection: function(models, query) {
    var ItemModel = this.ItemModel;
    var queryConfig = new QueryConfig(query);
    var key = queryConfig.serialize();
    var collection = this._filters[key];

    function factory(attrs, options) {
      return ItemModel.create(attrs, options);
    }

    if (collection) {
      collection.add(models);
    } else {
      collection = this._filters[key] = new Items([], {
        productId: this.get('id'),
        people: this.people,
        config: queryConfig,
        model: factory
      });
    }

    return collection;
  },

  getItemsByStatus: function(status) {
    return this.createItemsCollection(null, {
      status: status
    });
  },

  getItemsByUser: function(user) {
    return this.createItemsCollection(null, {
      created_by: user
    });
  }
});


