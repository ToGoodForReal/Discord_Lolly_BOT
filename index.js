const discord = require('discord.js');
const client = new discord.Client();
const dotenv = require('dotenv');
dotenv.config();

client.on('ready', () => {
  console.log('Bot is ready');
});

client.on('message', message => {
  if (message.content.startWith('!ping')) {
    message.channel.send('Para com essa Piada ai pô');
  }
});
client.login(process.env.TOKEN);