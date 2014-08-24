var assert = require('chai').assert;
var sinon = require('sinon').sandbox.create();
var sprintly = require('../../index');

describe('Product Model', function() {

  before(function(){
    this.client = sprintly.createClient(
      process.env.SPRINTLY_EMAIL, process.env.SPRINTLY_API_KEY);
  });

  beforeEach(function() {
    this.product = this.client.products.add({ id: process.env.SPRINTLY_TEST_PRODUCT || 22241 });
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('createItem', function() {
    it('enforces clientside validation errors', function() {
      var item = this.product.createItem({
        type: 'story',
      });
      var err = item.validate(item.toJSON());

      assert.match(err, /who, what, why/, 'has the correct error message');
    });

    it('calls sync when the model passes validation', function() {
      var sync = sinon.stub(this.product.ItemModel.prototype, 'sync');
      var item = this.product.createItem({
        type: 'defect',
        title: 'I have created THE BUG'
      });

      item.save();
      assert.ok(sync.called);
    });

  });

});

