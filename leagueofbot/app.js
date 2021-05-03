const { Client, RichEmbed } = require("discord.js");

var request = require("request");

const auth = require("./myauth.json");
const key = require("./key.json");
const champs = require('./champs.json')

const client = new Client();

const prefixeUrl = "https://euw1.api.riotgames.com";

var image

client.login(auth.token);

client.on("ready", () => {
  console.log("Bot ready!");
});

client.on("message", message => {
  if (message.content.split(" ")[0] == "!ranked") {
    const args = message.content.split(" ");
    const options = {
      url: prefixeUrl + "/lol/summoner/v4/summoners/by-name/" + args[1],
      headers: {
        "X-Riot-Token": key.key
      }
    };

    //get summoner profil
    request.get(options, function(error, httpResponse, body) {
      const data = JSON.parse(body);
      const id = data.id;
      options.url =
        prefixeUrl + "/lol/spectator/v4/active-games/by-summoner/" + id;

      //get current game with the encrypted summonerId
      request.get(options, function(error, httpResponse, body) {
        let data = JSON.parse(body);
        if (httpResponse.statusCode != 200) {
          console.error("error getting current game");
          console.error("status code != 200 -> " + httpResponse.statusCode);
          console.error(body);
          return;
        }
        data.participants.forEach(element => {
          //get champion info
          Object.keys(champs.data).forEach((key, index) => {
            if (champs.data[key].key == element.championId) {
                image = 'attachment://' + champs.data[key].id + '.png'
            }
          })
          console.log('image: ' + image)

          //get the ranks of the player
          options.url =
            prefixeUrl +
            "/lol/league/v4/entries/by-summoner/" +
            element.summonerId;
          request.get(options, function(error, httpResponse, body) {
            let data = JSON.parse(body);
            if (httpResponse.statusCode != 200) {
              console.error("error getting payer rank:");
              console.error("status code != 200 -> " + httpResponse.statusCode);
              console.error(body);
              return;
            }
            data.forEach(element => {
              if (element.queueType === "RANKED_SOLO_5x5") {
                const embed = new RichEmbed()
                  .setTitle(element.summonerName)
                  .setColor(0xff0000)
                  .setDescription(element.tier + " " + element.rank)
                  .setImage(image);
                message.channel.send(embed);
              }
            });
          });
        });
      });
    });
  }
  if (message.content.includes("!help")) {
    message.channel.send("Usage:\n\t!ranked <summoner name>");
  }
});
