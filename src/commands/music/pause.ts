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
  data: new SlashCommandBuilder().setName('pause').setDescription('Pausa a música atual'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!inVoiceChannel(interaction)) return;
    const queue = useQueue(interaction.guildId!);
    if (!queue) return;

    if (queue.node.isPaused()) {
      await interaction.reply({
        embeds: [createEmbed('#d88588', 'Já está pausada!', 'A não ser que você quer pausar 2x?')],
      });
      return;
    }

    queue.node.pause();
    const embed = createEmbed('#fff4ce', 'Vou pausar pra princesa =_= ', 'A música foi **PAUSADA**', BOT.thumbnailUrl);
    await interaction.reply({ embeds: [embed] });
  },
} as Command;
