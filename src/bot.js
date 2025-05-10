const { Player, useQueue } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei')
const axios = require('axios');
const regh = require('./registro.js');
const discord = require('discord.js');
const { RockPaperScissors, selectRandomItem, replyItems, Personagens, createEmbed } = require('./varsFunctions.js');
const dotenv = require('dotenv');
dotenv.config();
const login = process.env.TOKEN
const apiKey = process.env.API_YOUTUBE;


//Import Comandos

const clearCommand = require('./comandos/clear.js');
const inviteCommand = require('./comandos/invite.js');
const loopCommand = require('./comandos/loop.js');
const nowplayingCommand = require('./comandos/nowplaying.js');
const pauseCommand = require('./comandos/pause.js');
const playCommand = require('./comandos/play.js');
const queueCommand =  require('./comandos/queue.js');
const resumeCommand = require('./comandos/resume.js');
const shuffleCommand = require('./comandos/shuffle.js');
const skipCommand = require('./comandos/skip.js');
const stopCommand = require('./comandos/stop.js');
const volumeCommand = require('./comandos/volume.js');

const commands = new Map();
commands.set(inviteCommand.name, inviteCommand);
commands.set(playCommand.name, playCommand);
commands.set(skipCommand.name, skipCommand);
commands.set(stopCommand.name, stopCommand);
commands.set(pauseCommand.name, pauseCommand);
commands.set(resumeCommand.name, resumeCommand);
commands.set(shuffleCommand.name, shuffleCommand);
commands.set(volumeCommand.name, volumeCommand);
commands.set(queueCommand.name, queueCommand);
commands.set(nowplayingCommand.name, nowplayingCommand);
commands.set(loopCommand.name, loopCommand);
commands.set(clearCommand.name, clearCommand);

////// Functions //////
// Função para verificar se o usuário está em um canal de voz
function checkVoiceChannel(interaction) {

  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {

    interaction.reply('Você precisa estar em uma call primeiro bobinho ╰(*°▽°*)╯');
    return false;

  }

  return true;
}

// Função para verificar se há uma fila de músicas
function checkQueue(interaction) {

  const queue = useQueue(interaction.guild);

  if (!queue) {

    interaction.reply('A lista está vazia, **BIZONHO** O.O');
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
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25
  }
});

player.extractors.register(YoutubeiExtractor).then(() => {
  console.log('Extractor Carregado');
}).catch((e) => console.log(e));

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

  let embed = new discord.EmbedBuilder()
    .setColor('#dbffff')
    .setTitle(track.title)
    .setDescription(`**${track.title}** foi adicionado à fila!`)
    .setThumbnail('https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg')
    .setImage(track.thumbnail)
    .addFields(
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

  ///////// Ping /////////
  if (interaction.commandName === 'ping') {
    const response = selectRandomItem(replyItems);
    interaction.reply(response);
  };

  /////// Minigame ///////

  if (interaction.commandName === 'minigame') {
    const escolha = selectRandomItem(RockPaperScissors);

    let embed = new discord.EmbedBuilder()
      .setTitle('Resultados!')
      .setDescription(`O bot escolheu: ${escolha}`)
      .setColor('Random')
      .setThumbnail('https://goglobalways.com/wp-content/uploads/2023/03/Rock-Scissors-Game.png');

    if (interaction.options.getString('jogada_usuario') === 'pedra') {
      embed.addFields(
        { name: 'Sua jogada:', value: 'Pedra' },
      );
      if (escolha === 'pedra') {
        embed.addFields(
          { name: 'Resultado:', value: 'Empate!' },
        );
      } else if (escolha === 'papel') {
        embed.addFields(
          { name: 'Resultado:', value: 'Eu Venci! >:)' },
        );
      } else if (escolha === 'shotgun') {
        embed.addFields(
          { name: 'Resultado:', value: `Eu Venci! (●'◡'●)` },
        );
      } else {
        embed.addFields(
          { name: 'Resultado:', value: 'Eu perdi... :(' },
        );
      }
    } else if (interaction.options.getString('jogada_usuario') === 'papel') {
      embed.addFields(
        { name: 'Sua jogada:', value: 'Papel' },
      );
      if (escolha === 'pedra') {
        embed.addFields(
          { name: 'Resultado:', value: 'Você Venceu! :(' },
        );
      } else if (escolha === 'papel') {
        embed.addFields(
          { name: 'Resultado:', value: 'Empate!' },
        );
      } else if (escolha === 'shotgun') {
        embed.addFields(
          { name: 'Resultado:', value: `Eu Venci! (●'◡'●)` },
        );
      } else {
        embed.addFields(
          { name: 'Resultado:', value: 'Eu Venci! >:)' },
        );
      }
    } else if (interaction.options.getString('jogada_usuario') === 'tesoura') {
      embed.addFields(
        { name: 'Sua jogada:', value: 'Tesoura' },
      );
      if (escolha === 'pedra') {
        embed.addFields(
          { name: 'Resultado:', value: 'Eu Venci! >:)' },
        );
      } else if (escolha === 'papel') {
        embed.addFields(
          { name: 'Resultado:', value: 'Você Venceu! :(' },
        );
      } else if (escolha === 'shotgun') {
        embed.addFields(
          { name: 'Resultado:', value: `Eu Venci! (●'◡'●)` },
        );
      } else {
        embed.addFields(
          { name: 'Resultado:', value: 'Empate!' },
        );
      }
    } else {
      embed.addFields(
        { name: 'Resultado:', value: 'Jogada inválida.' },
      );
    }

    interaction.reply({ embeds: [embed] });
  };

  ///// Music /////

  const commandName = interaction.commandName;

  switch (commandName) {

    case 'invite':
      await commands.get('invite').execute(interaction);
      break;

    case 'play':
      await commands.get('play').execute(interaction, player, checkVoiceChannel, createEmbed);
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
      await commands.get('volume').execute(interaction, checkQueue, createEmbed);
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

    default:
      console.log('Ouve um erro, opção nao especificada.')
      break;
  };

  if (interaction.commandName === 'character') {

    console.log('Personagens:', Personagens);
    const result = selectRandomItem(Personagens);
    console.log('Resultado:', result);

    if (!result) {
      return interaction.reply('Ocorreu um erro ao selecionar um personagem.');
    }

    let embed = createEmbed('#dbffff', `${result.text}`, `${result.description}`, '', `${result.img}`);
    interaction.reply({ embeds: [embed] });

  }

});

client.on('messageCreate', (message) => {
  let conteudo = message.content
  let admin = 680480327616954370
  if (conteudo == 'adminReload') {
    if (message.author = !admin) {
      message.reply({ content: `${message.author} Você não tem permissão para realizar um reload!`, ephemeral: true })
    } else {
      message.reply({ content: `Bem vindo ${message.author}!, Iniciando Reload: Application **RESET** for **ALL SERVERS**\nReload Solicitado em ${message.channel}, ${message.guild}`, ephemeral: true })
      adminReload()
    }
  }
})

client.login(login);