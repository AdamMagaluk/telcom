var TelcomClient = require('../index');
var config = require('../config');

var client = new TelcomClient({
  provider : config.provider,
  sid : config.sid,
  token : config.token
});

client.sms({
  to : "+15551230885",
  from : '+15551235659',
  body : 'Hello from Telcom ' + config.provider
},function(err,ret){
  if(err){
    console.error("failed to send message");
  }
  console.log(ret);
});
