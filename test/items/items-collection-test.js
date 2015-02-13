import { assert } from "chai";
import sinon from "sinon";
import * as sprintly from "../../sprintly-data";
import Items from "../../lib/items";
import QueryConfig from "../../lib/items/query-config";


describe('Items Collection', function() {
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

  describe('dependencies', function() {
    it('should require a product ID', function() {
      assert.throws(function() {
        new Items();
      }, /Product ID/);
    });

    it('creates a QueryConfig model', function() {
      var items = new Items(null, {
        productId: 1234,
        config: {
          status: 'backlog'
        }
      });

      assert.instanceOf(items.config, QueryConfig);
      assert.equal(items.config.get('status'), 'backlog');
    });
  });
});
