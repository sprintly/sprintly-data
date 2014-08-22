var Backbone = require('../../support/backbone');

var Comment = Backbone.Model.extend({

  url: function() {
    return Backbone.Model.prototype.url.apply(this, arguments).replace('.json', '') + '.json';
  }

});

module.exports = Comment;
