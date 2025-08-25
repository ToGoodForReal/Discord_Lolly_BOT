const { triviaQuestions, selectRandomItem, createEmbed, createActionRow, createButtonRow, handleCommandError, checkCooldown } = require('../varsFunctions.js');

module.exports = {
    name: 'trivia',

    async execute(interaction) {
        try {
            // Check cooldown
            const cooldownCheck = checkCooldown(interaction.user.id, 'trivia', 5000);
            if (cooldownCheck.onCooldown) {
                const cooldownEmbed = createEmbed(
                    '#ffaa00',
                    '⏰ Calma aí!',
                    `Aguarde ${cooldownCheck.timeLeft}s antes de uma nova pergunta.`
                );
                return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
            }

            const question = selectRandomItem(triviaQuestions);
            
            const embed = createEmbed(
                '#3498db',
                '🧠 Pergunta de Trivia',
                `**${question.question}**\n\n${question.options.map((option, index) => `${index + 1}. ${option}`).join('\n')}`
            );

            const buttons = [];
            for (let i = 0; i < question.options.length; i++) {
                buttons.push(
                    createButtonRow(`trivia_${i}`, `${i + 1}`, false)
                );
            }

            const row = new (require('discord.js')).ActionRowBuilder().addComponents(buttons);

            const response = await interaction.reply({ 
                embeds: [embed], 
                components: [row]
            });

            const collector = response.createMessageComponentCollector({ 
                time: 15000 
            });

            collector.on('collect', async (buttonInteraction) => {
                if (buttonInteraction.user.id !== interaction.user.id) {
                    return buttonInteraction.reply({ 
                        content: 'Esta pergunta não é para você!', 
                        ephemeral: true 
                    });
                }

                const selectedIndex = parseInt(buttonInteraction.customId.split('_')[1]);
                const isCorrect = selectedIndex === question.correct;

                const resultEmbed = createEmbed(
                    isCorrect ? '#27ae60' : '#e74c3c',
                    isCorrect ? '✅ Correto!' : '❌ Incorreto!',
                    `**Sua resposta:** ${question.options[selectedIndex]}\n**Resposta correta:** ${question.options[question.correct]}\n\n${question.explanation}`
                );

                await buttonInteraction.update({ 
                    embeds: [resultEmbed], 
                    components: [] 
                });
            });

            collector.on('end', async (collected) => {
                if (collected.size === 0) {
                    const timeoutEmbed = createEmbed(
                        '#95a5a6',
                        '⏰ Tempo Esgotado!',
                        `**Resposta correta:** ${question.options[question.correct]}\n\n${question.explanation}`
                    );

                    await interaction.editReply({ 
                        embeds: [timeoutEmbed], 
                        components: [] 
                    });
                }
            });

        } catch (error) {
            handleCommandError(interaction, error, 'trivia');
        }
    }
};
