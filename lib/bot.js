var irc = require('slate-irc');
var net = require('net');

var stream = net.connect({
  port: 6667,
  host: 'irc.freenode.org'
});

var client = irc(stream);

var bot = module.exports = {};

bot.connect = function (name, pass, chan, realname) { 
  bot.name = name || 'bot';
  bot.pass = pass || 'password';
  bot.chan = chan || '';
  bot.realname = realname || 'I am a bot';

  client.use(addon());
  client.pass(this.pass);
  client.nick(this.name);
  client.user(this.name, this.realname);
  client.join(this.chan);
};

bot.patterns = [];
bot.timers = [];

bot.when = function (re, cb) {
  this.patterns.push({
    re: re,
    cb: cb
  });
};

bot.every = function (t, cb) {
  this.timers.push({
    t: t,
    cb: cb
  });
};

function addon() {
  return function (irc) {
    irc.on('data', function (msg) {
      if (msg.command == "PRIVMSG") {
        bot.patterns.forEach(function (p) {
          var m = msg.trailing.match(p.re);
          if (m) {
            p.cb(reply(irc, bot.chan), m);
          }
        });
      }
    });
    
    bot.timers.forEach(function (timer) {
      setInterval(function () {
        timer.cb(reply(irc, bot.chan));
      }, timer.t);
    });
  };
}

function reply(irc, chan) {
  return {
    send: function(msg) {
      irc.send(chan, msg);
    },
    irc: irc
  };
}
