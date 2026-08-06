import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../_types.js';
import { createEmbed } from '../../utils/embeds.js';
import { checkCooldown } from '../../utils/cooldown.js';
import { TRIVIA_QUESTIONS } from '../../utils/data/trivia.js';

export default {
  data: new SlashCommandBuilder().setName('trivia').setDescription('Responda uma pergunta de trivia!'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const cooldown = checkCooldown(interaction.user.id, 'trivia', 5_000);
    if (cooldown.onCooldown) {
      await interaction.reply({
        embeds: [createEmbed('#ffaa00', '⏰ Calma aí!', `Aguarde ${cooldown.timeLeft}s antes de uma nova pergunta.`)],
        ephemeral: true,
      });
      return;
    }

    const idx = Math.floor(Math.random() * TRIVIA_QUESTIONS.length);
    const question = TRIVIA_QUESTIONS[idx]!;

    const embed = createEmbed(
      '#3498db',
      '🧠 Pergunta de Trivia',
      `**${question.question}**\n\n${question.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`,
    );

    const buttons = question.options.map((_, i) =>
      new ButtonBuilder().setCustomId(`trivia_${i}`).setLabel(`${i + 1}`).setStyle(ButtonStyle.Primary),
    );
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

    const reply = await interaction.reply({ embeds: [embed], components: [row] });

    const collector = reply.createMessageComponentCollector({ time: 15_000 });

    collector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.user.id !== interaction.user.id) {
        await buttonInteraction.reply({ content: 'Esta pergunta não é para você!', ephemeral: true });
        return;
      }

      const selectedIndex = parseInt(buttonInteraction.customId.split('_')[1]!, 10);
      const isCorrect = selectedIndex === question.correct;

      const resultEmbed = createEmbed(
        isCorrect ? '#27ae60' : '#e74c3c',
        isCorrect ? '✅ Correto!' : '❌ Incorreto!',
        `**Sua resposta:** ${question.options[selectedIndex]!}\n**Resposta correta:** ${question.options[question.correct]!}\n\n${question.explanation}`,
      );

      await buttonInteraction.update({ embeds: [resultEmbed], components: [] });
    });

    collector.on('end', async (collected) => {
      if (collected.size === 0) {
        const timeoutEmbed = createEmbed(
          '#95a5a6',
          '⏰ Tempo Esgotado!',
          `**Resposta correta:** ${question.options[question.correct]!}\n\n${question.explanation}`,
        );
        await interaction.editReply({ embeds: [timeoutEmbed], components: [] });
      }
    });
  },
} as Command;
