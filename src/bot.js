const { Player, useQueue } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei')
const axios = require('axios');
const regh = require('./registro.js');
const discord = require('discord.js');
const { RockPaperScissors, selectRandomItem, replyItems, Personagens } = require('./varsFunctions.js');
const dotenv = require('dotenv');
dotenv.config();
const login = process.env.TOKEN
const apiKey = process.env.API_YOUTUBE;

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

// Função para criar um embed com configurações comuns
function createEmbed(color, title, description, thumbnail, image) {

  const embed = new discord.EmbedBuilder()
    .setColor(color || '#000000')
    .setTitle(title || '')
    .setDescription(description || '');

  if (thumbnail) {
    embed.setThumbnail(thumbnail);
  }

  if (image) {
    embed.setImage(image);
  }

  return embed;
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
    .setTitle(`Adicionando à **Playlist** a Fila`)
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


client.on('ready', (c) => {
  console.log(`Logged in as ${c.user.tag}!`);

  adminReload()

});


client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

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

  if (interaction.commandName === 'play') {

    if (!checkVoiceChannel(interaction)) return;

    let args = interaction.options.getString('url');
    if (!args) return interaction.reply('Me de algo para buscar!!');

    player.play(interaction.member.voice.channel, args, {
      nodeOptions: {
        metadata: {
          channel: interaction.channel,
          client: interaction.guild.members.me,
          RequestedBy: interaction.user,
        },
        selfDeaf: true,
        volume: 100,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 300000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 300000,
      },
    });

    let embed = createEmbed('#fff4ce', '🔎 Procurando:', `**${args}**`, null);
    interaction.reply({ embeds: [embed] });

  }

  else if (interaction.commandName === 'skip') {

    if (!checkVoiceChannel(interaction)) return;

    const queue = checkQueue(interaction);
    if (!queue) return;

    queue.node.skip();
    let embed = createEmbed('#fff4ce', 'Okay! Pulando para a próxima música', 'A música foi **PULADA**', 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
    interaction.reply({ embeds: [embed] });

  }

  else if (interaction.commandName === 'pause') {

    if (!checkVoiceChannel(interaction)) return;

    const queue = checkQueue(interaction);

    if (!queue) return;

    let embedPause = createEmbed('#d88588', 'À música já está pausada!', 'A não ser que sei lá, você queira que eu pare 2x')
    if (queue.node.isPaused()) return interaction.reply({ embed: [embedPause] });

    queue.node.pause();

    let embed = createEmbed('#fff4ce', 'Vou pausar pra princesa =_=', 'A música foi **PAUSADA**', 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
    interaction.reply({ embeds: [embed] });

  }

  else if (interaction.commandName === 'resume') {

    if (!checkVoiceChannel(interaction)) return;
    const queue = checkQueue(interaction);
    if (!queue) return;

    let embedResume = createEmbed('#d88588', 'Eu não sou Adivinha', 'Mas acho que já está tocando!')
    if (!queue.node.isPaused()) return interaction.reply({ embeds: [embedResume] });
    queue.node.resume();

    let embed = createEmbed('#dbffff', 'Voltando à Festa! Oh Yeah', '☆*: .｡. o(≧▽≦)o .｡.:*☆', 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
    interaction.reply({ embeds: [embed] });

  }

  else if (interaction.commandName === 'queue') {

    if (!checkVoiceChannel(interaction)) return;
    const queue = checkQueue(interaction);
    if (!queue) return;

    const history = queue.history.tracks.data.map(x => x.title);
    const next = queue.tracks.data.map(x => x.title);
    const list = [...history, `> ${queue.currentTrack.title}`, ...next];

    let embed = createEmbed('#dbffff', `Atualmente a lista em ${interaction.guild.name}`, `Lista servidor: \n${list.join('\n')}`, 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
    interaction.reply({ embeds: [embed] });

  }

  else if (interaction.commandName === 'stop') {

    if (!checkVoiceChannel(interaction)) return;
    const queue = checkQueue(interaction);
    if (!queue) return;

    queue.delete();
    queue.node.stop();

    let embed = createEmbed('#fff4ce', 'Paro-Paro-Paro!', 'Manual do Mundo não me processa 👌', 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
    interaction.reply({ embeds: [embed] });

  }

  else if (interaction.commandName === 'volume') {

    const queue = useQueue(interaction.guild);
    if (!queue) return interaction.reply({ content: 'Não tem nenhum Hit no momento!', ephemeral: true });

    const volumeVal = interaction.options.getInteger('vol');
    if (volumeVal === null || isNaN(volumeVal) || volumeVal < 0 || volumeVal > 500) {
      return interaction.reply({ content: 'Por favor, forneça um valor de volume válido entre 0 a 500.', ephemeral: true });
    }

    queue.node.setVolume(volumeVal);
    let embed = createEmbed('#d88588', `Volume definido para **${volumeVal}%**!`, 'Volume alterado', 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
    return interaction.reply({ embeds: [embed] });

  }

  else if (interaction.commandName === 'loop') {

    const queue = checkQueue(interaction);
    if (!queue) return;

    const loopMode = interaction.options.getNumber('modo');
    queue.setRepeatMode(loopMode);

    const loopModes = ['Desativado', 'Música', 'Playlist', 'Autoplay'];
    const lop = loopModes[loopMode] || 'Desconhecido';

    let embed = createEmbed('#dbffff', 'Hora do Loop', `Loop está atualmente ${lop}`, 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
    interaction.reply({ embeds: [embed] });

  }

  else if (interaction.commandName === 'nowplaying') {

    const queue = checkQueue(interaction);
    if (!queue) return;

    const currentSong = queue.currentTrack;
    if (!currentSong) return interaction.reply('Erro em alguma coisa,  sei lá');

    let embed = createEmbed('#dbffff', 'Tocando **atualmente**:', `**${currentSong}**`, 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
    interaction.reply({ embeds: [embed] });

  }

  else if (interaction.commandName === 'shuffle') {

    const queue = checkQueue(interaction);
    if (!queue) return;

    if (queue.tracks.size < 2) {
      let embed = createEmbed('#dbffff', 'Não há músicas suficientes para aleatorizar a playlist!', 'Adicina mais umas ai! （￣︶￣）↗　', 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
      return interaction.reply({ embeds: [embed] });
    }

    queue.tracks.shuffle();
    let embed = createEmbed('#db8a8f', 'Embaralhandoa Playlist', `Aleatorizando ${queue.tracks.size} musicas. Use /queue para ver a nova playlist`, 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
    interaction.reply({ embeds: [embed] });

  }

  else if (interaction.commandName === 'character') {

    console.log('Personagens:', Personagens);
    const result = selectRandomItem(Personagens);
    console.log('Resultado:', result);

    if (!result) {
      return interaction.reply('Ocorreu um erro ao selecionar um personagem.');
    }

    let embed = createEmbed('#dbffff', `${result.text}`, `${result.description}`, '', `${result.img}`);
    interaction.reply({ embeds: [embed] });

  };

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