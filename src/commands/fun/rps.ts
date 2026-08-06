import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { createEmbed } from '../../utils/embeds.js';
import { checkCooldown } from '../../utils/cooldown.js';
import { rockPaperScissors, CHOICES } from '../../utils/games.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Jogue pedra, papel ou tesoura!')
    .addStringOption((option) =>
      option
        .setName('escolha')
        .setDescription('Escolha entre pedra, papel ou tesoura!')
        .setRequired(true)
        .addChoices(
          { name: 'Pedra', value: 'pedra' },
          { name: 'Papel', value: 'papel' },
          { name: 'Tesoura', value: 'tesoura' },
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const cooldown = checkCooldown(interaction.user.id, 'rps', 2_000);
    if (cooldown.onCooldown) {
      await interaction.reply({
        embeds: [createEmbed('#ffaa00', '⏰ Calma aí!', `Aguarde ${cooldown.timeLeft}s antes de jogar novamente.`)],
        ephemeral: true,
      });
      return;
    }

    const userChoice = interaction.options.getString('escolha') as (typeof CHOICES)[number];
    const result = rockPaperScissors(userChoice);

    const embed = createEmbed(
      '#4ecdc4',
      '🎮 Pedra, Papel, Tesoura!',
      `**Você:** ${result.userChoice}\n**Eu:** ${result.botChoice}\n\n**${result.result}**`,
    );

    await interaction.reply({ embeds: [embed] });
  },
} as Command;
