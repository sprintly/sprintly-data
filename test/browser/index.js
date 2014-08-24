require('../index');

if (window.mochaPhantomjs) {
  window.mochaPhantomjs.run();
} else {
  window.mocha.run();
}
