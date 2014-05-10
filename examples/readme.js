var ircbot = require('..');

var bot = ircbot({
  name: 'botname',
  pass: 'password',
  chan: '#channelname',
  debug: true
});

bot.on(/^hi bot$/, function (req, res) {
  res.send('hello!');
  bot.PM(req.from, 'hello in a PM!');
});

bot.on(/^hey (\S+)$/, function (req, res) {
  res.send(req.from + ' said "hey" to ' + req.matches[1]);
});

bot.onPM(/^hey (\S+)$/, function (req, res) {
  res.send('my name is not ' + req.matches[1]);
});

bot.every(60 * 1000, function (res) {
  res.send('I will send this message every minute');
});

bot.connect();
