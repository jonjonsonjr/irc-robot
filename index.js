var irc = require('slate-irc');
var net = require('net');

module.exports = Bot;

function Bot(options) {
  if (!(this instanceof Bot)) {
    return new Bot(options);
  }
  this.name = options.name;
  this.chan = options.chan || options.channel;

  if (this.name === undefined || this.chan === undefined) {
    throw new Error("name and channel are required options");
  }

  this.pass = options.pass || options.password || 'password';
  this.realname = options.realname || 'I am a bot';
  this.server = options.server || 'irc.freenode.org';
  this.port = options.port || 6667;
  this.debug = options.debug || false;

  this.patterns = [];
  this.timers = [];
};

Bot.prototype.connect = function () {
  var stream = net.connect({
    port: this.port,
    host: this.server
  });

  this.client = irc(stream);
  this.client.use(addon(this));
  this.client.pass(this.pass);
  this.client.nick(this.name);
  this.client.user(this.name, this.realname);
  this.client.join(this.chan);
};

Bot.prototype.on = function (re, cb) {
  this.patterns.push({
    re: re,
    cb: cb,
    pub: true
  });
};

Bot.prototype.onPM = function (re, cb) {
  this.patterns.push({
    re: re,
    cb: cb,
    pub: false
  });
};

Bot.prototype.every = function (t, cb) {
  this.timers.push({
    t: t,
    cb: cb
  });
};

Bot.prototype.PM = function (to, msg) {
  this.client.send(to, msg);
};

function addon(bot) {
  return function (irc) {
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

    if (this.debug) {
      irc.on('data', function (m) {
        console.log(m);
      });
    }
  }
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
