const discord = require('discord.js');
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
  { text: 'Tá bom, tá bom eu falo Pong, Feliz???', probability: 0.1 },
  { text: 'Big balls inside your mouth', probability: 0.1 },
  { text: 'Verme Imundo', probability: 0.1 },
  { text: 'Seu cu é meu', probability: 0.1 },
  { text: 'Não.', probability: 0.1 },
  { text: 'Lorem Impsum', probability: 0.1 },
  { text: 'O seu inutil, vai buscar algo pra fazer', probability: 0.1 },
  { text: 'Mesmo sendo um bot, eu tenho sentimentos, sabia?', probability: 0.1 },
  { text: 'Mesmo sendo um mero bot totalmente Scriptado, sem nenhum tipo de inteligencia artificial, eu consigo perceber tamanha insiguinificancia em suas palavras. Você com essa busca incessante por conseguir uma misera resposta pre programda de Pong me enoja, vá lá fora ver o céu, ou sei lá falar com um amigo, ah é você não deve ter um pra estar perdendo seu precioso tempo aqui comigo seu merda, porquê você não vai pular de um prédio e eliminar essa sua existencia futil da humanidade.', probability: 0.001 },
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

////////////////////// end Function ////////////////////////

const client = new discord.Client({
  intents: [
    Object.values(discord.GatewayIntentBits),
    discord.IntentsBitField.Flags.Guilds,
    discord.IntentsBitField.Flags.GuildMembers,
    discord.IntentsBitField.Flags.GuildMessages,
    discord.IntentsBitField.Flags.MessageContent,

  ],
  Partials: [
    discord.Partials.message,
    discord.Partials.channel,
    discord.Partials.Reaction
  ],
});
client.login(login);

client.on('ready', (c) => {
  console.log(`Logged in as ${c.user.tag}!`);
});

client.on('messageCreate', async (message) => {

  console.log(message.content, message.author.username);
  if (message.author.bot) return;

  if (message.content === 'l+ping' && message.author.username === 'xonoxonem') {
    const response = 'Mesmo sendo um mero bot totalmente Scriptado, sem nenhum tipo de inteligencia artificial, eu consigo perceber tamanha insiguinificancia em suas palavras. Você com essa busca incessante por conseguir uma misera resposta pre programda de Pong me enoja, vá lá fora ver o céu, ou sei lá falar com um amigo, ah é você não deve ter um pra estar perdendo seu precioso tempo aqui comigo seu merda, porquê você não vai pular de um prédio e eliminar essa sua existencia futil da humanidade.';
    await message.reply(response);
  } else if (message.content === 'l+ping') {
    const response = reply(replyItems);
    await message.reply(response);
  }

});