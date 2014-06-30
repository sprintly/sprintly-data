var Backbone = require('backdash')
var Supermodel = require('supermodel')
var config = require('../config')
var Items = require('../items')
var Model = require('../items/item')
var People = require('./people')

module.exports = Backbone.Model.extend({

  constructor: function(attrs, options) {
    this.people = new People(null, { productId: attrs.id })

    // Use Supermodel to create a trackable Item model for this collection
    var ItemModel = this.ItemModel = Model.extend({
      idAttribute: 'number'
    })

    // Expose getter for the Supermodel backing collection
    Object.defineProperty(this, 'items', {
      get: function(){
        return ItemModel.all()
      }
    })

    // cache for Item Collection filters
    this.filters = {}

    Backbone.Model.apply(this, arguments)
  },

  url: function() {
    return config.BASE_URL + '/products/' + this.id + '.json'
  },

  createItemsCollection: function(models) {
    var ItemModel = this.ItemModel

    return new Items(models || [], {
      productId: this.get('id'),
      people: this.people,
      model: function(attrs, options) {
        return ItemModel.create(attrs, options)
      }
    });
  },

  getItemsByStatus: function(status) {
    var items = this.filters[status]

    if (!items) {
      items = this.createItemsCollection()
      items.config.set('status', status)
      this.filters[status] = items
    }

    return items
  },

});


