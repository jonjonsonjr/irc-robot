var bot = require('./lib/bot');

// reply with hi
bot.on(/hi/, function (req, res) {
  res.send('hi');
});

// set a timer
bot.every(60000, function (res) {
  res.send('this will happen every 60 seconds');
});

var nick = 'put nick here';
var pass = 'put password here';
var chan = '#put channel here';

bot.connect(nick, pass, chan);
