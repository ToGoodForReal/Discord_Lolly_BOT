import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { createEmbed } from '../../utils/embeds.js';
import { checkCooldown } from '../../utils/cooldown.js';

const activeGames = new Map<
  string,
  { target: number; attempts: number; min: number; max: number; guesses: number[]; timerId: ReturnType<typeof setTimeout> }
>();

export default {
  data: new SlashCommandBuilder()
    .setName('guess')
    .setDescription('Jogo de adivinhação — adivinhe o número que pensei!')
    .addIntegerOption((option) =>
      option.setName('maximo').setDescription('Número máximo para adivinhar (padrão: 100)').setRequired(false),
    )
    .addIntegerOption((option) =>
      option.setName('numero').setDescription('Seu palpite (use quando já tiver um jogo ativo)').setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const guessNumber = interaction.options.getInteger('numero');
    if (guessNumber !== null) {
      await handleGuess(interaction, guessNumber);
      return;
    }

    const cooldown = checkCooldown(interaction.user.id, 'guess', 2_000);
    if (cooldown.onCooldown) {
      await interaction.reply({
        embeds: [createEmbed('#ffaa00', '⏰ Calma aí!', `Aguarde ${cooldown.timeLeft}s antes de iniciar um novo jogo.`)],
        ephemeral: true,
      });
      return;
    }

    const userId = interaction.user.id;

    if (activeGames.has(userId)) {
      const gameData = activeGames.get(userId)!;
      await interaction.reply({
        embeds: [
          createEmbed(
            '#f39c12',
            '🎯 Jogo em Andamento',
            `Você já tem um jogo ativo!\n**Tentativas restantes:** ${gameData.attempts}\n**Dica:** entre ${gameData.min} e ${gameData.max}`,
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    const max = interaction.options.getInteger('maximo') ?? 100;
    const min = 1;

    if (max < 2 || max > 1_000) {
      await interaction.reply({
        embeds: [createEmbed('#ff6b6b', '❌ Valor Inválido', 'O número máximo deve estar entre 2 e 1000!')],
        ephemeral: true,
      });
      return;
    }

    const targetNumber = Math.floor(Math.random() * max) + min;
    const maxAttempts = Math.min(Math.ceil(Math.log2(max)) + 2, 10);

    const timerId = setTimeout(() => activeGames.delete(userId), 300_000);
    activeGames.set(userId, { target: targetNumber, attempts: maxAttempts, min, max, guesses: [], timerId });

    const embed = createEmbed(
      '#2ecc71',
      '🎯 Jogo de Adivinhação Iniciado!',
      `Pensei em um número entre **${min}** e **${max}**!\nVocê tem **${maxAttempts}** tentativas.\n\nUse \`/guess numero\` para chutar!`,
    );

    await interaction.reply({ embeds: [embed] });
  },
} as Command;

async function handleGuess(interaction: ChatInputCommandInteraction, guessNumber: number): Promise<void> {
  const userId = interaction.user.id;

  if (!activeGames.has(userId)) {
    await interaction.reply({
      embeds: [createEmbed('#ff6b6b', '❌ Nenhum Jogo Ativo', 'Use `/guess` para iniciar.')],
      ephemeral: true,
    });
    return;
  }

  const gameData = activeGames.get(userId)!;

  if (guessNumber < gameData.min || guessNumber > gameData.max) {
    await interaction.reply({
      embeds: [createEmbed('#ff6b6b', '❌ Número Inválido', `O número deve estar entre ${gameData.min} e ${gameData.max}!`)],
      ephemeral: true,
    });
    return;
  }

  gameData.attempts--;
  gameData.guesses.push(guessNumber);

  if (guessNumber === gameData.target) {
    clearTimeout(gameData.timerId);
    activeGames.delete(userId);
    await interaction.reply({
      embeds: [
        createEmbed(
          '#27ae60',
          '🎉 Parabéns! Você Acertou!',
          `O número era **${gameData.target}**!\nAcertou em **${gameData.guesses.length}** tentativa${gameData.guesses.length > 1 ? 's' : ''}!\n\n**Tentativas:** ${gameData.guesses.join(', ')}`,
        ),
      ],
    });
    return;
  }

  if (gameData.attempts === 0) {
    clearTimeout(gameData.timerId);
    activeGames.delete(userId);
    await interaction.reply({
      embeds: [
        createEmbed(
          '#e74c3c',
          '💔 Game Over!',
          `Tentativas acabaram!\nO número era **${gameData.target}**.\n\n**Tentativas:** ${gameData.guesses.join(', ')}`,
        ),
      ],
    });
    return;
  }

  const hint =
    guessNumber < gameData.target
      ? `📈 **Muito baixo!** Maior que ${guessNumber}.`
      : `📉 **Muito alto!** Menor que ${guessNumber}.`;

  await interaction.reply({
    embeds: [
      createEmbed(
        '#f39c12',
        '🎯 Continue Tentando!',
        `${hint}\n\n**Tentativas restantes:** ${gameData.attempts}\n**Tentativas:** ${gameData.guesses.join(', ')}`,
      ),
    ],
  });
}
