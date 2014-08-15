var _ = require('lodash')
var Supermodel = require('supermodel')

var Item = Supermodel.Model.extend({
  toJSON: function() {
    var attrs = Supermodel.Model.prototype.toJSON.call(this);

    if (_.isArray(attrs.tags)){
      attrs.tags = attrs.tags.join(',')
    }

    return attrs;
  }
})

Item.ITEM_TYPES = {
  'someday': 'Someday',
  'backlog': 'Backlog',
  'in-progress': 'Current',
  'completed': 'Done',
  'accepted': 'Accepted'
}

Item.STAGES = {
  'Triage': ['someday', 'backlog'],
  'Underway': ['backlog', 'in-progress'],
  'Pending': ['in-progress', 'completed'],
  'Done': ['completed', 'accepted'],
}

module.exports = Item;
