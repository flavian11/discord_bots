const schedule = require('node-schedule')
var request = require('request');

const { Client, RichEmbed } = require('discord.js');

var auth = require('./myauth.json');

const client = new Client();

client.login(auth.token);

client.on('ready', () => {
  console.log('Bot ready!');
});
var rule = new schedule.RecurrenceRule();
rule.hour = 11;
rule.minute = 20;

schedule.scheduleJob(rule, () => {
  var id = Math.floor(Math.random() * (500 - 1 + 1) + 1)
  request.get('https://pokeapi.co//api/v2/pokemon/' + id + '/', {}, function (error, httpResponse, body) {
    if (httpResponse.statusCode == 200) {
    const channel = client.channels.find('name', 'pokemon')
    let data = JSON.parse(body);
    console.log(data.name)
    const embed = new RichEmbed()
      .setTitle(data.name)
      .setColor(0xFF0000)
      .setDescription('base experience: ' + data.base_experience
      + '\nheight: ' + data.height + '\nweight: ' + data.weight + '\norder: ' + data.order);
      channel.send(embed)
    }
    else {
      console.log(error)
    }
  })
})