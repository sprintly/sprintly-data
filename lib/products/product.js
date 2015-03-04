import Backbone from '../support/backbone';
import { BASE_URL } from '../config';
import Items from '../items';
import Model from '../items/item';
import People from './people';
import QueryConfig from '../items/query-config';

export default Backbone.Model.extend({

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

  url: function(id=this.id) {
    return `${BASE_URL}/products/${id}.json`;
  },

  createItem: function(attrs, options) {
    return this.ItemModel.create(attrs, options);
  },

  createItemsCollection: function(models, query) {
    var ItemModel = this.ItemModel;
    var config = new QueryConfig(query);
    var uniqueId = config.get('status') || config.serialize();
    var collection = this._filters[uniqueId];
    var model = function(attrs, options) {
      return ItemModel.create(attrs, options);
    };

    if (collection) {
      collection.add(models);
    } else {
      collection = this._filters[uniqueId] = new Items([], {
        config,
        model,
        people: this.people,
        productId: this.get('id')
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


