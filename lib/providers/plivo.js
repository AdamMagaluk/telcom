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

  /*
  { 
    api_id: 'xxxxxxxxx-1f9d-11e3-b44b-22000ac53995',
    message: 'message(s) queued',
    message_uuid: [ 'xxxxxxxx-1f9d-11e3-b1d3-123141013a24' ] 
  }
  */

  this._client.send_message(plivoMesg, function(err, ret) {
    if(err === 202){ err = undefined; }
    if(!ret) ret = {};
    callback(err,ret.message_uuid[0],ret.message,ret);
  });
};