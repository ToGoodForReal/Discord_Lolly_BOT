import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { createEmbed } from '../../utils/embeds.js';
import { checkCooldown } from '../../utils/cooldown.js';
import { DAD_JOKES } from '../../utils/data/jokes.js';

export default {
  data: new SlashCommandBuilder().setName('joke').setDescription('Receba uma piada do papai para dar risada!'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const cooldown = checkCooldown(interaction.user.id, 'joke', 2_000);
    if (cooldown.onCooldown) {
      await interaction.reply({
        embeds: [createEmbed('#ffaa00', '⏰ Calma aí!', `Aguarde ${cooldown.timeLeft}s antes de pedir outra piada.`)],
        ephemeral: true,
      });
      return;
    }

    const joke = DAD_JOKES[Math.floor(Math.random() * DAD_JOKES.length)]!;
    const embed = createEmbed('#f1c40f', '😄 Piada do Papai', joke);

    await interaction.reply({ embeds: [embed] });
  },
} as Command;
