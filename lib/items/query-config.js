var _ = require('lodash')
var Backbone = require('../support/backbone')

module.exports = Backbone.Model.extend({

  defaults: function() {
    return {
      offset: 0,
      limit: 100,
      status: 'backlog',
      order_by: 'newest'
    }
  }

})
