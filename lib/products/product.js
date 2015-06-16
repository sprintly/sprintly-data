import _ from 'lodash';
import Backbone from '../support/backbone';
import { BASE_URL } from '../config';
import Items from '../items';
import Model from '../items/item';
import People from './people';
import Tags from './tags';
import QueryConfig from '../items/query-config';

export default Backbone.Model.extend({

  constructor: function(attrs) {
    this.members = new People(null, {
      productId: attrs.id
    });

    this.tags = new Tags(null, {
      productId: attrs.id
    });

    // Use Supermodel to create a trackable Item model for this collection
    var ItemModel = this.ItemModel = Model.extend({
      urlRoot: this.url(attrs.id).replace('.json', '/items')
    });

    let Children = Backbone.Collection.extend({
      add(models, options={}) {
        if (_.isArray(models)) {
          models = _.map(models, function(model) {
            return _.omit(model, 'parent');
          });
        }
        return Backbone.Collection.prototype.add.call(this, models, options);
      },
      model(attrs, options) {
        return ItemModel.create(attrs, options)
      }
    });

    ItemModel.has().many('sub_items', {
      collection: Children,
      inverse: 'parent'
    });

    ItemModel.has().one('parent', {
      model: ItemModel,
      inverse: 'sub_items'
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

  sync: function(method, model, options={}) {
    if (method === 'update') {
      method = 'create';
    }

    return Backbone.Model.prototype.sync.call(this, method, model, options);
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


