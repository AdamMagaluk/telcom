var extend = require('extend');
var twilio = require('twilio');
var phone = require('phone');

var TelcomTwilioClient = module.exports = function(opts){
  if (!(this instanceof TelcomTwilioClient))
    return new TelcomTwilioClient(options);

  this.options = {};
  extend(this.options,opts);
  
  this._client = twilio(this.options.sid,this.options.token);
};

TelcomTwilioClient.prototype.validateRequest = function(req,callback){
  if(req.header('x-twilio-signature') === undefined)
    return callback('missing requrired header.')

  var params = req.body || {};
  if(twilio.validateRequest(this.options.token,req.header('x-twilio-signature'),req._telcomRequestUrl,params))
    callback();
  else
    callback('signature does not match');
}

/*
  { 
    Body: 'Vg',  
    To: '+15557897894',
    ToZip: '48367',
    ToCity: 'OXFORD',
    ToState: 'MI',
    ToCountry: 'US',

    From: '+15556394878',
    FromZip: '48340' }
    FromCity: 'PONTIAC',
    FromState: 'MI',
    FromCountry: 'US',
    
    AccountSid: 'XXXXXXXXXXXXXXXXXXXXXXXX',
    SmsSid: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    SmsMessageSid: 'XXXXXXXXXXXXXXXXXXXXXXXXXx',
    MessageSid: 'XXXXXXXXXXXXXXXXXX',

    ApiVersion: '2010-04-01',
    SmsStatus: 'received',
    NumMedia: '0',
  }

  {
    to : '',
    from : '',
    body : '',
    messageId : '',
  }
*/
TelcomTwilioClient.prototype._convertSmsRequest = function(params){
  return  {
    to : phone(params['To']),
    from : phone(params['From']),
    body : params['Body'],
    messageId : params['SmsSid'],
    _clientRequest : params
  };
}

TelcomTwilioClient.prototype.sms = function(obj,callback){
  var twilioObj = obj;
  /*
  { sid: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXc',
  date_created: 'Tue, 17 Sep 2013 13:37:32 +0000',
  date_updated: 'Tue, 17 Sep 2013 13:37:32 +0000',
  date_sent: null,
  account_sid: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  to: '+XXXXXXXXXXXX',
  from: '+xXXXXXXXXXXX',
  body: 'Hello from Telcom twilio',
  status: 'queued',
  direction: 'outbound-api',
  api_version: '2010-04-01',
  price: null,
  price_unit: 'USD',
  uri: '/2010-04-01/Accounts/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/SMS/Messages/SMcdbb18c85b9cd473594099744fb9feec.json',
  dateCreated: Tue Sep 17 2013 09:37:32 GMT-0400 (EDT),
  dateUpdated: Tue Sep 17 2013 09:37:32 GMT-0400 (EDT),
  dateSent: null,
  accountSid: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  apiVersion: '2010-04-01',
  priceUnit: 'USD',
 */

  this._client.sms.messages.create(twilioObj, function(err, ret) {
    if(!ret) ret = {};
    callback(err,ret.sid,ret.status,ret);
  });
};