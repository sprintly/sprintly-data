var test = require('tape')
var sprintly = require('../sprintly')

test('version number', function(t) {
  t.plan(1)
  t.equal(sprintly.VERSION, require('../package.json').version)
})

test('api request', function(t) {
  t.plan(1);

  var client = sprintly.createClient('sam@quickleft.com', 'LSzELDqKvbN2LhjAD3UDcKMm5x26eHEK')
  client.products.fetch()
    .then(function(c) {
      console.log(client.products.toJSON())
      t.ok(true)
    })
})
