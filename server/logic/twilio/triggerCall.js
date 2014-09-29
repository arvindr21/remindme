var client = require('./client');

var call = {
  triggerCall: function(reminder) {
    return client.makeCall({
      to: reminder.user.phone,
      from: '+16165225251',
      url: 'http://20585314.ngrok.com/call/twiml/' + reminder.user._id + '/' + reminder._id
    }, function(error, response) {
      console.log(error || response);
    });
  }
}

module.exports = call;
