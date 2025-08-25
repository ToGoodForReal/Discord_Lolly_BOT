const { eightBallResponses, selectRandomItem, createEmbed, handleCommandError, checkCooldown } = require('../varsFunctions.js');

module.exports = {
    name: '8ball',

    async execute(interaction) {
        try {
            // Check cooldown
            const cooldownCheck = checkCooldown(interaction.user.id, '8ball', 3000);
            if (cooldownCheck.onCooldown) {
                const cooldownEmbed = createEmbed(
                    '#ffaa00',
                    '⏰ Calma aí!',
                    `Aguarde ${cooldownCheck.timeLeft}s antes de perguntar novamente.`
                );
                return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
            }

            const question = interaction.options.getString('pergunta');
            const response = selectRandomItem(eightBallResponses);
            
            const embed = createEmbed(
                '#9b59b6',
                '🎱 Bola 8 Mágica',
                `**Pergunta:** ${question}\n\n**Resposta:** ${response}`
            );

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            handleCommandError(interaction, error, '8ball');
        }
    }
};
