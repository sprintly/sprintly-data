import { assert } from "chai";
import People from "../../lib/products/people";

describe('People Collection', function() {
  describe('constructor', function() {
    it('requireds a product id', function() {
      assert.throws(function() {
        new People(null, {});
      }, /Product ID/);
    });
  });

  describe('url', function() {
    it('should include the products id', function() {
      var people = new People(null, { productId: 1 });
      assert.include(people.url(), '/products/1/people.json');
    });
  });
});
