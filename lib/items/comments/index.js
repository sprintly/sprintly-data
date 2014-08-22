var _ = require('lodash');
var Backbone = require('../../support/backbone');
var deps = require('ampersand-dependency-mixin');
var Comment =require('./comment');

var Comments = Backbone.Collection.extend({

  model: Comment,

  dependencies: {
    item: 'Item Model'
  },

  initialize: function(models, options) {
    this.attachDeps(options);
  },

  url: function() {
    return this.item.url().replace('.json', '') + '/comments.json';
  }

});

_.extend(Comments.prototype, deps);

module.exports = Comments;
