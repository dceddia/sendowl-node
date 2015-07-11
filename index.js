var request = require('request');
var crypto = require('crypto');
var util = require('util');
var _ = require('underscore');
_.mixin(require('underscore.string'));

var SendOwl = exports.SendOwl = function (opts) {
  opts = opts || {};
  this.products = new Products(opts);
  this.packages = new Packages(opts);
  this.subscriptions = new Subscriptions(opts);
  this.orders = new Orders(opts);
  this.discountCodes = new DiscountCodes(opts);
};

var Resource = function (opts) {
  this.host = opts.host;
  this.key = opts.key;
  this.secret = opts.secret;
  this.uri = 'https://' + this.key + ':' + this.secret + '@' + this.host;
};

Resource.prototype.request = function (method, uri, path, data, cb) {
  if (typeof path === 'function') {
    cb = path;
    data = {};
    path = null;
  }
  if (typeof data === 'function') {
    cb = data;
    data = {};
  }
  if (data.id) {
    path += '/' + data.id;
    delete data.id;
  }
  if (path) {
    uri += '/' + path;
  }
  var opts = {
    method: method,
    uri: uri,
    body: data,
    json: true
  };
  request(opts, function (err, req, body) {
    cb(err, body);
  });
};

var Products = function (opts) {
  Resource.call(this, opts);
  var uri = this.uri + '/api/v1/products';

  this.get = _.partial(this.request, 'GET', uri);
  this.create = _.partial(this.request, 'POST', uri);
  this.update = _.partial(this.request, 'PUT', uri);
  this.delete = _.partial(this.request, 'DELETE', uri);
  this.issue = _.partial(this.request, 'POST', uri, 'issue');
  this.licenses = _.partial(this.request, 'GET', uri, 'licenses');
  this.checkValidLicenses = _.partial(this.request, 'GET', uri,
      'licenses/check_valid?key=' + this.key);

  return this;
};
util.inherits(Products, Resource);

var Packages = function (opts) {
  Resource.call(this, opts);
  var uri = this.uri + '/api/v1/packages';

  this.get = _.partial(this.request, 'GET', uri);
  this.create = _.partial(this.request, 'POST', uri);
  this.update = _.partial(this.request, 'PUT', uri);
  this.delete = _.partial(this.request, 'DELETE', uri);
  this.issue = _.partial(this.request, 'POST', uri, 'issue');

  return this;
};
util.inherits(Packages, Resource);

var Subscriptions = function (opts) {
  Resource.call(this, opts);
  var uri = this.uri + '/api/v1/subscriptions';

  this.get = _.partial(this.request, 'GET', uri);
  this.create = _.partial(this.request, 'POST', uri);
  this.update = _.partial(this.request, 'PUT', uri);
  this.delete = _.partial(this.request, 'DELETE', uri);

  return this;
};
util.inherits(Subscriptions, Resource);

var Orders = function (opts) {
  Resource.call(this, opts);
  var uri = this.uri + '/api/v1/orders';

  this.get = _.partial(this.request, 'GET', uri);
  this.search = _.bind(function (email, cb) {
    this.request('GET', uri, 'search?term=' + email, cb);
  }, this);
  this.create = _.partial(this.request, 'POST', uri);
  this.update = _.partial(this.request, 'PUT', uri);
  this.licenses = _.partial(this.request, 'GET', uri, 'licenses');

  return this;
};
util.inherits(Orders, Resource);

var DiscountCodes = function (opts) {
  Resource.call(this, opts);
  var uri = this.uri + '/api/v1/discount_codes';

  this.get = _.partial(this.request, 'GET', uri);
  this.create = _.partial(this.request, 'POST', uri);
  this.update = _.partial(this.request, 'PUT', uri);
  this.delete = _.partial(this.request, 'DELETE', uri);

  return this;
};
util.inherits(DiscountCodes, Resource);
