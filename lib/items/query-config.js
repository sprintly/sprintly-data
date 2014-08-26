var Backbone = require('../support/backbone');
var qs = require('querystring');

module.exports = Backbone.Model.extend({

  defaults: function() {
    return {
      offset: 0,
      limit: 100,
      status: 'backlog',
      order_by: 'newest'
    };
  },

  serialize: function() {
    return qs.stringify(this.toJSON());
  }
});
