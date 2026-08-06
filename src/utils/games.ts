const CHOICES = ['pedra', 'papel', 'tesoura'] as const;
type Choice = (typeof CHOICES)[number];

const EMOJIS: Record<Choice, string> = {
  pedra: '🪨',
  papel: '📄',
  tesoura: '✂️',
};

interface RPSResult {
  userChoice: string;
  botChoice: string;
  result: string;
}

export function rockPaperScissors(userChoice: Choice): RPSResult {
  const botChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)]!;

  let result: string;
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
    userChoice: `${EMOJIS[userChoice]} ${userChoice}`,
    botChoice: `${EMOJIS[botChoice]} ${botChoice}`,
    result,
  };
}

export { CHOICES };
