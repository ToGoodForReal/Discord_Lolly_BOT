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
  data: new SlashCommandBuilder().setName('clear').setDescription('Limpa a fila atual'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!inVoiceChannel(interaction)) return;
    const queue = useQueue(interaction.guildId!);
    if (!queue) return;

    queue.tracks.clear();

    const embed = createEmbed('#fff4ce', 'Playlist Limpa!', 'Pode começar uma nova do zero 👌', BOT.thumbnailUrl);
    await interaction.reply({ embeds: [embed] });
  },
} as Command;
