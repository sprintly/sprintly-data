describe('slow', function() {
  require('./sanity');
});

describe('fast', function() {
  require('./products/product-test');
  require('./products/tags-test');
  require('./products/people-test');
  require('./items/items-collection-test');
  require('./items/items-query-config-test');
  require('./items/item-model-test');
  require('./items/comments-collection-test');
});
