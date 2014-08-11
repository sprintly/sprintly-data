var test = require('tape')
var sprintly = require('../index')

test('version number', function(t) {
  t.plan(1)
  t.equal(sprintly.VERSION, require('../package.json').version)
})

test('api request', function(t) {
  t.plan(1);

  var client = sprintly.createClient(process.env.SPRINTLY_EMAIL, process.env.SPRINTLY_TOKEN)
  client.products.fetch()
    .then(function(c) {
      console.log(client.products.toJSON())
      t.ok(true)
    })
})
