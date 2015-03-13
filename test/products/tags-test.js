import { assert } from "chai";
import Tags from "../../lib/products/tags";

describe('Tags Collection', function() {

  describe('constructor', function() {
    it('requireds a product id', function() {
      assert.throws(function() {
        new Tags(null, {});
      }, /Product ID/);
    });
  });

  describe('url', function() {
    it('should include the products id', function() {
      var tags = new Tags(null, { productId: 1 });
      assert.include(tags.url(), '/products/1/tags.json');
    });
  });
});
