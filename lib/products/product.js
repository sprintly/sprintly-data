var Backbone = require('../support/backbone');
var config = require('../config');
var Items = require('../items');
var Model = require('../items/item');
var People = require('./people');

module.exports = Backbone.Model.extend({

  constructor: function(attrs) {
    this.people = new People(null, {
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
    var item = new this.ItemModel(attrs, options);
    return item;
  },

  createItemsCollection: function(models, query) {
    var ItemModel = this.ItemModel;

    return new Items(models || [], {
      productId: this.get('id'),
      people: this.people,
      model: function(attrs, options) {
        return ItemModel.create(attrs, options);
      },
      config: query
    });
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


