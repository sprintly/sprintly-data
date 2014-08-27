describe('slow', function() {
  require('./sanity');
});

describe('fast', function() {
  require('./products/product-test');
  require('./items/items-collection-test');
  require('./items/item-model-test');
  require('./items/comments-collection-test');
});
