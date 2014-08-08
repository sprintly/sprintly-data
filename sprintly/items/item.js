var Supermodel = require('supermodel')

var Item = Supermodel.Model.extend({})

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
