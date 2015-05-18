import { assert } from "chai";
import sinon from "sinon";
import * as sprintly from "../..";
import Comments from "../../lib/items/comments";
import Item from "../../lib/items/item";

describe('Item Model', function() {

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
    this.product.items.reset();
    this.sinon.restore();
  });

  describe('initialize', function() {
    it('creates a comments collection', function() {
      var item = this.product.createItem({
        type: 'story'
      });

      assert.instanceOf(item.comments, Comments);
    });

    it('creates a parent if available', function() {
      var item = this.product.createItem({
        number: 50,
        parent: {
          number: 23
        }
      });

      assert.instanceOf(item.parent(), Item);
    });

    it('creates a parent item when updating a collection', function() {
      var item = this.product.ItemModel.create({ number: 51 });
      var collection = this.product.createItemsCollection([], {});

      collection.add({ number: 51, parent: { number: 15 } });

      assert.equal(item.parent().id, 15);
    });

    it("doesn't make a parent item instance if no parent", function() {
      var item = this.product.createItem({
        number: 50,
        parent: 0
      });

      assert.notInstanceOf(item.get('parent'), Item);
    });
  });

  describe('toJSON', function() {
    context('{ save: true }', function() {
      beforeEach(function() {
        var item = Item.create({
          number: 51,
          type: 'story',
          assigned_to: { id: 1 }
        });
        this.json = item.toJSON({ save: true });
      });

      it('outputs just the item number for `assigned_to`', function() {
        assert.equal(this.json.assigned_to, 1);
      });

      it('removes item.type only if item has a number', function() {
        assert.isUndefined(this.json.type);
      });

      it('perserves item.type for new items', function() {
        var item = Item.create({
          type: 'story',
          assigned_to: { id: 1 }
        });
        var json = item.toJSON({ save: true });
        assert.equal(json.type, 'story');
      });
    });

    context('sub_items', function() {
      beforeEach(function() {
        this.item = this.product.ItemModel.create({
          number: 51,
          type: 'story',
          status: 'backlog'
        });
        this.subitem = this.product.ItemModel.create({
          type: 'task', title: 'foo', status: 'backlog', number: 99, parent: 51
        });
      });

      it('shows sub_items', function() {
        let json = this.item.toJSON();
        assert.deepEqual(json.sub_items[0], {
          type: 'task', title: 'foo', status: 'backlog', number: 99, parent_id: 51
        });
      });

      it('options { sub_items: false }', function() {
        let json = this.item.toJSON({ sub_items: false });
        assert.isUndefined(json.sub_items);
      });
    });

    context('parent', function() {
      beforeEach(function() {
        this.product.ItemModel.create({
          number: 51,
          type: 'story',
          status: 'backlog',
        });
        this.subitem = this.product.ItemModel.create({
          type: 'task', title: 'foo', status: 'backlog', number: 99, parent: 51
        });
        this.json = this.subitem.toJSON();
      });

      it('shows a parent item', function() {
        assert.deepEqual(this.json.parent, {
          number: 51,
          type: 'story',
          status: 'backlog'
        });
      });

      it('options { parent: false }', function() {
        let json = this.subitem.toJSON({ parent: false });
        assert.isUndefined(json.parent);
      });
    });
  });

  describe('validation', function() {
    it('enforces clientside validation errors', function() {
      var item = this.product.createItem({
        type: 'story',
      });
      var err = item.validate(item.toJSON());

      assert.match(err, /who, what, why/, 'has the correct error message');
    });

    it('calls sync when the model passes validation', function() {
      var sync = this.sinon.stub(this.product.ItemModel.prototype, 'sync');
      var item = this.product.createItem({
        type: 'defect',
        title: 'I have created THE BUG'
      });

      item.save();
      assert.ok(sync.called);
    });
  });

  describe('resort', function() {
    beforeEach(function() {
      this.server = sinon.fakeServer.create();
      this.item = this.product.createItem({
        number: 50,
        product: {
          id: 1
        }
      });
      this.item.url = function() {
        return '/products/1/items/50.json';
      };
    });

    afterEach(function() {
      this.server.restore();
    });

    // fakeserver doesn't work in phantomjs
    it.skip('returns a promise', function() {
      this.server.respondWith(
        'POST',
        '/products/1/items/50/resort.json',
        [
          200,
          { 'Content-Type': 'application/json' },
          '{ "sort": 20000 }'
        ]
      );

      var req = this.item.resort({ before: 2 });
      this.server.respond();
      return req;
    });

    // fakeserver doesn't work in phantomjs
    it.skip('rejects the promise if the server errors', function(done) {
      this.server.respondWith(
        'POST',
        '/products/1/items/50.resort.json',
        [500, {}, '']
      );
      this.item.resort({ before: 2 }).catch(function() {
        done();
      });
      this.server.respond();
    });

    it('validates input', function() {
      assert.throws(() => this.item.resort(), /must provide a value for before or after/);
    });
  });

});


