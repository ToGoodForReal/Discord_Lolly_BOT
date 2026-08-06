import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { createEmbed } from '../../utils/embeds.js';

const pingResponses = ['Pong! 🏓', 'Estou aqui! 👋', 'Oi! Como posso ajudar? 😊', 'Pong pong! 🎾', 'Aqui estou eu! ✨'];

export default {
  data: new SlashCommandBuilder().setName('ping').setDescription('Mostra a latência do bot'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      const sent = await interaction.reply({ content: 'Calculando ping...', fetchReply: true });
      const latency = sent.createdTimestamp - interaction.createdTimestamp;
      const apiLatency = Math.round(interaction.client.ws.ping);
      const response = pingResponses[Math.floor(Math.random() * pingResponses.length)];

      const embed = createEmbed('#00ff00', '🏓 Pong!', `${response}\n\n📡 **Latência:** ${latency}ms\n🌐 **API:** ${apiLatency}ms`);
      await interaction.editReply({ content: '', embeds: [embed] });
    } catch (error) {
      console.error('Erro no comando ping:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: '❌ Ocorreu um erro.', ephemeral: true });
      }
    }
  },
} as Command;
