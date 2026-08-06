import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { createEmbed } from '../../utils/embeds.js';
import { checkCooldown } from '../../utils/cooldown.js';
import { EIGHTBALL_RESPONSES } from '../../utils/data/eightball.js';

export default {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Faça uma pergunta para a bola 8 mágica!')
    .addStringOption((option) => option.setName('pergunta').setDescription('Sua pergunta para a bola 8').setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const cooldown = checkCooldown(interaction.user.id, '8ball', 3_000);
    if (cooldown.onCooldown) {
      await interaction.reply({
        embeds: [createEmbed('#ffaa00', '⏰ Calma aí!', `Aguarde ${cooldown.timeLeft}s antes de perguntar novamente.`)],
        ephemeral: true,
      });
      return;
    }

    const question = interaction.options.getString('pergunta')!;
    const response = EIGHTBALL_RESPONSES[Math.floor(Math.random() * EIGHTBALL_RESPONSES.length)];
    const embed = createEmbed('#9b59b6', '🎱 Bola 8 Mágica', `**Pergunta:** ${question}\n\n**Resposta:** ${response}`);

    await interaction.reply({ embeds: [embed] });
  },
} as Command;
