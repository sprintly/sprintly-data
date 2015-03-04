var chai = require('chai')
var sprintly = require('../index');
var chaiAsPromised = require("chai-as-promised");
var assert = chai.assert;

chai.use(chaiAsPromised);
var expect = chai.expect;

var fixtures = {
  item: {
    task: {
      type: 'task',
      title: 'I have created the TASK',
      status: 'backlog'
    }
  }
};

describe('Sanity', function() {
  this.timeout(5e3);

  before(function(){
    var email = process.env.SPRINTLY_EMAIL;
    var apiKey = process.env.SPRINTLY_API_KEY;

    assert.ok(email, 'SPRINLTY_EMAIL is missing from environment');
    assert.ok(apiKey, 'SPRINLTY_API_KEY is missing from environment');

    this.client = sprintly.createClient(email, apiKey);
    this.product = this.client.products.add({ id: 29125 });
  });

  it('product info', function() {
    return expect(this.product.fetch()).to.be.fulfilled;
  });

  describe('create and destroy item', function() {

    before(function() {
      this.item = this.product.createItem(fixtures.item.task);
      return this.item.save();
    });

    it('destroys an item', function() {
      return expect(this.item.destroy()).to.eventually.be.fulfilled;
    });

  });

  describe('fetching items', function() {
    this.timeout(5e3);

    before(function() {
      this.item = this.product.createItem(fixtures.item.task);
      return this.item.save();
    });

    after(function() {
      return this.item.destroy();
    });

    it('can fetch items by status', function() {
      var backlog = this.product.getItemsByStatus('backlog');

      return backlog.fetch().then(function() {
        expect(backlog.length).to.equal(1);
      });
    });
  });

});
