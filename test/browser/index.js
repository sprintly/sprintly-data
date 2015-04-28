require('../index');

if (window.mochaPhantomjs) {
  require('es5-shim');
  window.mochaPhantomjs.run();
} else {
  window.mocha.run();
}
