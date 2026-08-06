import type { ChatInputCommandInteraction } from 'discord.js';
import type { SlashCommandBuilder } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
