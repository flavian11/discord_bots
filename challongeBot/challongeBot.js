var Discord = require('discord.io');
var logger = require('winston');
//place your bot's token in ./myauth.json
var auth = require('./myauth.json');
var steamkey = require('../csgoStat/steamKey.json')
var challonge = require('./challongeKey.json');
var request = require('request');


logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        if (message == '!create') {
            request.post('https://api.challonge.com/v1/tournaments.json', {
                json: {
                    api_key: challonge.key,
                    tournament: {
                        name: 'les dechets de smash',
                        url: 'smashdechetetonvamettredublablapourpasqueleliensoisdejapris',
                        tournament_type: 'double elimination',
                        description: 'simple double elimination tournament',
                        open_signup: false,
                        show_rounds: true,
                        private: true
                    }
                }
            }, function (error, httpResponse, body) {
                let data = body;

                bot.sendMessage({
                    to: channelID,
                    message: 'voici le bracket du tournoi:\n' + data.tournament.full_challonge_url
                });
            });
        }
    }
});