import { Model } from '../../support/backbone';

export default Model.extend({
  url: function() {
    return Model.prototype.url.apply(this, arguments).replace('.json', '') + '.json';
  }
});
