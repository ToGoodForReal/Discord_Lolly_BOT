import { Client } from 'discord.js';
import { Player } from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import youtubeDlExec from 'youtube-dl-exec';
import { Readable } from 'stream';
import { createEmbed } from '../utils/embeds.js';
import { searchChannelThumbnail } from '../services/youtube.js';
import { setPlayer } from '../commands/music/play.js';
import type { GuildQueue } from 'discord-player';

/**
 * Custom stream function that uses youtube-dl-exec WITHOUT jsRuntimes.
 *
 * The built-in generateStreamWithYoutubeDL in discord-player-youtubei passes
 * jsRuntimes: 'node' which adds --js-runtimes node to yt-dlp. This flag
 * causes YouTube to return 403 Forbidden on modern yt-dlp versions because
 * yt-dlp now has its own built-in JavaScript interpreter (rqbit) and doesn't
 * need external runtimes. The --js-runtimes flag actually breaks the request.
 */
async function createStream(
  track: { url?: string; isLive?: boolean },
  _youtubei: unknown,
): Promise<string | Readable> {
  const url = track?.url;
  if (!url) throw new Error('createStream: no URL provided');

  const videoFormat = track?.isLive ? 'best[height<=360]' : 'bestaudio/best';

  console.log(`  🎵 Extracting stream: ${url}`);

  const execOptions: Record<string, unknown> = {
    format: videoFormat,
    output: '-',
    noWarnings: true,
    noProgress: true,
    noPlaylist: true,
    bufferSize: '1M',
  };

  const process_ = youtubeDlExec.exec(url, execOptions);

  process_.stderr?.resume();

  process_.catch((err: Error) => {
    console.error(`  ✗ Stream extraction error: ${err.message}`);
  });

  const stream = process_.stdout;
  if (!stream) throw new Error('createStream: no stdout from yt-dlp');

  stream.once('data', (chunk: Buffer) => {
    console.log(`  ✓ Stream áudio recebido (${chunk.length} bytes)`);
  });

  const killProcess = () => !process_.killed && process_.kill();
  stream.on('close', killProcess);
  stream.on('error', killProcess);
  stream.on('end', killProcess);

  return stream;
}

export function createPlayer(client: Client): Player {
  const player = new Player(client, {});
  setPlayer(player);

  player.extractors
    .loadMulti(DefaultExtractors)
    .then(() => {
      return player.extractors.register(YoutubeiExtractor, {
        overrideBridgeMode: 'yt',
        createStream,
      });
    })
    .then(() => {
      console.log('  ✓ Extratores do discord-player e Extractor YouTube carregados');
    })
    .catch((error: unknown) => {
      console.error('  ✗ Erro ao carregar extratores:', error);
    });

  player.events.on('playerStart', (_queue: GuildQueue, track: unknown) => {
    const t = track as { title?: string };
    console.log(`  ▶ Tocando: ${t.title ?? 'desconhecida'}`);
  });

  player.events.on('audioTrackAdd', async (queue: GuildQueue, track: unknown) => {
    const t = track as {
      title?: string;
      author?: string;
      duration?: string;
      url?: string;
      thumbnail?: string;
    };

    const channelInfo = t.author ? await searchChannelThumbnail(t.author) : null;
    const volume = queue.node.volume;

    const embed = createEmbed(
      '#dbffff',
      t.title ?? 'Música',
      `**${t.title ?? 'Música'}** foi adicionado à fila!`,
      null,
      t.thumbnail ?? null,
    );

    embed.addFields(
      { name: 'Duração', value: t.duration ?? '∞', inline: true },
      { name: 'Volume', value: `${volume}%`, inline: true },
      { name: 'URL', value: t.url ?? 'N/A' },
    );

    if (channelInfo && t.author) {
      embed.setFooter({ text: t.author, iconURL: channelInfo.thumbnailUrl });
    } else if (t.author) {
      embed.setFooter({ text: t.author });
    }

    embed.setTimestamp();
    queue.metadata.channel.send({ embeds: [embed] }).catch((err: Error) => {
      console.error(`  ✗ Erro ao enviar audioTrackAdd: ${err.message}`);
    });
  });

  player.events.on('audioTracksAdd', (queue: GuildQueue) => {
    const embed = createEmbed('#dbffff', 'Adicionando à Playlist', 'Faixas adicionadas com sucesso!');
    queue.metadata.channel.send({ embeds: [embed] }).catch((err: Error) => {
      console.error(`  ✗ Erro ao enviar audioTracksAdd: ${err.message}`);
    });
  });

  player.events.on('playerSkip', (_queue: GuildQueue, track: unknown) => {
    const t = track as { title?: string };
    console.log(`  ⏭ Skip: ${t.title ?? 'desconhecida'}`);
  });

  player.events.on('playerFinish', (queue: GuildQueue, track: unknown) => {
    const t = track as { title?: string };
    console.log(`  ✓ Finalizada: ${t.title ?? 'desconhecida'}`);
  });

  player.events.on('playerPause', (_queue: GuildQueue) => {
    console.log('  ⏸ Player pausado');
  });

  player.events.on('playerResume', (_queue: GuildQueue) => {
    console.log('  ▶ Player retomado');
  });

  player.events.on('emptyQueue', (queue: GuildQueue) => {
    console.log('  🗑 Fila vazia - emptyQueue event');
    const embed = createEmbed('#d9878d', 'Moço ( •̀ ω •́ )✧', 'Cabou as músicas!');
    queue.metadata.channel.send({ embeds: [embed] }).catch((err: Error) => {
      console.error(`  ✗ Erro ao enviar emptyQueue: ${err.message}`);
    });
  });

  player.events.on('disconnect', (queue: GuildQueue) => {
    console.log('  🔌 Disconnect event');
    const embed = createEmbed('#fff4ce', 'Saindo por agora, bye bye (～￣▽￣)～', 'Até a próxima! 🎵');
    queue.metadata.channel.send({ embeds: [embed] }).catch((err: Error) => {
      console.error(`  ✗ Erro ao enviar mensagem de disconnect: ${err.message}`);
    });
  });

  player.events.on('emptyChannel', (queue: GuildQueue) => {
    console.log('  🚪 Canal vazio - emptyChannel event');
    queue.metadata.channel.send('Me abandonaram aqui, sacanagem viu >:( ').catch((err: Error) => {
      console.error(`  ✗ Erro ao enviar emptyChannel: ${err.message}`);
    });
  });

  player.events.on('error', (queue: GuildQueue, error: Error) => {
    console.error(`  ✗ Player error: ${error.message}`);
    console.error(`     Stack: ${error.stack ?? 'no stack'}`);
    if (queue?.metadata?.channel) {
      console.error(`     Guild: ${queue.guild?.name ?? 'unknown'}`);
    }
  });

  player.events.on('playerError', (queue: GuildQueue, error: Error) => {
    console.error(`  ✗ Player audio error: ${error.message}`);
    console.error(`     Stack: ${error.stack ?? 'no stack'}`);
    if (queue?.metadata?.channel) {
      const embed = createEmbed('#ff6b6b', '❌ Erro de Reprodução', `Ocorreu um erro ao tocar esta faixa: **${error.message}**`);
      queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
    }
    try {
      queue.node.skip();
    } catch {
      // ignore skip error
    }
  });

  return player;
}
