var ircbot = require('./lib/bot');

var bot = ircbot({
  name: 'botname',
  pass: 'password',
  chan: '#channelname'
});

// Say 'Hi!' if someone says 'hi'
bot.on(/\b[Hh]i\b/, function (req, res) {
  res.send('Hi!');
});

// Say 'I am a bot!' every 60 seconds
bot.every(60 * 000, function (res) {
  res.send('I am a bot!');
});

bot.connect();
