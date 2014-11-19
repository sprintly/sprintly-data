var _ = require('lodash');
var Supermodel = require('supermodel');
var Backbone = require('../support/backbone');
var Comments = require('./comments');

Supermodel.sync = Backbone.sync;

var Item = Supermodel.Model.extend({

  initialize: function(attrs) {
    Supermodel.Model.prototype.initialize.apply(this, arguments);
    this.comments = new Comments(null, {
      item: this
    });

    if (attrs.parent) {
      this.set('parent', new Item(attrs.parent));
    }
  },

  sync: function(method, model, options) {
    if (method === 'update') {
      method = 'create';
    }

    return Supermodel.Model.prototype.sync.call(this, method, model, options);
  },

  idAttribute: 'number',

  url: function() {
    var url = Supermodel.Model.prototype.url.apply(this, arguments);
    return url + '.json';
  },

  toJSON: function(options) {
    var attrs = Supermodel.Model.prototype.toJSON.call(this);

    if (options && options.full) {
      return attrs;
    }

    if (_.isArray(attrs.tags)) {
      attrs.tags = attrs.tags.join(',');
    }

    if (attrs.assigned_to === null) {
      delete attrs.assigned_to;
    }

    if (attrs.type) {
      if (attrs.type === 'story') {
        delete attrs.title;
      }

      attrs.type_in_words = attrs.type;
      delete attrs.type;
    }

    attrs.created_by = this.get('created_by').id;

    return attrs;
  },

  validate: function(attrs) {
    var requiredProps = {
      'type': _.partial(_.contains, Item.ITEM_TYPES)
    };

    if (attrs.type && attrs.type === 'story') {
      _.extend(requiredProps, {
        'who': _.isString,
        'what': _.isString,
        'why': _.isString
      });
    } else {
      _.extend(requiredProps, {
        'title': _.isString
      });
    }

    var invalidRequiredProps = _.reject(_.keys(requiredProps), function(name) {
      var isValid = requiredProps[name];
      var attr = attrs[name];
      if (!attr) {
        return false;
      }
      return isValid(attrs[name]);
    });

    if (invalidRequiredProps.length > 0) {
      return 'Missing or invalid properties: ' + invalidRequiredProps.join(', ');
    }

    var optionalProps = {
      'description': _.isString,
      'status': _.partial(_.contains, Object.keys(Item.ITEM_STATUSES)),
      'assigned_to': _.isNumber
    };

    var invalidOptionalProps = _.reject(_.keys(optionalProps), function(name) {
      var isValid = optionalProps[name];
      var attr = attrs[name];
      if (attr) {
        return isValid(attr);
      } else {
        return true;
      }
    });

    if (invalidOptionalProps.length > 0) {
      return [
        'Invalid ',
        (invalidOptionalProps.length === 1 ? 'property' : 'properties'),
        ': ',
        invalidOptionalProps.join(', ')
      ].join('');
    }
  }
});

Item.ITEM_TYPES = ['story', 'task', 'defect', 'test'];

Item.ITEM_STATUSES = {
  'someday': 'Someday',
  'backlog': 'Backlog',
  'in-progress': 'Current',
  'completed': 'Done',
  'accepted': 'Accepted'
};

Item.STAGES = {
  'Triage': ['someday', 'backlog'],
  'Underway': ['backlog', 'in-progress'],
  'Pending': ['in-progress', 'completed'],
  'Done': ['completed', 'accepted'],
};

module.exports = Item;
