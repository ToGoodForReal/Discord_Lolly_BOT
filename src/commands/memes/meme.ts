import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { createEmbed } from '../../utils/embeds.js';
import { checkCooldown } from '../../utils/cooldown.js';
import { MEME_GIFS } from '../../utils/data/meme-gifs.js';

export default {
  data: new SlashCommandBuilder().setName('meme').setDescription('Receba um meme aleatório para alegrar seu dia!'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const cooldown = checkCooldown(interaction.user.id, 'meme', 3_000);
    if (cooldown.onCooldown) {
      await interaction.reply({
        embeds: [createEmbed('#ffaa00', '⏰ Calma aí!', `Aguarde ${cooldown.timeLeft}s antes de pedir outro meme.`)],
        ephemeral: true,
      });
      return;
    }

    const randomGif = MEME_GIFS[Math.floor(Math.random() * MEME_GIFS.length)];
    const embed = createEmbed('#ff6b35', '😂 Meme Aleatório', 'Aqui está um meme para alegrar seu dia!', null, randomGif);

    await interaction.reply({ embeds: [embed] });
  },
} as Command;
