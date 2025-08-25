const { Player, useQueue } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei')
const axios = require('axios');
const regh = require('./registro.js');
const discord = require('discord.js');
const { 
  RockPaperScissors, 
  selectRandomItem, 
  replyItems, 
  Personagens, 
  createEmbed, 
  handleCommandError,
  checkCooldown 
} = require('./varsFunctions.js');
const dotenv = require('dotenv');
const login = process.env.TOKEN, apiKey = process.env.API_YOUTUBE;
let volume1 = 100;
dotenv.config();

//Import Comandos

// Music Commands
const clearCommand = require('./comandos/clear.js');
const loopCommand = require('./comandos/loop.js');
const nowplayingCommand = require('./comandos/nowplaying.js');
const pauseCommand = require('./comandos/pause.js');
const playCommand = require('./comandos/play.js');
const queueCommand = require('./comandos/queue.js');
const resumeCommand = require('./comandos/resume.js');
const shuffleCommand = require('./comandos/shuffle.js');
const skipCommand = require('./comandos/skip.js');
const stopCommand = require('./comandos/stop.js');
const volumeCommand = require('./comandos/volume.js');

// Utility Commands
const inviteCommand = require('./comandos/invite.js');
const pingCommand = require('./comandos/ping.js');
const characterCommand = require('./comandos/character.js');

// Game Commands
const rpsCommand = require('./comandos/rps.js');
const eightBallCommand = require('./comandos/8ball.js');
const diceCommand = require('./comandos/dice.js');
const triviaCommand = require('./comandos/trivia.js');
const guessCommand = require('./comandos/guess.js');

// Meme Commands
const memeCommand = require('./comandos/meme.js');
const jokeCommand = require('./comandos/joke.js');

const commands = new Map();

// Music Commands
commands.set(clearCommand.name, clearCommand);
commands.set(loopCommand.name, loopCommand);
commands.set(nowplayingCommand.name, nowplayingCommand);
commands.set(pauseCommand.name, pauseCommand);
commands.set(playCommand.name, playCommand);
commands.set(queueCommand.name, queueCommand);
commands.set(resumeCommand.name, resumeCommand);
commands.set(shuffleCommand.name, shuffleCommand);
commands.set(skipCommand.name, skipCommand);
commands.set(stopCommand.name, stopCommand);
commands.set(volumeCommand.name, volumeCommand);

// Utility Commands
commands.set(inviteCommand.name, inviteCommand);
commands.set(pingCommand.name, pingCommand);
commands.set(characterCommand.name, characterCommand);

// Game Commands
commands.set(rpsCommand.name, rpsCommand);
commands.set(eightBallCommand.name, eightBallCommand);
commands.set(diceCommand.name, diceCommand);
commands.set(triviaCommand.name, triviaCommand);
commands.set(guessCommand.name, guessCommand);

// Meme Commands
commands.set(memeCommand.name, memeCommand);
commands.set(jokeCommand.name, jokeCommand);

////// Functions //////

function checkVoiceChannel(interaction) {

  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {

    return false;

  }

  return true;
}

function checkQueue(interaction) {

  const queue = useQueue(interaction.guild);

  if (!queue) {

    return false;

  }

  return queue;
}

async function adminReload() {

  let servers = [];

  await client.guilds.cache.forEach(guild => {
    servers.push(guild.id);
  });


  regh(servers);

}

///////////////////////

const client = new discord.Client({
  intents: [
    Object.values(discord.GatewayIntentBits),
    discord.IntentsBitField.Flags.Guilds,
    discord.IntentsBitField.Flags.GuildMembers,
    discord.IntentsBitField.Flags.GuildMessages,
    discord.IntentsBitField.Flags.MessageContent,
    discord.IntentsBitField.Flags.GuildVoiceStates,

  ],
  Partials: [
    discord.Partials.message,
    discord.Partials.channel,
    discord.Partials.Reaction
  ],
});

const player = new Player(client);

player.extractors.register(YoutubeiExtractor).then(() => {
  console.log('Extractor Youtubei Carregado');
}).catch((e) => console.log('Erro ao carregar YoutubeiExtractor:', e));

player.events.on('playerStart', (queue, track) => {

  console.log(track.title)

});

