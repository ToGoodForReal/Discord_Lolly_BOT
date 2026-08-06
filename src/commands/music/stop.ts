import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { useQueue } from 'discord-player';
import { createEmbed } from '../../utils/embeds.js';
import { BOT } from '../../config/constants.js';

function inVoiceChannel(interaction: ChatInputCommandInteraction): boolean {
  const member = interaction.member;
  if ('voice' in member! && member!.voice) return !!member!.voice.channel;
  return false;
}

export default {
  data: new SlashCommandBuilder().setName('stop').setDescription('Para e limpa a fila atual'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!inVoiceChannel(interaction)) return;
    const queue = useQueue(interaction.guildId!);
    if (!queue) return;

    try {
      queue.delete();
      const embed = createEmbed('#fff4ce', 'Paro-Paro-Paro!', 'Manual do Mundo não me processa 👌', BOT.stopThumbnail);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro no stop:', error);
      await interaction.reply({ content: '❌ Erro ao parar a música.', ephemeral: true });
    }
  },
} as Command;
