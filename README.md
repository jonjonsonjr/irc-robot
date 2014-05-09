# node-irc-bot

Small framework for writing irc bots using [node](http://nodejs.org).

```js
var bot = require('./lib/bot');
var nick = 'botname';
var pass = 'password';
var chan = '#put channel here';

bot.on(/^hi bot$/, function (req, res) {
  res.send('hello!');
});

bot.connect(nick, pass, chan);
```

## API

This is all very much a work in progress, but so far...

### bot.on(regex, cb)

When a message in the channel matches regex, the callback will be called.

The callback takes 2 arguments:

#### `request` object

* `from` - nick of user who sent message
* `to` - name of channel
* `msg` - full string of the message
* `matches` - return value of msg.match(regex)

#### `response` object

* `send` - function that sends message to channel

```js
bot.on(/^hey (\S+)$/, function (req, res) {
  res.send(req.from + ' said "hey" to ' + req.matches[1]);
});
```

### bot.onPM(regex, cb)

When a PM to the bot regex, the callback will be called.

The callback takes 2 arguments:

#### `request` object

* `from` - nick of user who sent message
* `to` - bot name
* `msg` - full string of the message
* `matches` - return value of msg.match(regex)

#### `response` object

* `send` - function that sends a PM back to the user

```js
bot.onPM(/^hey (\S+)$/, function (req, res) {
  res.send('my name is not ' + req.matches[1]);
});
```

### bot.every(interval, cb)

When a PM to the bot regex, the callback will be called.

The callback takes 1 argument:

#### `response` object

* `send` - function that sends a message to the channel

```js
bot.every(60 * 1000, function (res) {
  res.send('I will send this message every minute');
});
```

### bot.PM(recipient, message)

Sends a PM.

* `recipient` can be a string for a user or a channel

```js
bot.PM('username', 'hey');
```

### bot.connect(nick, password, channel[, realname])

Connect to the channel and start listening.

```js
bot.connect('botname', 'password', '#channel');
```
