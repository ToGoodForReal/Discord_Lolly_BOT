const { dadJokes, selectRandomItem, createEmbed, handleCommandError, checkCooldown } = require('../varsFunctions.js');

module.exports = {
    name: 'joke',

    async execute(interaction) {
        try {
            // Check cooldown
            const cooldownCheck = checkCooldown(interaction.user.id, 'joke', 2000);
            if (cooldownCheck.onCooldown) {
                const cooldownEmbed = createEmbed(
                    '#ffaa00',
                    '⏰ Calma aí!',
                    `Aguarde ${cooldownCheck.timeLeft}s antes de pedir outra piada.`
                );
                return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
            }

            const joke = selectRandomItem(dadJokes);
            
            const embed = createEmbed(
                '#f1c40f',
                '😄 Piada do Papai',
                joke
            );

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            handleCommandError(interaction, error, 'joke');
        }
    }
};
