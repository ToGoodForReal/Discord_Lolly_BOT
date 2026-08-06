import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { createEmbed } from '../../utils/embeds.js';
import { checkCooldown } from '../../utils/cooldown.js';

export default {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Role dados com número personalizado de lados')
    .addIntegerOption((option) => option.setName('lados').setDescription('Número de lados do dado (2-100)').setRequired(false))
    .addIntegerOption((option) => option.setName('quantidade').setDescription('Quantos dados rolar (1-10)').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const cooldown = checkCooldown(interaction.user.id, 'dice', 1_000);
    if (cooldown.onCooldown) {
      await interaction.reply({
        embeds: [createEmbed('#ffaa00', '⏰ Calma aí!', `Aguarde ${cooldown.timeLeft}s antes de rolar novamente.`)],
        ephemeral: true,
      });
      return;
    }

    const sides = interaction.options.getInteger('lados') ?? 6;
    const quantity = interaction.options.getInteger('quantidade') ?? 1;

    if (sides < 2 || sides > 100) {
      await interaction.reply({
        embeds: [createEmbed('#ff6b6b', '❌ Valor Inválido', 'O dado deve ter entre 2 e 100 lados!')],
        ephemeral: true,
      });
      return;
    }
    if (quantity < 1 || quantity > 10) {
      await interaction.reply({
        embeds: [createEmbed('#ff6b6b', '❌ Quantidade Inválida', 'Você pode rolar entre 1 e 10 dados!')],
        ephemeral: true,
      });
      return;
    }

    const results: number[] = [];
    let total = 0;
    for (let i = 0; i < quantity; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      results.push(roll);
      total += roll;
    }

    const diceEmoji = sides === 6 ? '🎲' : '🔢';
    let description = `${diceEmoji} **Resultado${quantity > 1 ? 's' : ''}:** ${results.join(', ')}`;
    if (quantity > 1) description += `\n\n📊 **Total:** ${total}`;

    const embed = createEmbed(
      '#e74c3c',
      `🎲 Rolando ${quantity} dado${quantity > 1 ? 's' : ''} de ${sides} lado${sides > 1 ? 's' : ''}`,
      description,
    );

    await interaction.reply({ embeds: [embed] });
  },
} as Command;
