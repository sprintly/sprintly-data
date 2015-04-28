import _ from 'lodash';
import { Collection, sync } from '../support/backbone';
import Supermodel from '@sprintly/supermodel';
import Comments from './comments';
import Superagent from 'superagent';
import {BASE_URL} from '../config';
import Q from 'q';

var Item = Supermodel.Model.extend({

  initialize: function() {
    Supermodel.Model.prototype.initialize.apply(this, arguments);
    this.comments = new Comments(null, {
      item: this
    });
  },

  idAttribute: 'number',

  url: function() {
    if (this.isNew()) {
      return Supermodel.Model.prototype.url.apply(this, arguments) + '.json';
    }
    var productId = this.get('product').id;
    var itemNumber = this.get('number');
    return `${BASE_URL}/products/${productId}/items/${itemNumber}.json`;
  },

  resort: function(payload={}) {
    if ( !(payload.before || payload.after) ) {
      throw new Error('You must provide a value for before or after.');
    }
    var url = this.url().replace('.json', '/resort.json');
    var item = this;
    var req = Superagent.post(url)
      .type('form')
      .send(payload);

    // decorate auth onto request
    sync.editRequest(req);

    return Q.Promise(function(resolve, reject) {
      req.end(function(err, res) {
        if (err) {
          reject(err);
        }

        if (res.ok) {
          item.set(res.body);
          resolve();
        } else {
          reject();
        }
      });
    });
  },

  toJSON: function(options={}) {
    var attrs = Supermodel.Model.prototype.toJSON.call(this);

    if (_.isArray(attrs.tags)) {
      attrs.tags = attrs.tags.join(',');
    }

    if (options.save) {
      _.each(['created_by', 'assigned_to'], function(key) {
        if (_.isObject(attrs[key])) {
          attrs[key] = attrs[key].id;
        }
      });

      if (attrs.type === 'story') {
        delete attrs.title;
      }

      if (attrs.number !== undefined) {
        delete attrs.type;
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

    options = options || {};
    options.save = true;

    return Supermodel.Model.prototype.save.call(this, attrs, options)
  },

  sync: function(method, model, options={}) {
    if (method === 'update') {
      method = 'create';
    }

    return Supermodel.Model.prototype.sync.call(this, method, model, options);
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
