import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { BOT } from '../../config/constants.js';

export default {
  data: new SlashCommandBuilder().setName('invite').setDescription('Link para convidar o bot'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply(`🔗 **Use este link para me convidar:** ${BOT.inviteLink}`);
  },
} as Command;
