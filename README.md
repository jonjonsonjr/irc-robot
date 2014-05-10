# irc-robot
[![NPM version](https://badge.fury.io/js/irc-robot.svg)](http://badge.fury.io/js/irc-robot)

Small framework for writing irc bots using [node](http://nodejs.org).

```js
var ircbot = require('irc-robot');

var bot = ircbot({
  name: 'botname',
  pass: 'password',
  chan: '#channelname'
});

bot.on(/^hi bot$/, function (req, res) {
  res.send('hello!');
});

bot.connect();
```

## API

This is all very much a work in progress, but so far...

### ircbot(options)

Creates a new bot.

```js
var ircbot = require('irc-robot');
var bot = ircbot({
  name: 'botname',
  chan: '#channelname'
});
```

#### Options

##### Required

* `name`
* `chan` || `channel`

##### Optional

* `password` (default: `"password"`)
* `realname` (default: `"I am a bot"`)
* `server` (default: `"irc.freenode.org"`)
* `port` (default: `6667`)
* `debug` (default: `false`)

### bot.on(regex, cb)

Calls the callback when a message in the channel matches the regex.

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

Calls the callback tif a PM to the bot matches the regex.

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

Calls the callback every `interval` milliseconds.

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

### bot.connect()

Connects to the channel and starts listening.
