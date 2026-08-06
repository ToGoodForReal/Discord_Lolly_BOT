import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { useQueue, QueueRepeatMode } from 'discord-player';
import { createEmbed } from '../../utils/embeds.js';
import { BOT } from '../../config/constants.js';

const LOOP_MODE_LABELS = ['Desativado', 'Música', 'Playlist', 'Autoplay'];

export default {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Altera o modo de loop')
    .addIntegerOption((option) =>
      option
        .setName('modo')
        .setDescription('Ative/troque o Loop')
        .setRequired(true)
        .addChoices(
          { name: 'Off', value: QueueRepeatMode.OFF },
          { name: 'Música', value: QueueRepeatMode.TRACK },
          { name: 'Playlist', value: QueueRepeatMode.QUEUE },
          { name: 'Autoplay', value: QueueRepeatMode.AUTOPLAY },
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const queue = useQueue(interaction.guildId!);
    if (!queue) {
      await interaction.reply({ content: '❌ Não há nenhuma fila de música tocando neste servidor.', ephemeral: true });
      return;
    }

    const rawValue = interaction.options.get('modo')?.value;
    const loopMode = Number(rawValue) as QueueRepeatMode;

    try {
      queue.setRepeatMode(loopMode);
      const idx = [QueueRepeatMode.OFF, QueueRepeatMode.TRACK, QueueRepeatMode.QUEUE, QueueRepeatMode.AUTOPLAY].indexOf(loopMode);
      const label = idx !== -1 ? LOOP_MODE_LABELS[idx] : 'Desconhecido';
      const embed = createEmbed('#dbffff', 'Hora do Loop', `Loop alterado para: **${label}**`, BOT.thumbnailUrl);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao definir loop:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: '❌ Erro ao alterar o modo de loop.', ephemeral: true }).catch(() => {});
      }
    }
  },
} as Command;
