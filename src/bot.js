const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei')
const discord = require('discord.js');
const { EmbedBuilder, MessageEmbed } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const login = process.env.TOKEN

////// vars //////

var replyItems = [
  { text: 'Para com isso ai po >:(', probability: 0.1 },
  { text: 'Para de me chamar, eu sou um bot, não um cachorro', probability: 0.1 },
  { text: 'Você é chato, sabia?', probability: 0.1 },
  { text: 'Essa piada é sem graça, sabia?', probability: 0.1 },
  { text: 'Não vou responder isso...', probability: 0.1 },
  { text: 'Morra.', probability: 0.1 },
  { text: 'Você é um idiota por acaso?.', probability: 0.1 },
  { text: 'AAAAAAA você é chato demais', probability: 0.1 },
  { text: 'Vai tomar no cu o(≧口≦)o', probability: 0.09 },
  { text: 'Oh inferno (ㆆ_ㆆ)', probability: 0.1 },
  { text: 'Tá bom, tá bom eu falo Pong, Feliz???', probability: 0.05 },
  { text: 'Big balls inside your mouth', probability: 0.1 },
  { text: 'Verme Imundo', probability: 0.05 },
  { text: 'Seu cu é meu', probability: 0.1 },
  { text: 'Não.', probability: 0.15 },
  { text: 'Lorem Impsum', probability: 0.1 },
  { text: 'O seu inutil, vai buscar algo pra fazer', probability: 0.1 },
  { text: 'Mesmo sendo um bot, eu tenho sentimentos, sabia?', probability: 0.1 },
  { text: 'Mesmo sendo um mero bot totalmente Scriptado, sem nenhum tipo de inteligencia artificial, eu consigo perceber tamanha insiguinificancia em suas palavras. Você com essa busca incessante por conseguir uma misera resposta pre programda de Pong me enoja, vá lá fora ver o céu, ou sei lá falar com um amigo, ah é você não deve ter um pra estar perdendo seu precioso tempo aqui comigo seu merda, porquê você não vai pular de um prédio e eliminar essa sua existencia futil da humanidade.', probability: 0.001 },
];

var RockPaperScissors = [
  { text: 'pedra', probability: 0.33 },
  { text: 'papel', probability: 0.33 },
  { text: 'tesoura', probability: 0.33 },
  { text: 'shotgun', probability: 0.01 },
];

//// end vars ////


//////////////////////// Function //////////////////////////

function selectRandomItem(items) {
  const random = Math.random();
  let sum = 0;

  for (const item of items) {
    sum += item.probability;
    if (random <= sum) {
      return item.text;
    }
  }
}

////////////////////// end Function ////////////////////////

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

player.events.on('audioTrackAdd', (queue, track) => {

  const embed = new EmbedBuilder()
    .setColor('#dbffff')
    .setTitle(track.title)
    .setDescription(`**${track.title}** foi adicionado à fila!`)
    .setThumbnail('https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg')
    .setImage(track.thumbnail)
    .setAuthor(
      { name: track.author, iconURL: track.author.avatarURL }
    )
    .addFields(
      { name: 'Duração', value: track.duration, inline: true },
      { name: 'URL', value: track.url, inline: true }
    )

  queue.metadata.channel.send({ embeds: [embed] });

});

player.events.on('audioTracksAdd', (queue, track) => {
  queue.metadata.channel.send(`Adicionados as musicas a Fila`)
});

player.events.on('playerSkip', (queue, track) => {
  queue.metadata.channel.send(`Skipando **${track.title}**`)
});

player.events.on('disconnect', (queue) => {
  queue.metadata.channel.send(`Me Humilharu`)
});

player.events.on('emptyChannel', (queue) => {
  queue.metadata.channel.send(`Me abandonaram aqui, sacanagem viu >:(`)
});

player.events.on('emptyQueue', (queue) => {
  queue.metadata.channel.send(`Moço ( •̀ ω •́ )✧, cabou as músicas!`)
});



client.login(login);

client.on('ready', (c) => {
  console.log(`Logged in as ${c.user.tag}!`);
});



