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
  data: new SlashCommandBuilder().setName('skip').setDescription('Pula para próxima música da fila atual'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!inVoiceChannel(interaction)) return;
    const queue = useQueue(interaction.guildId!);
    if (!queue) return;

    try {
      queue.node.skip();
      const embed = createEmbed('#fff4ce', 'Okay! Pulando para a próxima música', 'A música foi **PULADA**', BOT.thumbnailUrl);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro no skip:', error);
      await interaction.reply({ content: '❌ Erro ao pular a música.', ephemeral: true });
    }
  },
} as Command;
