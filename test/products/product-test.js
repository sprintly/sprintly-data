import _ from "lodash";
import { assert } from "chai";
import sinon from "sinon";
import * as sprintly from "../..";
import Items from "../../lib/items";
import People from "../../lib/products/people";
import Product from "../../lib/products/product";

describe('Product Model', function() {

  before(function() {
    this.client = sprintly.createClient(process.env.SPRINTLY_EMAIL, process.env.SPRINTLY_API_KEY);
  });

  beforeEach(function() {
    this.product = this.client.products.add({
      id: process.env.SPRINTLY_TEST_PRODUCT || 22241
    });
    this.sinon = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sinon.restore();
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
      var all = this.sinon.spy(this.product.ItemModel, 'all');
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

  describe('url', function() {
    it('should default the current products id', function() {
      assert.include(this.product.url(), this.product.id);
    });

    it('should accept an alternate id as input', function() {
      assert.include(this.product.url(666), 666);
    });
  });

});

