const discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();


const client = new discord.Client({
  intents: Object.values(discord.GatewayIntentBits),
  Partials: [
      discord.Partials.message,
      discord.Partials.channel,
      discord.Partials.Reaction
  ],
});
client.login(process.env.TOKEN);

client.on('message', message => {
  if (message.content.startWith('!ping')) {
    message.channel.send('Para com essa Piada ai pô');
  }
});
