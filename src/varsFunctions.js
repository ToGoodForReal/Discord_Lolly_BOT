const discord = require('discord.js');

//////////////////////// Function //////////////////////////

function createEmbed(color, title, description, thumbnail, image, footer) {
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

  if (footer) {
    embed.setFooter(footer);
  }

  return embed;
}

function createActionRow(numberButtons, customId, texto, disabled) {
  let action = new discord.ActionRowBuilder();

  for (let i = 0; i < numberButtons; i++) {
    action.addComponents(createButtonRow(customId, texto, disabled));
  }

  return action;
}

function createButtonRow(customId, texto, disabled) {
  return new discord.ButtonBuilder()
    .setCustomId(customId)
    .setLabel(texto)
    .setStyle(discord.ButtonStyle.Primary)
    .setDisabled(disabled || false);
}

// Enhanced utility functions for games and memes
function selectRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function RockPaperScissors(userChoice) {
  const choices = ['pedra', 'papel', 'tesoura'];
  const botChoice = selectRandomItem(choices);
  
  const emojis = {
    'pedra': '🪨',
    'papel': '📄', 
    'tesoura': '✂️'
  };
  
  let result;
  if (userChoice === botChoice) {
    result = 'Empate!';
  } else if (
    (userChoice === 'pedra' && botChoice === 'tesoura') ||
    (userChoice === 'papel' && botChoice === 'pedra') ||
    (userChoice === 'tesoura' && botChoice === 'papel')
  ) {
    result = 'Você ganhou! 🎉';
  } else {
    result = 'Eu ganhei! 😎';
  }
  
  return {
    userChoice: `${emojis[userChoice]} ${userChoice}`,
    botChoice: `${emojis[botChoice]} ${botChoice}`,
    result: result
  };
}

const replyItems = [
  'Pong! 🏓',
  'Estou aqui! 👋',
  'Oi! Como posso ajudar? 😊',
  'Pong pong! 🎾',
  'Aqui estou eu! ✨'
];

const Personagens = [
  { name: 'Naruto Uzumaki', anime: 'Naruto', description: 'Ninja determinado que sonha em ser Hokage' },
  { name: 'Monkey D. Luffy', anime: 'One Piece', description: 'Pirata de borracha em busca do One Piece' },
  { name: 'Goku', anime: 'Dragon Ball', description: 'Sayajin protetor da Terra' },
  { name: 'Edward Elric', anime: 'Fullmetal Alchemist', description: 'Alquimista em busca da Pedra Filosofal' },
  { name: 'Tanjiro Kamado', anime: 'Demon Slayer', description: 'Caçador de demônios gentil e determinado' },
  { name: 'Senku Ishigami', anime: 'Dr. Stone', description: 'Gênio científico revivendo a civilização' },
  { name: 'Rimuru Tempest', anime: 'That Time I Got Reincarnated as a Slime', description: 'Slime que se tornou líder de monstros' },
  { name: 'Ainz Ooal Gown', anime: 'Overlord', description: 'Esqueleto mago supremo de Nazarick' }
];

const dadJokes = [
  'Por que os pássaros voam para o sul no inverno? Porque é longe demais para andar! 🐦',
  'O que o pato disse quando comprou batom? "Põe na minha conta!" 🦆',
  'Por que o livro de matemática estava triste? Porque tinha muitos problemas! 📚',
  'O que acontece quando você cruza um peixe com um elefante? Calças de natação! 🐟🐘',
  'Por que não se deve confiar em escadas? Elas estão sempre tramando algo! 🪜',
  'O que você chama de um urso sem orelhas? B! 🐻',
  'Por que o café foi para a polícia? Ele foi moído! ☕',
  'O que você chama de um dinossauro que bate carros? Tiranossauro Wrecks! 🦕'
];

const memeGifs = [
  'https://media.giphy.com/media/3o7TKTDn976rzVgky4/giphy.gif',
  'https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif',
  'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
  'https://media.giphy.com/media/3o6Zt4HU9uwXmXSAuI/giphy.gif',
  'https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif'
];

const triviaQuestions = [
  {
    question: 'Qual é a capital do Brasil?',
    options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
    correct: 2,
    explanation: 'Brasília é a capital federal do Brasil desde 1960!'
  },
  {
    question: 'Quantos planetas existem no sistema solar?',
    options: ['7', '8', '9', '10'],
    correct: 1,
    explanation: 'Existem 8 planetas no sistema solar (Plutão foi reclassificado como planeta anão).'
  },
  {
    question: 'Qual é o maior oceano do mundo?',
    options: ['Atlântico', 'Índico', 'Ártico', 'Pacífico'],
    correct: 3,
    explanation: 'O Oceano Pacífico é o maior oceano do mundo!'
  },
  {
    question: 'Em que ano o homem pisou na Lua pela primeira vez?',
    options: ['1967', '1969', '1971', '1973'],
    correct: 1,
    explanation: 'Neil Armstrong pisou na Lua em 20 de julho de 1969.'
  }
];

const eightBallResponses = [
  '🔮 Sim, definitivamente!',
  '🔮 É certo que sim.',
  '🔮 Sem dúvida.',
  '🔮 Sim, com certeza.',
  '🔮 Você pode contar com isso.',
  '🔮 Como eu vejo, sim.',
  '🔮 Muito provável.',
  '🔮 Perspectiva boa.',
  '🔮 Sinais apontam que sim.',
  '🔮 Resposta nebulosa, tente novamente.',
  '🔮 Pergunte novamente mais tarde.',
  '🔮 Melhor não te dizer agora.',
  '🔮 Não posso prever agora.',
  '🔮 Concentre-se e pergunte novamente.',
  '🔮 Não conte com isso.',
  '🔮 Minha resposta é não.',
  '🔮 Minhas fontes dizem que não.',
  '🔮 Perspectiva não tão boa.',
  '🔮 Muito duvidoso.'
];

// Error handling utility
function handleCommandError(interaction, error, commandName) {
  console.error(`Erro no comando ${commandName}:`, error);
  
  const errorEmbed = createEmbed(
    '#ff6b6b',
    '❌ Erro',
    `Ocorreu um erro ao executar o comando. Tente novamente em alguns segundos.`,
    null,
    null,
    { text: 'Se o erro persistir, contate um administrador.' }
  );
  
  if (!interaction.replied && !interaction.deferred) {
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  } else {
    return interaction.editReply({ embeds: [errorEmbed] });
  }
}

// Cooldown system
const cooldowns = new Map();

function checkCooldown(userId, commandName, cooldownTime = 3000) {
  const key = `${userId}-${commandName}`;
  const now = Date.now();
  
  if (cooldowns.has(key)) {
    const expirationTime = cooldowns.get(key) + cooldownTime;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return { onCooldown: true, timeLeft: timeLeft.toFixed(1) };
    }
  }
  
  cooldowns.set(key, now);
  return { onCooldown: false };
}

module.exports = {
  createEmbed,
  createActionRow,
  createButtonRow,
  selectRandomItem,
  RockPaperScissors,
  replyItems,
  Personagens,
  dadJokes,
  memeGifs,
  triviaQuestions,
  eightBallResponses,
  handleCommandError,
  checkCooldown
};

////////////////////// end Function ////////////////////////
