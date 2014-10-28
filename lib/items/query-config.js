var _ = require('lodash');
var Backbone = require('../support/backbone');
var qs = require('querystring');

module.exports = Backbone.Model.extend({

  defaults: function() {
    return {
      offset: 0,
      limit: 500,
      status: 'backlog',
      order_by: 'newest',
      children: true
    };
  },

  serialize: function (mergeWith) {
    var json = this.toJSON();
    if (mergeWith) {
      json = _.extend({}, json, mergeWith);
    }
    return qs.stringify(json);
  }
});
