import discord from 'discord.js'

////// vars //////

export var replyItems = [
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
  { text: 'Seu cu é meu', probability: 0.05 },
  { text: 'Não.', probability: 0.15 },
  { text: 'Lorem Impsum', probability: 0.1 },
  { text: 'O seu inutil, vai buscar algo pra fazer', probability: 0.1 },
  { text: 'Mesmo sendo um bot, eu tenho sentimentos, sabia?', probability: 0.1 },
  { text: 'Mesmo sendo um mero bot totalmente Scriptado, sem nenhum tipo de inteligencia artificial, eu consigo perceber tamanha insiguinificancia em suas palavras. Você com essa busca incessante por conseguir uma misera resposta pre programda de Pong me enoja, vá lá fora ver o céu, ou sei lá falar com um amigo, ah é você não deve ter um pra estar perdendo seu precioso tempo aqui comigo seu merda, porquê você não vai pular de um prédio e eliminar essa sua existencia futil da humanidade.', probability: 0.001 },
];

export var RockPaperScissors = [
  { text: 'pedra', probability: 0.33 },
  { text: 'papel', probability: 0.33 },
  { text: 'tesoura', probability: 0.33 },
  { text: 'shotgun', probability: 0.01 },
];

export var Personagens = [
  { text: 'Edward Richtofen', description: 'Cod Zombies', img: 'https://static.wikia.nocookie.net/vsbattles/images/7/73/Boiiiz_richtofen_wielding_the_ray_gun_by_josael281999-db43ia6.png/revision/latest?cb=20170701013917', probability: 0.1 },
  { text: 'Nikolai Belinski', description: 'Cod Zombies', img: 'https://static.wikia.nocookie.net/vsbattles/images/d/d6/Primis_Nikolai.png/revision/latest?cb=20191030205222', probability: 0.1 },
  { text: 'Tank Dempsey', description: 'Cod Zombies', img: 'https://static.wikia.nocookie.net/vsbattles/images/3/3b/Young_Tank_Dempsey_BOIII.png/revision/latest?cb=20191104055217', probability: 0.1 },
  { text: 'Takeo Masaki', description: 'Cod Zombies', img: 'https://static.wikia.nocookie.net/sst/images/a/a5/Takeo_Masaki.webp/revision/latest?cb=20230911223503', probability: 0.1 },
  { text: 'Monika', description: 'Doki Doki Literature Club', img: 'https://static.wikia.nocookie.net/dokidokiliteratureclub/images/e/ef/Monika_Illustration.png/revision/latest/scale-to-width/360?cb=20190620112703&path-prefix=tr', probability: 0.1 },
  { text: 'Yuri', description: 'Doki Doki Literature Club', img: 'https://upload.wikimedia.org/wikipedia/pt/5/54/YuriDDLC.png', probability: 0.1 },
  { text: 'Natsuki', description: 'Doki Doki Literature Club', img: 'https://static.wikia.nocookie.net/doki-doki-literature-club/images/c/c0/Natsukipersonaje.png/revision/latest?cb=20241027174924&path-prefix=pt-br', probability: 0.1 },
  { text: 'Sayori', description: 'Doki Doki Literature Club', img: 'https://upload.wikimedia.org/wikipedia/pt/thumb/4/4f/SayoriDDLC.png/150px-SayoriDDLC.png', probability: 0.1 },
  { text: 'Sayori (Shine)', description: 'Doki Doki Literature Club', img: 'https://static.wikia.nocookie.net/doki-doki-literature-club/images/2/2d/Sayori_Hanging_(s_kill).png/revision/latest/scale-to-width-down/595?cb=20171117231739', probability: 0.03 },
  { text: 'Spiffo', description: 'Project Zomboid', img: 'https://pzwiki.net/w/images/thumb/c/c3/Spiffouse.png/250px-Spiffouse.png', probability: 0.1 },
  { text: 'Arthur Morgan', description: 'Red Dead Redemption 2', img: 'https://static.wikia.nocookie.net/liberproeliis/images/4/45/Arthur_morgan_official_art.webp/revision/latest?cb=20230626051249&path-prefix=pt-br', probability: 0.1 },
  { text: 'Trevor', description: 'GTA V', img: 'https://i.pinimg.com/736x/11/6e/06/116e06ee2d9af1c838b44897df1084f5.jpg', probability: 0.1 },
  { text: 'Michael', description: 'GTA V', img: 'https://preview.redd.it/4xvjzw28jw5d1.jpeg?auto=webp&s=aab79cd99a0da95b9e5c555bf5b8d01829eb2f7d', probability: 0.1 },
  { text: 'Franklin', description: 'GTA V', img: 'https://i.pinimg.com/736x/ff/40/55/ff4055209466b919e54be25bb2c62910.jpg', probability: 0.1 },
  { text: 'Niko Bellic', description: 'GTA IV', img: 'https://static.wikia.nocookie.net/gta/images/2/27/NikoBellic-GTAIV_(1).jpg/revision/latest?cb=20180214114034&path-prefix=pt', probability: 0.1 },
  { text: 'Bayonetta', description: 'Bayonetta', img: 'https://press-start.com.au/wp-content/uploads/2022/10/Bayonetta-3-Review-Header.jpg', probability: 0.1 },
  { text: 'Bayonetta (Shine)', description: 'Bayonetta', img: 'https://files.yande.re/sample/4af467f49afc428f2b88619b1bbbe007/yande.re%20998563%20sample%20bayonetta%20bayonetta_(character)%20bayonetta_2%20gun%20logan_cure%20megane%20monster%20naked%20nipples%20pussy%20uncensored%20wet.jpg', probability: 0.01 },
  { text: 'William "Bill" Overbeck', description: 'Left 4 Dead', img: 'https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/9/9c/S08_BillOverbeck_Portrait.png/revision/latest/scale-to-width-down/512?cb=20240517103047', probability: 0.1 },
  { text: 'Pig (rare)', description: 'Jogos Mortais/ Dbd', img: 'https://us.rule34.xxx//images/3359/ddffcd60c4376a6a0527160e3beb5d26.jpeg?3807105', probability: 0.001 },
  { text: 'Madeline', description: 'Celeste', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Celeste_character_Madeline.png/1200px-Celeste_character_Madeline.png', probability: 0.1 },
  { text: 'Mita', description: 'MiSide', img: 'https://static.wikia.nocookie.net/animeverso/images/3/3b/Mita_render.png/revision/latest?cb=20250202190439&path-prefix=pt-br', probability: 0.1 },
  { text: 'Doom Guy', description: 'DOOM', img: 'https://static.wikia.nocookie.net/deadliestfiction/images/7/73/Doomslayer.png/revision/latest/scale-to-width/360?cb=20200325231240', probability: 0.1 },
  { text: 'CJ', description: 'GTA SAN ANDREAS', img: 'https://static.wikia.nocookie.net/gta/images/7/70/CJ-GTASA.png/revision/latest/scale-to-width/360?cb=20170321232122&path-prefix=pt', probability: 0.1 },
  { text: 'Chicken', description: 'Super Chinken Jumper', img: 'https://static.wikia.nocookie.net/vsbattles/images/e/e1/Super_Chicken.png/revision/latest?cb=20231208230244', probability: 0.1 },
  { text: 'Kelvin', description: 'Sons of the Forest', img: 'https://static.wikia.nocookie.net/sonsoftheforest_gamepedia_en/images/9/9e/800px-Portrait_Kelvin.png/revision/latest?cb=20230312202422', probability: 0.1 },
  { text: 'John Marston', description: 'Red dead Redemption', img: 'https://static.wikia.nocookie.net/liberproeliis/images/7/70/John_marston_1401x788_a03b430b_5b3e_40de_a771_34383cba28db.webp/revision/latest?cb=20230704020542&path-prefix=pt-br', probability: 0.1 },
  { text: 'Ruben', description: 'Minecraft Story Mode', img: 'https://static.wikia.nocookie.net/minecraftstorymode/images/9/9c/Reuben_in_treehouse.png/revision/latest?cb=20240503185207', probability: 0.1 },
  { text: 'Eduardo', description: 'Duas Noites com Eduardo', img: 'https://tr.rbxcdn.com/180DAY-ca8dc84f435f84c7f2706fa6b641540c/420/420/Hat/Png/noFilter', probability: 0.1 },
  { text: 'Vizinho', description: 'Hello Neighbor', img: 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_400/ncom/pt_BR/games/switch/h/hello-neighbor-switch/description-image', probability: 0.1 },
]


////// end vars //////
//{text: '', description: '', img: '', probability: 0.1},
//////////////////////// Function //////////////////////////

export function selectRandomItem(items) {
  if (!items || items.length === 0) {
    console.error('A lista de itens está vazia ou é inválida.');
    return null;
  }

  // Normalizar probabilidades
  const totalProbability = items.reduce((sum, item) => sum + item.probability, 0);
  const normalizedItems = items.map(item => ({
    ...item,
    probability: item.probability / totalProbability,
  }));

  const random = Math.random();
  let sum = 0;

  console.log('Número aleatório gerado:', random);

  for (const item of normalizedItems) {
    sum += item.probability;

    if (random <= sum) {
      return { text: item.text, description: item.description, img: item.img };
    }
  }

  console.warn('Nenhum item foi selecionado. Retornando o primeiro item como fallback.');
  return {
    text: normalizedItems[0].text,
    description: normalizedItems[0].description,
    img: normalizedItems[0].img,
  };
};

export function createEmbed(color, title, description, thumbnail, image, footer) {

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
};

export function creatActionRow(numberButtons, customId, texto, disabled) {

  let action = new discord.ActionRowBuilder()

  for (let i = 0; i < numberButtons; i++) {
    action.addComponents(creatButtomRow(customId, texto, disabled));
  }

}

export function creatButtomRow(customId, texto, disabled){
  new discord.ButtonBuilder()
        .setCustomId(customId)
        .setLabel(texto)
        .setStyle(discord.ButtonStyle.Primary)
        .setDisabled(currentPage === disabled) // Desabilita o botão "Anterior" na primeira página
}



////////////////////// end Function ////////////////////////
