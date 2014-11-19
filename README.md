# Sprintly JavaScript SDK

> A JavaScript client for the sprint.ly CORS API

[![wercker status](https://app.wercker.com/status/bc221f27cbc9fc9a53a2157d8c20dd09/m "wercker status")](https://app.wercker.com/project/bykey/bc221f27cbc9fc9a53a2157d8c20dd09)

**WIP**

## Installation

Browserify / Node:

```
npm install --save sprintly/sprintly-data
```

UMD bundle (AMD, global variable) is checked in `./dist.js`.

## Usage

The Client takes and email and API key, and returns 2 Backbone collections.

```javascript
var sprintly = require('sprintly-data');
sprintly.createClient(email, apiKey);
// => {
//     VERSION: 0.0.1,
//     products: [Backbone.Collection],
//     user: [Backbone.Model]
//   }
```

The collections are returned empty, so you'll need to call `fetch` make
a request to the API. This works just like `Backbone.Collection#fetch`.

```javascript
client.products.fetch();
// => [jQuery.Promise]
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

An instance of `Backbone.Collection` that contains all items that have
been fetched from the server

#### product.getItemsByStatus(status)

Creat an empty collection that can retrive items for a status. Returns
and instance of `Backbone.Collection`.

#### product.createItem(attrs, options)

Create a new item. Return an instance of `product.ItemModel`.



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
$ export SPRINTLY_EMAIL=sam@quickleft.com \
    SPRINTLY_API_KEY=xxx \
    SPRINTLY_PRODUCT_ID=22421
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

#### [JShint](jshint.com) and [jsfmt](https://github.com/rdio/jsfmt/)

We use jshint and jsfmt to keep things nice and tidy.

* `jshint` will use `.jshintrc` to evaluate all files in lib/ and test/
* `jsfmt` will actively adjust formatting to match the style of the
  project, only after jshint passes

Please run these with the provided gulp task before opening pull
requests or checking in code:

```bash
$ gulp fmt
```
