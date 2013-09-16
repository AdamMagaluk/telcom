var extend = require('extend');
var twilio = require('twilio');

var TelcomTwilioClient = module.exports = function(opts){
  if (!(this instanceof TelcomTwilioClient))
    return new TelcomTwilioClient(options);

  this.options = {};
  extend(this.options,opts);
  
  this._client = twilio(this.options.sid,this.options.token);
};

TelcomTwilioClient.prototype.sms = function(obj,callback){
  var twilioObj = obj;
  this._client.sms.messages.create(twilioObj, function(err, message) {
    callback(err,message);
  });
};