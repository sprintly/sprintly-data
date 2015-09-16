# Sprintly JavaScript SDK

> Models and Collections for the [Sprintly](https://sprint.ly/) [API](https://sprintly.uservoice.com/knowledgebase/topics/15784-api)

[![wercker status](https://app.wercker.com/status/bc221f27cbc9fc9a53a2157d8c20dd09/m/master "wercker status")](https://app.wercker.com/project/bykey/bc221f27cbc9fc9a53a2157d8c20dd09)

## Installation

npm (Browserify / Webpack / node / iojs):

```
npm install --save sprintly-data
```

UMD bundle (AMD, global variable) is also available via npm install.

## Usage

The Client takes and email and API key and returns a client object with
a Products Collection and a User Model.

```javascript
var sprintly = require('sprintly-data');
var client = sprintly.createClient(email, apiKey);
// => {
//     VERSION: 1.1.0,
//     products: [Backbone.Collection],
//     user: [Backbone.Model]
//   }
```

Alternately, you can provide an OAuth token:

```javascript
var client = sprintly.createClient({ token: 'xxxAbc123'});
```

These objects are "empty" when you first create them, so you'll need to
call `fetch` make a request to the API. This works just like
`Backbone.Collection#fetch`.

```javascript
client.products.fetch();
// => [Promise]
```

Items are accessed through filter collections attached to the items'
product.

```
var myProduct = clients.products.get(1);
var backlog = myProduct.getItemsByStatus('backlog');

backlog.fetch(function(items) {
  // backlog items loaded
})
```

A backing collection that uses
[backbone-supermodel](http://pathable.github.io/supermodel/) is also
available on a product model, as well as the Item supermodel.

```javascript
myProduct.items
// => [Backbone.Collection]

myProduct.ItemModel
// => [Supermodel.Model]
```

## API

#### sprintly.createClient(email, apiKey)

#### sprintly.createClient({ token: <Oauth Token> })

Create an instance of the sprintly-data client. This can be done with
your username and API key, or with an OAuth token (NB: you will also need
a client server to facilitate OAuth login.)

### Products

#### client.products

Instance of `Backbone.Collection` containing a user's products. Use
`fetch()` to populate with data.

### Items

If you want to consume the full collection, you'll find the
`collectionConsumer` function handy. It returns a promise for when the
collection has been fully filled.

```
var promise = sprintly.collectionConsumer(product.getItemsByStatus('backlog'))
promise.then(function () {
  console.log('all done');
});
promise.progess(function () {
  console.log('first page of results have loaded');
});
```

#### product.items

A Backbone Collection that contains all items that have
been fetched from the server

#### product.getItemsByStatus(status)

Creat an empty collection that can retrive items for a status. Returns
and instance of `Backbone.Collection`.

#### product.createItem(attrs, options)

Create a new item. Return an instance of `product.ItemModel`.

#### product.members

A Backbone Collection for all of the users belonging to the product. Use `product.members.fetch()` to populate with data from the server.

#### product.tags

A Backbone Collecion with the Tags associated with the product. Use `products.tags.fetch()` to populated with data from the server.

## Development

**Prerequisites**

* node >= 0.10 and npm

```bash
$ npm install
```

#### Tests

The full test suite requires a Sprintly account with an api key and
the id of product you want to use during testing.

```bash
$ export SPRINTLY_EMAIL=example@example.com \
    SPRINTLY_API_KEY=abc123 \
    SPRINTLY_PRODUCT_ID=54321
```

Then run the test suite with:

```bash
$ npm test
```

Or if you'd like to run tests in the browser, build the test bundle and
open the html runner in your favorite browser.

```bash
$ npm run build-test
$ open test/index.html
```

To run a partial test suite (unit tests only), use the gulp task:

```bash
$ gulp test
```

#### Build Tasks

To build just the standalone browser bundle, run:

```bash
$ npm run build
```

To build a minified standalone browser bundle, run:

```bash
$ npm run prepublish
```

To build the files for the browser based test suite, run:

```bash
$ npm run build-test
```

Or, re-build the test files any time a file changes with:

```bash
$ npm run watch-test
```

Lint files

```bash
$ gulp lint
```

#### Internal Development Tools

If you need to point to a non-production sprint.ly server you can set the following global variable before loading sprintly-data:

```javascript
var __sprintly_data_config = { BASE_URL: 'https://sprint.ly/api' };
```
