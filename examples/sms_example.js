var TelcomClient = require('../index');
var config = require('../config');

var client = new TelcomClient({
  provider : 'twilio',
  sid : config.sid,
  token : config.token
});

client.sms({
  to : "+15551234567",
  from : '+15551234568',
  body : 'Hello from Telcom'
},function(error,ret){
  console.log(error);
});


