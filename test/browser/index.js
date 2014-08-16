require('../sanity');
require('../products/product-test');

if (window.mochaPhantomjs) {
  window.mochaPhantomjs.run();
} else {
  window.mocha.run();
}
