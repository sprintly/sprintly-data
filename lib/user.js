import Backbone from './support/backbone';
import { BASE_URL } from './config';

export default Backbone.Model.extend({
  url: BASE_URL + '/user/whoami.json'
});

