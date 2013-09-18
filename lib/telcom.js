var extend = require('extend');
var fs = require('fs');

var providers = {};

// Load all providers
fs.readdirSync(__dirname + '/providers').forEach(function(file) {
  if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');
    providers[name] = require(__dirname + '/providers/' + file);
  }
});


function validateProvider(provider){
  var reqFuncs = ['sms'];
  for(var i=0;i<reqFuncs.length;i++){
    if(typeof provider[reqFuncs[i]] !== 'function'){
      throw new Error("Provider missing required method " + reqFuncs[i]);
    }
  }
  return true;
}

var TelcomClient = module.exports = function(opts){
  if (!(this instanceof TelcomClient))
    return new TelcomClient(options);

  this.options = {
    provider : null, // Must specify provider type
    sid : null,
    token : null,
  };

  extend(this.options,opts);

  if(!this.options.provider){
    throw new Error("Provider must be supplied.");
  }

  if(!providers[this.options.provider]){
    throw new Error("Provider not recognized.");
  }

  this._provider = new providers[this.options.provider](this.options);

  // validate provider
  validateProvider(this._provider);

};

/**
 * Telcom Client to send sms message through provider.

    obj
      - to   - Required frome to number
      - from - Required frome phone number
      - body - Required body
      - callbackUrl - Optional callback url

    callback(err,resp)
 *
 */
TelcomClient.prototype.sms = function(obj,callback){
  if(!obj){
    throw new Error("Must provide sms message object.");
  }
  if(!callback || typeof callback !== 'function'){
    throw new Error("Callback must be a function.");
  }

  if(!obj.to || typeof obj.to !== 'string'){
    throw new Error("Required obj.to field must be a string.");
  }
  if(!obj.from || typeof obj.from !== 'string'){
    throw new Error("Required obj.from field must be a string.");
  }
  if(!obj.body || typeof obj.body !== 'string'){
    throw new Error("Required obj.body field must be a string.");
  }

  return this._provider.sms(obj,function telcomSmsCB(err,messageId,status,clientResponce){
    callback(err,{
      messageId : messageId,
      status : status,
      _clientResponce : clientResponce
    });
  });
};
