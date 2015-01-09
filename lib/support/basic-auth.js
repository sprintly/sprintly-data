import Backbone from './backbone';

export default function(email, apiKey) {

  Backbone.sync.editRequest = function(req, method) {
    if (method === 'create' || method === 'update') {
      req.type('form');
    }
    req.auth(email, apiKey);
  };

  return Backbone.ajax;
}
