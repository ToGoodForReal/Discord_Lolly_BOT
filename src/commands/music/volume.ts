import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { useQueue } from 'discord-player';
import { createEmbed } from '../../utils/embeds.js';
import { BOT, VOLUME_MAX } from '../../config/constants.js';

export default {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Altere o volume das músicas')
    .addIntegerOption((option) =>
      option.setName('vol').setDescription(`Volume desejado (0-${VOLUME_MAX})`).setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const queue = useQueue(interaction.guildId!);
    if (!queue) {
      await interaction.reply({ content: 'A fila está vazia, **BIZONHO** O.O', ephemeral: true });
      return;
    }

    const volumeVal = interaction.options.getInteger('vol')!;
    if (isNaN(volumeVal) || volumeVal < 0 || volumeVal > VOLUME_MAX) {
      await interaction.reply({ content: `Forneça um valor entre 0 e ${VOLUME_MAX}.`, ephemeral: true });
      return;
    }

    try {
      await queue.node.setVolume(volumeVal);
      const embed = createEmbed('#d88588', `Volume: **${volumeVal}%**!`, 'Volume alterado', BOT.stopThumbnail);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao definir volume:', error);
      await interaction.reply({ content: '❌ Erro ao definir o volume.', ephemeral: true });
    }
  },
} as Command;
