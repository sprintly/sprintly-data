import _ from 'lodash';
import { Model } from '../support/backbone';
import qs from 'querystring';

export default Model.extend({

  defaults: function() {
    return {
      offset: 0,
      limit: 500,
      status: 'backlog',
      order_by: 'newest',
      children: true
    };
  },

  serialize: function(mergeWith) {
    var json = this.toJSON();
    if (_.isObject(mergeWith)) {
      json = _.extend({}, json, mergeWith);
    }
    return qs.stringify(json);
  }
});
