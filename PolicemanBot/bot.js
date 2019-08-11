const { Client } = require('discord.js');

const fs = require('fs');
const readline = require('readline');

var auth = require('./myauth.json');

const client = new Client();

client.login(auth.token);

client.on('ready', () => {
  console.log('Bot ready!');
});

client.on('message', message => {

  checkInjure(message.content).then(function () {
  }).catch(function (e) {
    message.delete()
    message.member.send('On dit pas de gros mot dans les dechets de la societe ! Tu te crois où ?')
    message.member.kick('injure').then(() => {
      message.reply('a ete banni pour injure')
    }).catch(e => {
      console.log(e)
    });
  })
});

function checkInjure(message) {
  return new Promise(async function (resolve, reject) {
    const fileStream = fs.createReadStream('injure.txt');

    const rl = readline.createInterface({
      input: fileStream,
    });


    for await (const line of rl) {
      if (message.toLowerCase().includes(line)) {
        reject()
      }
    }
    resolve()
  })
}
