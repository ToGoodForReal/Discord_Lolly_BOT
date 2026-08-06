import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { useQueue } from 'discord-player';
import { createEmbed } from '../../utils/embeds.js';

function inVoiceChannel(interaction: ChatInputCommandInteraction): boolean {
  const member = interaction.member;
  if ('voice' in member! && member!.voice) return !!member!.voice.channel;
  return false;
}

export default {
  data: new SlashCommandBuilder().setName('queue').setDescription('Mostra a fila atual de músicas'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!inVoiceChannel(interaction)) return;
    const queue = useQueue(interaction.guildId!);
    if (!queue) return;

    try {
      const history = queue.history.tracks.toArray().map((track: { title: string }, i: number) => `${i + 1}. ${track.title}`);
      const next = queue.tracks.toArray().map((track: { title: string }, i: number) => `${history.length + i + 1}. ${track.title}`);
      const current = queue.currentTrack ? [`> ${queue.currentTrack.title}`] : [];
      const list = [...history, ...current, ...next];

      const itemsPerPage = 10;
      let currentPage = 0;
      const totalPages = Math.max(1, Math.ceil(list.length / itemsPerPage));

      const generateEmbed = (page: number) => {
        const start = page * itemsPerPage;
        const pageTracks = list.slice(start, start + itemsPerPage);
        return createEmbed(
          '#dbffff',
          `Fila em ${interaction.guild!.name}`,
          pageTracks.length > 0 ? `**Lista:**\n${pageTracks.join('\n')}` : '**Fila vazia**',
          undefined,
          undefined,
          { text: `Página ${page + 1} de ${totalPages}` },
        );
      };

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('prev').setLabel('⬅ Anterior').setStyle(ButtonStyle.Primary).setDisabled(currentPage === 0),
        new ButtonBuilder().setCustomId('next').setLabel('Próximo ➡').setStyle(ButtonStyle.Primary).setDisabled(currentPage >= totalPages - 1),
      );

      const reply = await interaction.reply({ embeds: [generateEmbed(currentPage)], components: [row] });

      const collector = reply.createMessageComponentCollector({ time: 60_000 });

      collector.on('collect', async (i) => {
        if (i.user.id !== interaction.user.id) return;

        if (i.customId === 'prev') currentPage--;
        else if (i.customId === 'next') currentPage++;

        const prevBtn = row.components[0] as ButtonBuilder;
        const nextBtn = row.components[1] as ButtonBuilder;
        prevBtn.setDisabled(currentPage === 0);
        nextBtn.setDisabled(currentPage >= totalPages - 1);

        await i.update({ embeds: [generateEmbed(currentPage)], components: [row] });
      });

      collector.on('end', async () => {
        try {
          await interaction.editReply({ components: [] });
        } catch {
          // Expired
        }
      });
    } catch (error) {
      console.error('Erro no queue:', error);
      await interaction.reply({ content: '❌ Erro ao buscar a fila.', ephemeral: true });
    }
  },
} as Command;
