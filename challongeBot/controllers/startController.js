var request = require('request');

module.exports = {
    start: function (user, userID, channelID, message, info, bot) {
        if (user == 'flavian' || user == 'Mouetton') {
            request.post('https://api.challonge.com/v1/tournaments/' + info.tournamentId + '/start.json', {
                json: {
                    api_key: info.challonge.key
                }
            }, function (error, httpResponse, body) {
                if (httpResponse.statusCode == 200) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'tournament is starting !'
                    });
                }
                else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Can\'t starting tournament: ' + data.errors
                    });
                }
            });
        }
        return info
    }
}