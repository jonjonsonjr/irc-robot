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

  client.use(addon);
  client.pass(this.pass);
  client.nick(this.name);
  client.user(this.name, this.realname);
  client.join(this.chan);
};

bot.patterns = [];
bot.timers = [];

bot.on = function (re, cb) {
  this.patterns.push({
    re: re,
    cb: cb,
    pub: true
  });
};

bot.onPM = function (re, cb) {
  this.patterns.push({
    re: re,
    cb: cb,
    pub: false
  });
};

bot.every = function (t, cb) {
  this.timers.push({
    t: t,
    cb: cb
  });
};

function addon(irc) {
  irc.on('message', function (e) {
    bot.patterns.forEach(function (p) {
      var to = p.pub ? e.to : e.from;
      var m = e.message.match(p.re);
      if (m) {
        p.cb(req(e, m), res(irc, to));
      }
    });
  });
  
  bot.timers.forEach(function (timer) {
    setInterval(function () {
      timer.cb(res(irc, bot.chan));
    }, timer.t);
  });

  bot.PM = function (to, msg) {
    irc.send(to, msg);
  };
}

function req(e, m) {
  return {
    from: e.from,
    to: e.to,
    msg: e.message,
    matches: m
  };
}

function res(irc, to) {
  return {
    send: function(msg) {
      irc.send(to, msg);
    }
  };
}
