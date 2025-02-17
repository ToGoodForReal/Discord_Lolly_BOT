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

////// end vars //////

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


module.exports = RockPaperScissors, replyItems, selectRandomItem;