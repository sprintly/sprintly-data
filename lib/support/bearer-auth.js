import Backbone from './backbone';

export default function(token) {
  Backbone.sync.editRequest = function(req, method) {
    if (method === 'create' || method === 'update') {
      req.type('form');
    }
    req.set('Authorization', `Bearer ${token}`);
  };

  return Backbone.ajax;
}
