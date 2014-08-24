describe('slow', function() {
  require('./sanity');
});

describe('fast', function() {
  require('./products/product-test');
  require('./items/item-model-test');
});
