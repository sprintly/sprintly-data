/**
 * This module supports fully consuming a paginated backbone collection.
 * 
 * API:
 *
 *   var ItemsCollection = require(..);
 *   var ic = new ItemsCollection();
 *   // calls ic.fetch({config: {offset: n}}) until n is done. 
 *   var allItemsPromise = consume(ic);
 *
 *   allItemsPromise will be resolved when the collection has been populated.
 */
var async = require('async');
var Q = require('q');
var _ = require('lodash');

var PageConsumer = function(collection, options) {
  this.options = options || {};
  this.collection = collection;
  var workers = this.options.workers || 5;
  this.increment = this.options.increment || 500 ;

  this.q = async.queue(_.bind(function(task, cb) {
    var fetchPromise = this.collection.fetch({
      config: _.extend({
        offset: task.offset,
        limit: this.increment
      }, this.options),
      remove: false
    }).then(cb, function(coll, resp) {
      task.dfd.reject(resp.error.message);
    });
    task.dfd.notify(fetchPromise);
  }, this), workers);
};

PageConsumer.prototype = {
  consume: function() {
    var dfd = Q.defer();

    this.q.drain = function() {
      dfd.resolve();
    };

    // It's important we define the alternate success callback as
    // that's the only way we can get access to the
    // `x-sprintly-item-count` header. Without this, we have no way of
    // knowing how many requests to make. This would lead us to making
    // serial requests, which is much slower.
    this.collection.fetch({
      config: _.extend({
        offset: 0,
        limit: this.increment
      }, this.options),
      remove: true,
      success: _.bind(function(coll, resp, opts) {
        var totalItems = opts.res.headers['x-sprintly-item-count'];
        var itemsToFetch = totalItems - this.increment;
        console.log(totalItems, itemsToFetch, this.increment);
        var zeroBasedOffset = 1;
        dfd.notify(1);

        if (itemsToFetch > 0) {
          _.times(Math.ceil(itemsToFetch / this.increment), function(n) {
            this.q.push({
              offset: (n + zeroBasedOffset) * this.increment,
              dfd: dfd
            });
          }, this);
        } else {
          dfd.resolve();
        }
      }, this),
      error: function(coll, resp) {
        dfd.reject(resp.error.message);
      }
    });

    return dfd.promise;
  }
};


module.exports = function consume(coll, options) {
  return new PageConsumer(coll, options).consume();
};
