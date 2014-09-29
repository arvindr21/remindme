var db = require('../../db/db.reminder');
var client = require('./client');
var twilio = require('twilio');

var twl = {
  getTwiml: function(userid, reminderid) {

    // we are going to use userid for authorization, if needed. 

    var rem = db.getOne(reminderid);
    var twiml = new twilio.TwimlResponse();

    
    var options = {
      voice: 'woman',
      language: 'en-us'
    };
    if (rem) {
      twiml.say('This is a reminder for : ', options)
        .pause({
          length: 1
        })
        .say(rem.remindThis)
        .pause({
          length: 1
        }).say('Thank you for using our service.', options);
    } else {
      twiml.say('Oops something went wrong!', options);
    }

    return twiml.toString();
  }
}

module.exports = twl;
