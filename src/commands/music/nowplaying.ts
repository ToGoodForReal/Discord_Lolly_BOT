import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { useQueue } from 'discord-player';
import { createEmbed } from '../../utils/embeds.js';
import { BOT } from '../../config/constants.js';

export default {
  data: new SlashCommandBuilder().setName('nowplaying').setDescription('Mostra a música que está tocando'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const queue = useQueue(interaction.guildId!);
    if (!queue) return;

    const currentTrack = queue.currentTrack;
    if (!currentTrack) {
      await interaction.reply({ content: 'Não há música tocando no momento.', ephemeral: true });
      return;
    }

    const embed = createEmbed(
      '#dbffff',
      'Tocando **agora**:',
      `**${currentTrack.title}** — ${currentTrack.author}\n\n⏱️ ${currentTrack.duration}`,
      BOT.thumbnailUrl,
      currentTrack.thumbnail ?? null,
    );
    await interaction.reply({ embeds: [embed] });
  },
} as Command;
