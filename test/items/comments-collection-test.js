import { assert } from "chai";
import Comments from "../../lib/items/comments";

describe('Comments Collection', function() {
  describe('initialize', function() {
    it('enforces dependencies', function() {
      assert.throws(function() {
        new Comments({});
      }, /Item Model/);
    });
  });
});
