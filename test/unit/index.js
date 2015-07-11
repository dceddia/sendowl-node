process.env.NODE_ENV = 'TEST';

var config = require('config');
var assert = require('assert');
var _ = require('underscore');
var SendOwl = require(__dirname + '/../../index').SendOwl;

describe('SendOwl', function () {
  this.timeout(10000);

  it('should initialize object', function () {
    var sendowl_ = new SendOwl();
    assert.ok(sendowl_);
  });

  var sendowl_ = new SendOwl({
    host: config.get('host'),
    key: config.get('key'),
    secret: config.get('secret')
  });

  describe('#products', function () {

    describe('#products#get', function () {
      it('should list products', function (done) {
        sendowl_.products.get(function (err, data) {
          assert.ifError(err);
          assert.ok(data);
          done();
        });
      });
    });

  });

});
