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
      var item = Item.create({ number: 51 });
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

});


