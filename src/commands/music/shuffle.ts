import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { useQueue } from 'discord-player';
import { createEmbed } from '../../utils/embeds.js';
import { BOT } from '../../config/constants.js';

export default {
  data: new SlashCommandBuilder().setName('shuffle').setDescription('Embaralha a fila de músicas'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const queue = useQueue(interaction.guildId!);
    if (!queue) return;

    queue.tracks.shuffle();

    if (queue.tracks.size < 2) {
      await interaction.reply({
        embeds: [createEmbed('#dbffff', 'Fila muito pequena!', 'Adicione mais músicas! （￣︶￣）↗', BOT.thumbnailUrl)],
      });
      return;
    }

    const embed = createEmbed(
      '#db8a8f',
      'Embaralhando a Playlist',
      `${queue.tracks.size} músicas aleatorizadas. Use /queue para ver a nova ordem.`,
      BOT.thumbnailUrl,
    );
    await interaction.reply({ embeds: [embed] });
  },
} as Command;
