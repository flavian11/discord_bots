var request = require('request');

module.exports = {
    create: function (user, userID, channelID, message, info, bot) {
        if (user == 'flavian' || user == 'Mouetton') {
            request.post('https://api.challonge.com/v1/tournaments.json', {
                json: {
                    api_key: info.challonge.key,
                    tournament: {
                        name: info.name,
                        url: "lesdechetsdesmashplusdublablapourpasquelurlsoisdejapris",
                        tournament_type: 'double elimination',
                        description: 'simple double elimination tournament',
                        open_signup: false,
                        show_rounds: true,
                        private: true
                    }
                }
            }, function (error, httpResponse, body) {
                let data = body;
                channelId = channelID;

                if (httpResponse.statusCode != 200) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'failed to create tournament:\n' + data.errors
                    });
                }
                else {
                    info.tournamentId = data.tournament.id;
                    info.url = data.tournament.full_challonge_url;
                    bot.sendMessage({
                        to: channelID,
                        message: 'voici l\'url du tournoi:\n' + info.url
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
        return info
    }
}