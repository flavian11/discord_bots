//you need to execute npm install winston woor/discord.io#gateway_v6 --save
var Discord	= require('discord.io');
var logger	= require('winston');
//place your bot's token in ./myauth.json
var auth	= require('./myauth.json');
//place your steam api key in ./steamKey.json
var steamkey	= require('./steamKey.json');
var request	= require('request');

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

bot.on('message', function(user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
	//usage
	if (message == '!help') {
	    bot.sendMessage({
		to: channelID,
		message: 'Help:\n!csgo [steam_user_id]\nsteam_user_id = the steam id of the user you want the stats.'
	    });
	}
	var args = message.substring(1).split(' ');
	if (args[0] == 'csgo') {
	    //appid 730 = csgo id
	    var url = 'http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=' + steamkey.key + '&steamid=' + args[1];
	    
	    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
		var data = JSON.parse(steamHttpBody);
		var kills = data.playerstats.stats[0].value;
		var deaths = data.playerstats.stats[1].value;
		var ratio = kills / deaths;
		var hsRatio = data.playerstats.stats[25].value / kills * 100;
		
		bot.sendMessage({
		    to: channelID,
		    message: 'total kills : ' + kills + '\ntotal deaths : ' + deaths + '\nratio : ' + ratio.toPrecision(4) + '\npercentage of heashot : ' + hsRatio.toPrecision(4) + '%'
		});
	    });
	}
    }
});
