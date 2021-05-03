module.exports = {
    url: function (user, userID, channelID, message, info, bot) {
        bot.sendMessage({
            to: channelID,
            message: 'voici l\'url du tournoi:\n' + info.url
        });
        return info
    }
}