player.events.on('audioTrackAdd', async (queue, track) => {
  const channelName = track.author;
  let volume = queue.node.volume;

  const searchResponse = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(channelName)}&type=channel&key=${apiKey}`
  );

  const channelId = await searchResponse.data.items[0].id.channelId;

  const channelResponse = await axios.get(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`
  );

  const img = channelResponse.data.items[0].snippet.thumbnails.default.url;

  let embed = createEmbed('#dbffff', track.title, `**${track.title}** foi adicionado à fila!`, 'https://drive.google.com/u/1/drive-viewer/AKGpihYNrCFSd2oVwo2JYD5WeF4AYEDIMTfhMCujWYu7udq2Q0vkmeaUPN1NGEbHDYPVZ0tbqkxtfCSXn0KPtjnALQgETgxfpUk4BQ=s2560', track.thumbnail);
  embed.addFields(
    { name: 'Duração', value: track.duration, inline: true },
    { name: 'Volume', value: `${volume}%`, inline: true },
    { name: 'URL', value: track.url }
  )
    .setTimestamp()
    .setFooter({ text: track.author, iconURL: img });

  queue.metadata.channel.send({ embeds: [embed] });

});

player.events.on('audioTracksAdd', (queue, track) => {

  let embed = new discord.EmbedBuilder()
    .setTitle(`Adicionando à **Playlist** algumas faixas`)
    .setColor('#dbffff')

  queue.metadata.channel.send({ embeds: [embed] })
});

player.events.on('playerSkip', (queue, track) => {
  console.log('skip: ' + track.title)
});

player.events.on('disconnect', (queue, track) => {

  let embed = new discord.EmbedBuilder()
    .setColor('#fff4ce')
    .setTitle('Saindo por agora, bye bye (～￣▽￣)～')

  queue.metadata.channel.send({ embeds: [embed] })
});

player.events.on('emptyChannel', (queue, track) => {

  queue.metadata.channel.send(`Me abandonaram aqui, sacanagem viu >:(`)
});

player.events.on('emptyQueue', (queue, track) => {


  let embed = new discord.EmbedBuilder()
    .setColor('#d9878d')
    .setTitle('Moço ( •̀ ω •́ )✧, cabou as músicas!')


  queue.metadata.channel.send({ embeds: [embed] })
});

player.events.on('error', (queue, error) => {
  // Emitted when the player queue encounters error
  console.log(`General player error event: ${error.message}`);
  console.log(error);
});

player.events.on('playerError', (queue, error) => {
  // Emitted when the audio player errors while streaming audio track
  console.log(`Player error event: ${error.message}`);
  console.log(error);
});


client.on('ready', (c) => {
  console.log(`Logged in as ${c.user.tag}!`);

  adminReload()

});


client.on('interactionCreate', async (interaction) => {

  if (!interaction.isChatInputCommand()) return;
  if (!interaction.isCommand()) return;

  const commandName = interaction.commandName;
  const command = commands.get(commandName);

  if (!command) {
    console.log(`Comando não encontrado: ${commandName}`);
    return;
  }

  try {
    switch (commandName) {
      // Music Commands
      case 'play':
        await command.execute(interaction, player, checkVoiceChannel, createEmbed, volume1);
        break;
      
      case 'skip':
      case 'queue':
      case 'stop':
      case 'pause':
      case 'resume':
      case 'shuffle':
      case 'nowplaying':
      case 'loop':
        await command.execute(interaction, checkVoiceChannel, checkQueue, createEmbed);
        break;
      
      case 'clear':
        await command.execute(interaction, checkQueue, checkVoiceChannel, createEmbed);
        break;
      
      case 'volume':
        const novoVolume = await command.execute(interaction, checkQueue, createEmbed);
        if (typeof novoVolume === 'number') {
          volume1 = novoVolume;
        }
        break;
      
      // Utility Commands
      case 'invite':
      case 'ping':
      case 'character':
      case 'rps':
      case '8ball':
      case 'dice':
      case 'trivia':
      case 'meme':
      case 'joke':
        await command.execute(interaction);
        break;
      
      case 'guess':
        const guessNumber = interaction.options.getInteger('numero');
        if (guessNumber !== null) {
          await command.handleGuess(interaction, guessNumber);
        } else {
          await command.execute(interaction);
        }
        break;
      
      default:
        console.log(`Comando não implementado: ${commandName}`);
        break;
    }
  } catch (error) {
    handleCommandError(interaction, error, commandName);
  }
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  
  const conteudo = message.content;
  const adminId = '680480327616954370';
  
  if (conteudo === 'adminReload') {
    if (message.author.id !== adminId) {
      message.reply({ content: `${message.author}, você não tem permissão para realizar um reload!` });
    } else {
      message.reply({ content: `Bem vindo ${message.author}! Iniciando Reload: Application **RESET** for **ALL SERVERS**\nReload solicitado em ${message.channel}, ${message.guild}` });
      adminReload();
    }
  }
})

client.login(login);