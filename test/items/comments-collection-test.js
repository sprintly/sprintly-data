var assert = require('chai').assert;
var Comments = require('../../lib/items/comments');

describe('Comments Collection', function() {
  describe('initialize', function() {
    it('enforces dependencies', function() {
      assert.throws(function() {
        new Comments({});
      }, /Item Model/);
    });
  });
});
