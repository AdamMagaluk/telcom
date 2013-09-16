var extend = require('extend');
var plivo = require('plivo');

var TelcomPlivoClient = module.exports = function(opts){
  if (!(this instanceof TelcomPlivoClient))
    return new TelcomPlivoClient(options);

  this.options = {};
  extend(this.options,opts);
  
  this._client = plivo.RestAPI({
    authId: this.options.sid,
    authToken: this.options.token
  });
};

TelcomPlivoClient.prototype.sms = function(obj,callback){
  var plivoMesg = {
    src : obj.from,
    dst : obj.to,
    text : obj.body
  };

  this._client.send_message(plivoMesg, function(err, message) {
    callback(err,message);
  });
};