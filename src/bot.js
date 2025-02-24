const { Player, QueueRepeatMode, useQueue } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei')
const axios = require('axios');
const regh = require('./registro.js');
const discord = require('discord.js');
const { RockPaperScissors, selectRandomItem, replyItems } = require('./varsFunctions.js');
const dotenv = require('dotenv');
dotenv.config();
const login = process.env.TOKEN
const apiKey = process.env.API_YOUTUBE;


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

  const embed = new discord.EmbedBuilder()
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
    .setTitle(`Adicionando à **Playlist: ${track.title}** a Fila`)
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

player.events.on('emptyQueue', (queue,track) => {


  let embed = new discord.EmbedBuilder()
    .setColor('#d9878d')
    .setTitle('Moço ( •̀ ω •́ )✧, cabou as músicas!')


  queue.metadata.channel.send({ embeds: [embed] })
});



client.login(login);

client.on('ready', (c) => {
  console.log(`Logged in as ${c.user.tag}!`);

  let servers = [];

  client.guilds.cache.forEach(guild => {
    servers.push(guild.id);
  });


  regh(servers);


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

    const voiceChannel = interaction.member.voice.channel;
    const args = interaction.options.getString('url')

    if (!voiceChannel) return interaction.reply('Você precisa estar em uma call primeiro bobinho ╰(*°▽°*)╯')

    if (!args) return interaction.reply('Me de algo para buscar!!')

    player.play(voiceChannel, args, {

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

    const embed = new discord.EmbedBuilder()
      .setColor('#fff4ce')
      .setTitle('🔎 Procurando:')
      .setDescription(`**${args}**`)

    interaction.reply({ embeds: [embed] });

  }

  else if (interaction.commandName === 'skip') {

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) return interaction.reply('Nem num canal de voz tu tá, vou parar oque? (* ￣︿￣)');

    const queue = useQueue(interaction.guild);

    if (!queue) return interaction.reply('A lista está vazia, **BIZONHO** O.O');

    queue.node.skip();

    const embed = new discord.EmbedBuilder()
      .setColor('#fff4ce')
      .setTitle('Okay! Pulando para a próxima música')
      .setDescription(`A música foi **PULADA**`)
      .setThumbnail('https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg')

    interaction.reply({ embeds: [embed] });

  }

  else if (interaction.commandName === 'pause') {

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) return interaction.reply('Nem num canal de voz tu tá, vou parar oque? (* ￣︿￣)');

    const queue = useQueue(interaction.guild);

    if (!queue) return interaction.reply('A lista está vazia, **ASTRONOMICO FDS KKK** O.O');


    if (queue.node.isPaused()) return message.channel.send('Já tá Pausado, quer que eu pause x2??')
    queue.node.pause();

    let embed = new discord.EmbedBuilder()
      .setColor('#fff4ce')
      .setTitle('Vou pausar pra princesa =_=')
      .setDescription(`A música foi **PAUSADA**`)
      .setThumbnail('https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg')

    interaction.reply({ embeds: [embed] })

  }

  else if (interaction.commandName === 'resume') {

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) return interaction.reply('Nem num canal de voz tu tá, vou parar oque? (* ￣︿￣)');

    const queue = useQueue(interaction.guild);

    if (!queue) return interaction.reply('A lista está vazia, **MEDONHO** O.O');


    if (!queue.node.isPaused()) return message.channel.send('Tu é surdo? já tá tocando seu lezado >:(')
    queue.node.resume();

    let embed = new discord.EmbedBuilder()
      .setColor('#dbffff')
      .setTitle('Voltando à Festa! Oh Yeah')
      .setDescription(`☆*: .｡. o(≧▽≦)o .｡.:*☆`)
      .setThumbnail('https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg')

    interaction.reply({ embeds: [embed] })

  }

  else if (interaction.commandName === 'queue') {

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) return interaction.reply('Nem num canal de voz tu tá, vou parar oque? (* ￣︿￣)');

    const queue = useQueue(interaction.guild);

    if (!queue) return interaction.reply('A lista está vazia, **BIZARRO** O.O');

    const history = queue.history.tracks.data.map(x => x.title);
    const next = queue.tracks.data.map(x => x.title);
    const list = [...history, `> ${queue.currentTrack.title}`, ...next];

    let embed = new discord.EmbedBuilder()
      .setColor('#dbffff')
      .setTitle(`Atualmente a lista em ${interaction.guild.name}`)
      .setDescription(`Lista servidor: \n${list.join('\n')}`)
      .setThumbnail('https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg')

    interaction.reply({ embeds: [embed] })

  }

  else if (interaction.commandName === 'stop') {

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) return interaction.reply('Nem num canal de voz tu tá, vou parar oque? (* ￣︿￣)');

    const queue = useQueue(interaction.guild);

    if (!queue) return interaction.reply('A lista está vazia, **BIZARRO** O.O');

    queue.delete();
    queue.node.stop();

    let embed = new discord.EmbedBuilder()
      .setColor('#fff4ce')
      .setTitle('Paro-Paro-Paro!')
      .setDescription(`Manual do Mundo não me processa 👌`)
      .setThumbnail('https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg')

    interaction.reply({ embeds: [embed] });
  }

  else if (interaction.commandName === 'volume') {

    const queue = useQueue(interaction.guild);

    if (!queue) {
      return interaction.reply({ content: 'Não tem nenhum Hit no momento!', ephemeral: true });
    }

    const volumeVal = interaction.options.getInteger('vol');

    if (volumeVal === null || isNaN(volumeVal) || volumeVal < 0 || volumeVal > 500) {
      return interaction.reply({ content: 'Por favor, forneça um valor de volume válido entre 0 a 500.', ephemeral: true });
    }

    queue.node.setVolume(volumeVal);

    let embed = new discord.EmbedBuilder()
      .setColor('#d88588')
      .setTitle(`Volume definido para **${volumeVal}%**!`)
      .setDescription('Volume alterado')
      .setThumbnail('https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg')

    return interaction.reply({ embeds: [embed] });
  }

  else if (interaction.commandName == 'loop') {

    const queue = useQueue(interaction.guild);

    if (!queue) return interaction.reply('A lista está vazia, **AIAI KI MEDU** O.O');

    const loopMode = interaction.options.getNumber('modo');

    queue.setRepeatMode(loopMode);

    let lop = ''

    if(loopMode == 0){
      lop = 'Desativado'
    } 
    
    else if (loopMode == 1){
      lop = 'Música'
    }

    else if (loopMode == 2){
      lop = 'Playlist'
    }

    else if (loopMode == 3){
      lop = 'Autoplay'
    }


    const embed = new discord.EmbedBuilder()
      .setColor('#dbffff')
      .setTitle('Hora do Loop')
      .setDescription(`Loop está atualmente ${lop}`)
      .setThumbnail('https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');

    interaction.reply({ embeds: [embed] });

  }

  else if (interaction.commandName == 'nowplaying') {


    const queue = useQueue(interaction.guild);

    if (!queue) return interaction.reply('A lista está vazia, **CARAMBOLAS** O.O');


    const currentSong = queue.currentTrack;

    if (!currentSong) { return interaction.reply('erro foda to com sono sei lá') }

    let embed = new discord.EmbedBuilder()
      .setColor('#dbffff')
      .setTitle('Tocando **atualmente**:')
      .setDescription(`**${currentSong}**`)
      .setThumbnail('https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg')

    interaction.reply({ embeds: [embed] })

  }

  else if (interaction.commandName == 'shuffle') {


    const queue = useQueue(interaction.guild);

    if (!queue) return interaction.reply('A lista está vazia, CATAPIMBAS O.O');


    if (queue.tracks.size < 2) {
      let embed1 = new discord.EmbedBuilder()
        .setColor('#dbffff')
        .setTitle('Não há músicas suficientes para aleatorizar a playlist!')
        .setDescription(`Adicina mais umas ai! （￣︶￣）↗　`)
        .setThumbnail('https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');

      return interaction.reply({ embeds: [embed1] });
    }



    queue.tracks.shuffle();

    let embed = new discord.EmbedBuilder()
      .setColor('#db8a8f')
      .setTitle('Embaralhandoa Playlist')
      .setDescription(`Aleatorizando ${queue.tracks.size} musicas. Use /queue para ver a nova playlist`)
      .setThumbnail('https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');

    interaction.reply({ embeds: [embed] });

  }

});
