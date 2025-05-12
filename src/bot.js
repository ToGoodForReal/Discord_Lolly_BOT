const { Player, useQueue } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei')
const axios = require('axios');
const regh = require('./registro.js');
const discord = require('discord.js');
const { RockPaperScissors, selectRandomItem, replyItems, Personagens, createEmbed } = require('./varsFunctions.js');
const dotenv = require('dotenv');
const login = process.env.TOKEN, apiKey = process.env.API_YOUTUBE;
let volume1 = 100;
dotenv.config();


//Import Comandos

const characterCommand = require('./comandos/character.js');
const clearCommand = require('./comandos/clear.js');
const inviteCommand = require('./comandos/invite.js');
const loopCommand = require('./comandos/loop.js');
const minigameCommand = require('./comandos/minigame.js');
const nowplayingCommand = require('./comandos/nowplaying.js');
const pauseCommand = require('./comandos/pause.js');
const pingCommand = require('./comandos/ping.js')
const playCommand = require('./comandos/play.js');
const queueCommand = require('./comandos/queue.js');
const resumeCommand = require('./comandos/resume.js');
const shuffleCommand = require('./comandos/shuffle.js');
const skipCommand = require('./comandos/skip.js');
const stopCommand = require('./comandos/stop.js');
const volumeCommand = require('./comandos/volume.js');

const commands = new Map();
commands.set(characterCommand.name, characterCommand);
commands.set(clearCommand.name, clearCommand);
commands.set(inviteCommand.name, inviteCommand);
commands.set(loopCommand.name, loopCommand);
commands.set(minigameCommand.name, minigameCommand);
commands.set(nowplayingCommand.name, nowplayingCommand);
commands.set(pauseCommand.name, pauseCommand);
commands.set(pingCommand.name, pingCommand);
commands.set(playCommand.name, playCommand);
commands.set(queueCommand.name, queueCommand);
commands.set(resumeCommand.name, resumeCommand);
commands.set(shuffleCommand.name, shuffleCommand);
commands.set(skipCommand.name, skipCommand);
commands.set(stopCommand.name, stopCommand);
commands.set(volumeCommand.name, volumeCommand);

////// Functions //////

// Função para verificar se o usuário está em um canal de voz
function checkVoiceChannel(interaction) {

  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {

    return false;

  }

  return true;
}

// Função para verificar se há uma fila de músicas
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

const player = new Player(client, {
  ytdlOptions: { // Estas são opções padrão para ytdl-core, se usado diretamente
    quality: "highestaudio",
    highWaterMark: 1 << 25,
    dlChunkSize: 0,
    filter: "audioonly",
    requestOptions: { // requestOptions é específico para ytdl-core para passar headers etc.
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br"
      }
    }
  },
  useLegacyFFmpeg: true // Isso pode ou não ser necessário, dependendo da sua versão do FFmpeg
});

player.extractors.register(YoutubeiExtractor).then(() => { // Removido o { Cookie: process.env.YOUTUBE_COOKIE } a menos que você realmente precise e tenha configurado
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

  const commandName = await interaction.commandName;

  switch (commandName) {

    case 'invite':
      await commands.get('invite').execute(interaction);
      break;

    case 'play':
      await commands.get('play').execute(interaction, player, checkVoiceChannel, createEmbed, volume1);
      break;

    case 'skip':
      await commands.get('skip').execute(interaction, checkVoiceChannel, checkQueue, createEmbed);
      break;

    case 'queue':
      await commands.get('queue').execute(interaction, checkVoiceChannel, checkQueue, createEmbed);
      break;

    case 'stop':
      await commands.get('stop').execute(interaction, checkVoiceChannel, checkQueue, createEmbed);
      break;

    case 'pause':
      await commands.get('pause').execute(interaction, checkVoiceChannel, checkQueue, createEmbed);
      break;

    case 'resume':
      await commands.get('resume').execute(interaction, checkVoiceChannel, checkQueue, createEmbed);
      break;

    case 'volume':
      const novoVolume = await commands.get('volume').execute(interaction, checkQueue, createEmbed);
      if (typeof novoVolume === 'number') {
        volume1 = novoVolume;
      }
      break;

    case 'shuffle':
      await commands.get('shuffle').execute(interaction, checkQueue, createEmbed);
      break;

    case 'nowplaying':
      await commands.get('nowplaying').execute(interaction, checkQueue, createEmbed);
      break;

    case 'loop':
      await commands.get('loop').execute(interaction, checkQueue, createEmbed);
      break;

    case 'clear':
      await commands.get('clear').execute(interaction, checkQueue, checkVoiceChannel, createEmbed);
      break;

    case 'character':
      await commands.get('character').execute(interaction, Personagens, createEmbed);
      break;

    case 'ping':
      await commands.get('ping').execute(interaction, replyItems);
      break;

    case 'minigame':
      await commands.get('minigame').execute(interaction, selectRandomItem, RockPaperScissors, createEmbed);
      break;

    default:
      console.log('Ouve um erro, opção nao especificada.')
      break;
  };

});

client.on('messageCreate', (message) => {
  let conteudo = message.content
  let admin = 680480327616954370
  if (conteudo == 'adminReload') {
    if (message.author = !admin) {
      message.reply({ content: `${message.author} Você não tem permissão para realizar um reload!`, ephemeral: true })
    } else {
      message.reply({ content: `Bem vindo ${message.id}!, Iniciando Reload: Application **RESET** for **ALL SERVERS**\nReload Solicitado em ${message.channel}, ${message.guild}`, ephemeral: true })
      adminReload()
    }
  }
})

client.login(login);