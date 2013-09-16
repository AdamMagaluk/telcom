# Telcom Node.js

Node.js library for abstracting the difference between [Twilio][twilio] and [Plivo][plivo].
To start only sms is going to be supported.

## Installation

telcom is available as an npm package. Install the latest version with:

```
npm install telcom
```

## Usage

```
var TelcomClient = require('telcom');

var clientTwilio = new TelcomClient({
  provider : 'twilio',
  sid : 'ACCOUNT_SID',
  token : 'AUTH_TOKEN'
});

client.sms({
  to : "+15551234567",
  from : '+15551234568',
  body : 'Hello from Telcom'
},function(error,ret){
  if(error){
    console.log("Failed to send message")
  }else{
    console.log("Message Sent")
  }
});

```

### Current Providers

- Twilio - twilio
- Plivo - plivo

## License

telcom is licensed under the MIT License.

## References

- [Twilio Node Library](https://github.com/twilio/twilio-node)
- [Twilio API Documentationn](https://www.twilio.com/docs/api/rest/)
- [Plivo Node Library](https://github.com/plivo/plivo-node)
- [Plivo API Documentationn](http://plivo.com/docs/api)


[twilio]: http://twilio.com/
[plivo]: http://plivo.com/