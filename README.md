# Telcom Node.js

Node.js library for abstracting the difference between [Twilio][twilio] and [Plivo][plivo].
To start only sms is going to be supported.

## Installation

telcom is available as an npm package. Install the latest version with:

```
npm install telcom
```

## Usage

```js

var TelcomClient = require('telcom');

var client = new TelcomClient({
  provider : 'twilio',
  sid : 'ACCOUNT_SID',
  token : 'AUTH_TOKEN'
});

```



### Sending SMS

```js

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

### Handle SMS Message URL

Telcome provides a few methods for validating and normalizing the requests from
both Plivo and Twilio. These methods currently only support Express but could be 
modified slightly in the future to all other frameworks.

```js

// Add the middleware to validate request from Provider
app.use(TelcomClient.expressValidate())

// Add route with telcom.onSms handler to normalize data.
app.get('/phone/sms',TelcomClient.onSms(function(req,res,sms){

  /* sms
  {
    to : '+15557894561',
    from : '+15557894561',
    body : 'This is a text',
    _clientReques : <Object> of original request.
  }
  */

  // Handle normal logic

}));

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
