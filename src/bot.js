const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei')
const discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');
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

function reply(items) {
  var random = Math.random();
  var sum = 0;

  for (var i = 0; i < items.length; i++) {
    sum += items[i].probability;
    if (random <= sum) {
      return items[i].text;
    }
  }
}

function minigame(escolha) {
  var random = Math.random();
  var sum = 0;

  for (var i = 0; i < escolha.length; i++) {
    sum += escolha[i].probability;
    if (random <= sum) {
      return escolha[i].text;
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

const player = new Player(client);
player.extractors.register(YoutubeiExtractor).then(()=> {
  console.log('Extractor Carregado');
}).catch((e) => console.log(e));

player.events.on('playerStart', (queue, track) =>{
  queue.metadata.channel.send(`Tocando Atualmente **${track.title}**`)
});

player.events.on('audioTrackAdd', (queue, track) => {
  queue.metadata.channel.send(`Adicionado a Fila **${track.title}**`)
});

player.events.on('audioTracksAdd', (queue, track) => {
  queue.metadata.channel.send(`Adicionados as musicas a Fila`)
});

player.events.on('playerSkip', (queue, track) => {
  queue.metadata.channel.send(`Skipando **${track.title}**`)
});

player.events.on('disconnect', (queue) => {
  queue.metadata.channel.send(`Saindo por agora`)
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
    const response = reply(replyItems);
    interaction.reply(response);
  };

  /////// Minigame ///////

  if (interaction.commandName === 'minigame') {
    const escolha = minigame(RockPaperScissors);

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
    const args = interaction.message
    const result = FFMPEG_ARGS_PIPED;

    player.play(voiceChannel, result, {
      nodeOptions: {
        metadata: {
          channel: interaction.channel,
          client: interaction.guild.members.me,
          RequestedBy: interaction.user,
        },
        selfDeaf: true,
        volume: 80,
        leaveOnEmpenty: true,
        leaveOnEmpentyCooldown: 3000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 3000,
      },
    });

  } else if (interaction.commandName === 'skip') {

  } else if (interaction.commandName === 'pause') {

  } else if (interaction.commandName === 'resume') {

  } else if (interaction.commandName === 'queue') {

  } else if (interaction.commandName === 'stop') {

  }

});
