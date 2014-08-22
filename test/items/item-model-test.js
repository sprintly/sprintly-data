var assert = require('chai').assert;
var sinon = require('sinon').sandbox.create();
var sprintly = require('../../index');
var Comments = require('../../lib/items/comments');

describe('Product Model', function() {

  before(function(){
    this.client = sprintly.createClient(
      process.env.SPRINTLY_EMAIL, process.env.SPRINTLY_API_KEY);
  });

  beforeEach(function() {
    this.product = this.client.products.add();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('initialize', function() {
    it('creates a comments collection', function() {
      var item = this.product.createItem({
        type: 'story'
      });

      assert.instanceOf(item.comments, Comments);
    });

  });

});


