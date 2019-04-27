var Discord = require('discord.io');
var logger = require('winston');
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

var tournamentId;

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        if (message == '!create') {
            if (user == 'flavian' || user == 'Mouetton') {
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

                    if (httpResponse.statusCode != 200) {
                        bot.sendMessage({
                            to: channelID,
                            message: 'failed to create tournament:\n' + data.errors
                        });
                    }
                    else {
                        tournamentId = data.tournament.id;
                        bot.sendMessage({
                            to: channelID,
                            message: 'voici l\'url du tournoi:\n' + data.tournament.full_challonge_url
                        });
                    }
                });
            }
            else {
                bot.sendMessage({
                    to: channelID,
                    message: 'sorry you don\'t have right access to create a tournament'
                });
            }
        }
        else if (message == '!delete') {
            if (user == 'flavian' || user == 'Mouetton') {
                request.delete('https://api.challonge.com/v1/tournaments/' + tournamentId + '.json', {
                    json: {
                        api_key: challonge.key
                    }
                }, function (error, httpResponse, body) {
                });
            }
        }
        else if (message == '!register') {
            request.post('https://api.challonge.com/v1/tournaments/' + tournamentId + '/participants.json', {
                json: {
                    api_key: challonge.key,
                    participant: {
                        name: user
                    }
                }
            }, function (error, httpResponse, body) {
                let data = body;
                if (httpResponse.statusCode == 200) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'user ' + user + ' is registered'
                    });
                }
                else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'user ' + user + ' cannot be registered\n' + data.errors
                    });
                }
            });
        }
    }
});