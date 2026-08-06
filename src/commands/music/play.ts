import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import type { Player } from 'discord-player';
import { createEmbed } from '../../utils/embeds.js';
import { DEFAULT_VOLUME, LEAVE_ON_EMPTY_COOLDOWN, LEAVE_ON_END_COOLDOWN } from '../../config/constants.js';

let playerRef: Player | null = null;

export function setPlayer(p: Player): void {
  playerRef = p;
}

function inVoiceChannel(interaction: ChatInputCommandInteraction): boolean {
  const member = interaction.member!;
  if ('voice' in member && member.voice) {
    return !!member.voice.channel;
  }
  return false;
}

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Selecione uma música e comece a escutar!')
    .addStringOption((option) =>
      option.setName('url').setDescription('URL ou nome da música que deseja tocar').setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!inVoiceChannel(interaction)) {
      await interaction.reply({
        embeds: [createEmbed('#ff6b6b', '❌ Canal de Voz Necessário', 'Você precisa estar em um canal de voz!')],
        ephemeral: true,
      });
      return;
    }

    // Check if bot is in a voice channel but different from user
    const guildMe = interaction.guild!.members.me;
    const userVoiceChannel = (interaction.member! as { voice: { channelId?: string | null } }).voice?.channelId;
    const botVoiceChannel = guildMe!.voice?.channelId;

    if (botVoiceChannel && botVoiceChannel !== userVoiceChannel) {
      await interaction.reply({
        embeds: [createEmbed('#ff6b6b', '❌ Canal Diferente', 'Você precisa estar no mesmo canal de voz que eu!')],
        ephemeral: true,
      });
      return;
    }

    const query = interaction.options.getString('url')!;
    if (!query.trim()) {
      await interaction.reply({
        embeds: [createEmbed('#ff6b6b', '❌ Parâmetro Necessário', 'Me dê algo para buscar!')],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    const player = playerRef;
    if (!player) {
      await interaction.editReply({ content: '❌ Player não inicializado.' });
      return;
    }

    const searchResult = await player.search(query, { requestedBy: interaction.user });

    if (!searchResult.hasTracks()) {
      await interaction.editReply({
        embeds: [createEmbed('#ff9500', '🔍 Nenhum Resultado', `Não encontrei resultados para: **${query}**`)],
      });
      return;
    }

    const member = interaction.member!;
    const voiceChannel = 'voice' in member && member.voice ? member.voice.channel : null;

    try {
      await player.play(voiceChannel!, searchResult, {
        nodeOptions: {
          metadata: { channel: interaction.channel, client: interaction.guild!.members.me, requestedBy: interaction.user },
          selfDeaf: true,
          volume: DEFAULT_VOLUME,
          leaveOnEmpty: true,
          leaveOnEmptyCooldown: LEAVE_ON_EMPTY_COOLDOWN,
          leaveOnEnd: true,
          leaveOnEndCooldown: LEAVE_ON_END_COOLDOWN,
          connectionTimeout: 30_000,
        },
      });

      const queue = player.queues.get(interaction.guild!.id);
      const currentTrack = queue?.currentTrack;
      const trackTitle = currentTrack?.title ?? query;
      const embed = createEmbed('#4ade80', '🎵 Tocando Agora!', `**${trackTitle}**`);
      await interaction.editReply({ embeds: [embed] });
    } catch (err: unknown) {
      const error = err as Error;
      console.error('  ✗ Erro durante player.play:', error);
      const errorEmbed = createEmbed('#ff6b6b', '❌ Falha ao Tocar Música', `Não foi possível iniciar a reprodução: **${error.message ?? 'Erro desconhecido'}**`);
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
} as Command;
