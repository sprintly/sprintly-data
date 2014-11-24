var chai = require('chai')
var sprintly = require('../index');
var chaiAsPromised = require("chai-as-promised");

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

  before(function(){
    this.client = sprintly.createClient(
      process.env.SPRINTLY_EMAIL, process.env.SPRINTLY_API_KEY);

    this.product = this.client.products.add({ id: 22241 });
  });

  it('product info', function() {
    return expect(this.product.fetch()).to.be.fulfilled;
  });

  it('create & destroy item', function() {
    var item = this.product.createItem(fixtures.item.task);

    return item.save()
      .then(function(model) {
        return expect(item.destroy()).to.eventually.be.fulfilled;
      });
  });

  describe('fetching items', function() {

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
