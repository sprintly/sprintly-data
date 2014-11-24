var _ = require('lodash');
var assert = require('chai').assert;
var sinon = require('sinon').sandbox.create();
var sprintly = require('../../index');
var Items = require('../../lib/items');
var Product = require('../../lib/products/product');
var People = require('../../lib/products/people');

describe('Product Model', function() {

  before(function() {
    this.client = sprintly.createClient(process.env.SPRINTLY_EMAIL, process.env.SPRINTLY_API_KEY);
  });

  beforeEach(function() {
    this.product = this.client.products.add({
      id: process.env.SPRINTLY_TEST_PRODUCT || 22241
    });
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('constructor', function() {
    beforeEach(function() {
      this.product = new Product({
        id: 1234
      });
    });

    it('creates a members collection', function() {
      assert.instanceOf(this.product.members, People);
    });

    it('creates a unique Item supermodel', function() {
      assert.include(this.product.ItemModel.prototype.urlRoot, '1234');
    });

    it('makes items an accessor for the supermodel\'s backing collection', function() {
      var all = sinon.spy(this.product.ItemModel, 'all');
      var col = this.product.items;
      assert.ok(all.calledOnce);
      assert.strictEqual(col, this.product.ItemModel.all());
    });
  });

  describe('createItemsCollection', function() {
    beforeEach(function() {
      this.items = this.product.createItemsCollection(null, {
        status: 'backlog'
      });
    });

    it('uses the supermodel to make the collection', function() {
      this.items.add([
        { number: 123 },
        { number: 321 }
      ]);
      assert.equal(this.items.length, this.product.items.length);
    });

    it('creates an items collection', function() {
      assert.instanceOf(this.items, Items);
    });

    it('caches the instances of the same collection', function() {
      var items = this.product.createItemsCollection(null, {
        status: 'backlog'
      });

      assert.equal(_.size(this.product._filters), 1);
      assert.strictEqual(items, this.items);
    });
  });

});

