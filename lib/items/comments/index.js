import _ from 'lodash';
import { Collection } from '../../support/backbone';
import deps from 'ampersand-dependency-mixin';
import Comment from './comment';

var Comments = Collection.extend({

  model: Comment,

  dependencies: {
    item: 'Item Model'
  },

  initialize: function(models, options) {
    this.attachDeps(options);
  },

  url: function() {
    var base = this.item.url().replace('.json', '');
    return `${base}/comments.json`;
  }
});

_.extend(Comments.prototype, deps);

export default Comments;
