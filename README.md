# Sprintly JavaScript SDK

> A JavaScript client for the sprint.ly CORS API

**WIP**

## Installation

Browserify / Node:

```
npm install --save sprintly/sprintly-sdk
```

UMD bundle (AMD, global variable) is checked in `./dist.js`.

## Usage

The Client takes and email and API key, and returns 2 Backbone collections.

```javascript
var sprintly = require('sprintly-sdk');
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
var backlog = myProduct.fetchItemsByStatus('backlog');

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

## Development

**Prerequisites**

* node >= 0.10 and npm

```bash
$ npm install
```

Run tests:

```bash
$ npm test
```
