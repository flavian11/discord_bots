var request = require('request');

module.exports = {
    del: function (user, userID, channelID, message, info, bot) {
        if (user == 'flavian' || user == 'Mouetton') {
            request.delete('https://api.challonge.com/v1/tournaments/' + info.tournamentId + '.json', {
                json: {
                    api_key: info.challonge.key
                }
            }, function (error, httpResponse, body) {
                if (httpResponse.statusCode != 200) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'failed to delete tournament:\n' + data.errors
                    });
                }
                else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'tournament deleted'
                    });
                }
            });
        }
        else {
            bot.sendMessage({
                to: channelID,
                message: 'sorry you don\'t have right access to delete a tournament'
            });
        }
        return info
    }
}