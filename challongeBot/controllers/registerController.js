var request = require('request');

module.exports = {
    register: function (user, userID, channelID, message, info, bot) {
        request.post('https://api.challonge.com/v1/tournaments/' + info.tournamentId + '/participants.json', {
            json: {
                api_key: info.challonge.key,
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
        return info
    }
}