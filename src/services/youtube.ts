import { config } from '../config/env.js';

interface ChannelSearchResult {
  channelId: string;
  thumbnailUrl: string;
}

export async function searchChannelThumbnail(channelName: string): Promise<ChannelSearchResult | null> {
  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(channelName)}&type=channel&key=${config.apiKey}`;
    const searchResponse = await fetch(searchUrl, { signal: AbortSignal.timeout(10_000) });
    const searchData = (await searchResponse.json()) as { items?: Array<{ id?: { channelId?: string } }> };

    const channelId = searchData.items?.[0]?.id?.channelId;
    if (!channelId) return null;

    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${config.apiKey}`;
    const channelResponse = await fetch(channelUrl, { signal: AbortSignal.timeout(10_000) });
    const channelData = (await channelResponse.json()) as {
      items?: Array<{ snippet?: { thumbnails?: { default?: { url: string } } } }>;
    };

    const thumbnailUrl = channelData.items?.[0]?.snippet?.thumbnails?.default?.url;
    if (!thumbnailUrl) return null;

    return { channelId, thumbnailUrl };
  } catch (error) {
    console.warn('Erro ao buscar thumbnail do canal:', error);
    return null;
  }
}
