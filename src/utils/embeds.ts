import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type APIEmbedFooter,
} from 'discord.js';

function hexToInteger(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}

export function createEmbed(
  color: number | string,
  title: string,
  description: string,
  thumbnail?: string | null,
  image?: string | null,
  footer?: APIEmbedFooter,
): EmbedBuilder {
  const colorValue = typeof color === 'string' && color.startsWith('#') ? hexToInteger(color) : color;
  // discord.js v14 EmbedBuilder does NOT accept empty strings for setDescription
  // Convert empty strings to null to avoid crashes
  const safeDescription = description || null;

  const embed = new EmbedBuilder()
    .setColor(colorValue as number)
    .setTitle(title)
    .setDescription(safeDescription as string);

  if (thumbnail) embed.setThumbnail(thumbnail);
  if (image) embed.setImage(image);
  if (footer && footer.text) embed.setFooter(footer);

  return embed;
}

export function createButtonRow(customId: string, label: string, disabled = false): ButtonBuilder {
  return new ButtonBuilder().setCustomId(customId).setLabel(label).setStyle(ButtonStyle.Primary).setDisabled(disabled);
}

export function createActionRow(
  count: number,
  customId: string,
  label: string,
  disabled = false,
): ActionRowBuilder<ButtonBuilder> {
  const row = new ActionRowBuilder<ButtonBuilder>();
  for (let i = 0; i < count; i++) {
    row.addComponents(createButtonRow(customId, label, disabled));
  }
  return row;
}
