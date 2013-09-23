var extend = require('extend');
var plivo = require('plivo');
var crypto = require('crypto')
var phone = require('phone');

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


TelcomPlivoClient.prototype.validateRequest = function(req,callback){
  if(req.header('X-Plivo-Signature') === undefined)
    return callback('missing requrired header.')

  var params = req.body;
  if(req.method === 'GET'){
    params = req.query;
  }

  var toSign = req._telcomRequestUrlNoQuery;
  var expectedSignature = create_signature(toSign, params,this.options.token);
  if(req.header('X-Plivo-Signature') === expectedSignature)
    callback();
  else
    callback('signature does not match');
}

TelcomPlivoClient.prototype.sms = function(obj,callback){
  var plivoMesg = {
    src : phone(obj.from),
    dst : phone(obj.to),
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

/*
{ To: '15559633214',
  Type: 'sms',
  MessageUUID: 'xxxxxxx-2465-11e3-985d-0025907b94de',
  From: '15557894561',
  Text: 'Vg\n' }

{
  to : '', 
  from : '',
  body : '',
  messageId : '',

}


*/

TelcomPlivoClient.prototype._convertSmsRequest = function(params){
  return  {
    to : phone(params['To']),
    from : phone(params['From']),
    body : params['Text'],
    messageId : params['MessageUUID'],
    _clientRequest : params
  };
}


// For verifying the plivo server signature
//  By Jon Keating - https://github.com/mathrawka/plivo-node
function create_signature(url, params,token) {
  var toSign = url;

  Object.keys(params).sort().forEach(function(key) {
    toSign += key + params[key];
  });

  var signature = crypto
    .createHmac('sha1',token)
    .update(toSign)
    .digest('base64');

  return signature;
};
