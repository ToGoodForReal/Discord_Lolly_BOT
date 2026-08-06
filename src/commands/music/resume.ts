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
  data: new SlashCommandBuilder().setName('resume').setDescription('Retoma a música pausada'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!inVoiceChannel(interaction)) return;
    const queue = useQueue(interaction.guildId!);
    if (!queue) return;

    if (queue.node.isPaused()) {
      queue.node.resume();
      const embed = createEmbed('#dbffff', 'Voltando à Festa! Oh Yeah', '☆*: .｡. o(≧▽≦)o .｡.:*☆', BOT.thumbnailUrl);
      await interaction.reply({ embeds: [embed] });
    } else {
      const embed = createEmbed('#d88588', 'Eu não sou Adivinha', 'Mas acho que já está tocando!');
      await interaction.reply({ embeds: [embed] });
    }
  },
} as Command;
