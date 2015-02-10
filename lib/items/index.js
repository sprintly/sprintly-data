import _ from 'lodash';
import {Collection} from '../support/backbone';
import config from '../config';
import deps from 'ampersand-dependency-mixin';
import Item from './item';
import QueryConfig from './query-config';

var Items = Collection.extend({

  dependencies: {
    productId: 'Product ID'
  },

  constructor: function(models, options) {
    options = options || {};
    this.attachDeps(options);
    this.config = options.config.attributes ? options.config : new QueryConfig(options.config);
    options = _.omit(options, 'config');
    Collection.apply(this, arguments);
  },

  url: function() {
    return `${config.BASE_URL}/products/${this.productId}/items`;
  },

  sync: function(method, model, options) {
    options = options || {};
    var url = options.url || (typeof model.url == 'function' ? model.url() : model.url);
    options.url = `${url}.json`;
    if (method === 'read') {
      options.url = `${url}.json?${this.config.serialize(options.config)}`;
    }
    return Collection.prototype.sync.call(this, method, model, options);
  }
});

Items.ITEM_TYPES = Item.ITEM_STATUSES;
Items.STAGES = Item.STAGES;

_.extend(Items.prototype, deps);

export default Items;
