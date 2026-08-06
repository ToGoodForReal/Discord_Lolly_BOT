import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { createEmbed } from '../../utils/embeds.js';
import { checkCooldown } from '../../utils/cooldown.js';
import { CHARACTERS } from '../../utils/data/characters.js';

export default {
  data: new SlashCommandBuilder().setName('character').setDescription('Mostra um personagem de anime aleatório'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const cooldown = checkCooldown(interaction.user.id, 'character', 3_000);
    if (cooldown.onCooldown) {
      await interaction.reply({
        embeds: [createEmbed('#ffaa00', '⏰ Calma aí!', `Aguarde ${cooldown.timeLeft}s antes de pedir outro personagem.`)],
        ephemeral: true,
      });
      return;
    }

    const character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]!;
    const embed = createEmbed(
      '#9b59b6',
      '🎭 Personagem Aleatório',
      `**Nome:** ${character.name}\n**Anime:** ${character.anime}\n**Descrição:** ${character.description}`,
    );

    await interaction.reply({ embeds: [embed] });
  },
} as Command;
