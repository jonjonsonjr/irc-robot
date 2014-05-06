var bot = require('./lib/bot');

// reply with a greeting or say 'wat'
bot.when(/^boten:\s*(hi|hello|hey)?/, function (res, m) {
  if (m[1]) {
    res.send(m[1]);
  } else {
    res.send('wat');
  }
});

// set a timer
bot.every(60000, function (res) {
  res.send('this will happen every 60 seconds');
});

var nick = 'put nick here';
var pass = 'put password here';
var chan = '#put channel here';

bot.connect(nick, pass, chan);