client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  ///////// Ping /////////

  if (interaction.commandName === 'ping' && interaction.user.username === 'xonoxonem') {
    interaction.reply('Mesmo sendo um mero bot totalmente Scriptado, sem nenhum tipo de inteligencia artificial, eu consigo perceber tamanha insiguinificancia em suas palavras. Você com essa busca incessante por conseguir uma misera resposta pre programda de Pong me enoja, vá lá fora ver o céu, ou sei lá falar com um amigo, ah é você não deve ter um pra estar perdendo seu precioso tempo aqui comigo seu merda, porquê você não vai pular de um prédio e eliminar essa sua existencia futil da humanidade.');
  } else if (interaction.commandName === 'ping') {
    const response = selectRandomItem(replyItems);
    interaction.reply(response);
  };

  /////// Minigame ///////

  if (interaction.commandName === 'minigame') {
    const escolha = selectRandomItem(RockPaperScissors);

    let embed = new EmbedBuilder()
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
        volume: 80,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 30000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 30000,
      },
    });

    interaction.reply(`🔎 Procurando: **${args}**`);
  }

  else if (interaction.commandName === 'skip') {

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) return interaction.reply('Nem num canal de voz tu tá, vou parar oque? (* ￣︿￣)');

    const queue = player.queues.get(interaction.guild);

    if (!queue) return interaction.reply('A lista está vazia, **BIZONHO** O.O');

    queue.node.skip();

    const embed = new EmbedBuilder()
      .setColor('#fff4ce')
      .setTitle('Okay! Pulando para a próxima música')
      .setDescription(`A música foi **PULADA**`)
      .setThumbnail('https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg')

    interaction.reply({ embeds: [embed] });

  }

  else if (interaction.commandName === 'pause') {

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) return interaction.reply('Nem num canal de voz tu tá, vou parar oque? (* ￣︿￣)');

    const queue = player.queues.get(interaction.guild);

    if (!queue) return interaction.reply('A lista está vazia, MEDONHO O.O');


    if (queue.node.isPaused()) return message.channel.send('Já tá Pausado, quer que eu pause x2??')
    queue.node.pause();
    interaction.reply('Vou pausar pra princesa =_=')

  }

  else if (interaction.commandName === 'resume') {

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) return interaction.reply('Nem num canal de voz tu tá, vou parar oque? (* ￣︿￣)');

    const queue = player.queues.get(interaction.guild);

    if (!queue) return interaction.reply('A lista está vazia, MEDONHO O.O');


    if (!queue.node.isPaused()) return message.channel.send('Tu é surdo? já tá tocando seu lezado >:(')
    queue.node.resume();
    interaction.reply('Voltando à Festa! Oh Yeah ☆*: .｡. o(≧▽≦)o .｡.:*☆')

  }

  else if (interaction.commandName === 'queue') {

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) return interaction.reply('Nem num canal de voz tu tá, vou parar oque? (* ￣︿￣)');

    const queue = player.queues.get(interaction.guild);

    if (!queue) return interaction.reply('A lista está vazia, **BIZARRO** O.O');

    const history = queue.history.tracks.data.map(x => x.title);
    const next = queue.tracks.data.map(x => x.title);
    const list = [...history, `> ${queue.currentTrack.title}`, ...next];

    interaction.reply(`Atualmente a lista no servidor é: ${interaction.guild.name}\n${list.join('\n')}`)

  }

  else if (interaction.commandName === 'stop') {

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) return interaction.reply('Nem num canal de voz tu tá, vou parar oque? (* ￣︿￣)');

    const queue = player.queues.get(interaction.guild);

    if (!queue) return interaction.reply('A lista está vazia, BIZARRO O.O');

    interaction.reply('Paro-Paro-Paro; Manual do Mundo não me processa 👌');
    queue.delete();
    queue.node.stop();
  }

  else if (interaction.commandName === 'volume') {
    const queue = player.queues.get(interaction.guild); 

    if (!queue) {
        return interaction.reply({ content: 'Não tem nenhum Hit no momento!', ephemeral: true });
    }

    const volumeVal = interaction.options.getInteger('vol');

    if (volumeVal === null || isNaN(volumeVal) || volumeVal < 0 || volumeVal > 100) {
        return interaction.reply({ content: 'Por favor, forneça um valor de volume válido entre 0 a 100.', ephemeral: true });
    }

    queue.node.setVolume(volumeVal);

    return interaction.reply({ content: `Volume definido para **${volumeVal}%**!`, ephemeral: true });
}

});