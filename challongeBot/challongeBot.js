var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./myauth.json');
var challonge = require('./challongeKey.json');

var create = require('./controllers/createController')
var del = require('./controllers/deleteController')
var register = require('./controllers/registerController')
var start = require('./controllers/startController')
var url = require('./controllers/urlController')

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

info = {
    url: "lesdechetsdesmashplusdublablapourpasquelurlsoisdejapris",
    tournamentId: 0,
    challonge: challonge,
    name: 'les dechets de smash'
}

constrollers = {
    "!create": create.create,
    "!delete": del.del,
    "!register": register.register,
    "!start": start.start,
    "!url": url.url
}

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        info = constrollers[message](user, userID, channelID, message, info, bot)
    }
});