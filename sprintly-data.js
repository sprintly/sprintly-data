import User from './lib/user';
import Backbone from './lib/support/backbone';
import Products from './lib/products';
import collectionConsumer from './lib/page_consumer';
import basicAuth from './lib/support/basic-auth';
import bearerAuth from './lib/support/bearer-auth';
import { VERSION } from './package.json';

function Client(email, apiKey) {
  if (email && typeof email !== 'string' && email.token) {
    Backbone.ajax = bearerAuth(email.token);
  } else {
    Backbone.ajax = basicAuth(email, apiKey);
  }

  this.products = new Products();
  this.user = new User();
}

export var createClient = function(email, apiKey) {
  return new Client(email, apiKey);
};

export {VERSION, Client, collectionConsumer};
