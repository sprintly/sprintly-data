import _ from 'lodash';
import { Collection } from '../support/backbone';
import { BASE_URL } from '../config';
import deps from 'ampersand-dependency-mixin';

var PeopleCollection = Collection.extend({
  url: function() {
    return `${BASE_URL}/products/${this.productId}/people.json`;
  },

  dependencies: {
    productId: 'Product ID'
  },

  initialize: function(models, options) {
    this.attachDeps(options);
  }
});

_.extend(PeopleCollection.prototype, deps);

export default PeopleCollection;
