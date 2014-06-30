var test = require('tape')
var sprintly = require('../index')

test('version number', function(t) {
  t.plan(1)
  t.equal(sprintly.VERSION, require('../package.json').version)
})
