import _ from 'lodash';
import { Collection } from '../support/backbone';
import Supermodel from 'supermodel';
import Comments from './comments';

var Item = Supermodel.Model.extend({

  initialize: function() {
    Supermodel.Model.prototype.initialize.apply(this, arguments);
    this.comments = new Comments(null, {
      item: this
    });
  },

  idAttribute: 'number',

  url: function() {
    var url = Supermodel.Model.prototype.url.apply(this, arguments);
    return url + '.json';
  },

  toJSON: function(options={}) {
    var attrs = Supermodel.Model.prototype.toJSON.call(this);

    if (_.isArray(attrs.tags)) {
      attrs.tags = attrs.tags.join(',');
    }

    if (options.save) {
      if (_.isObject(attrs.assigned_to)) {
        attrs.assigned_to = attrs.assigned_to.id;
      }
    }

    return attrs;
  },

  save: function(key, val, options) {
    var attrs;

    // Handle both `"key", value` and `{key: value}` -style arguments.
    if (key == null || typeof key === 'object') {
      attrs = key;
      options = val;
    } else {
      (attrs = {})[key] = val;
    }

    _.extend(options, {
      save: true
    });

    return Supermodel.Model.prototype.save.call(this, attrs)
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
  'Triage':   ['someday', 'backlog'],
  'Underway': ['backlog', 'in-progress'],
  'Pending':  ['in-progress', 'completed'],
  'Done':     ['completed', 'accepted'],
};

Item.has().many('children', {
  collection: Collection,
  inverse: 'parent'
});

Item.has().one('parent', {
  model: Item,
  inverse: 'children'
});

export default Item;
