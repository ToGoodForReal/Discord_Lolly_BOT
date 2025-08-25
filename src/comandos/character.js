const { Personagens, selectRandomItem, createEmbed, handleCommandError, checkCooldown } = require('../varsFunctions.js');

module.exports = {
    name: 'character',

    async execute(interaction) {
        try {
            // Check cooldown
            const cooldownCheck = checkCooldown(interaction.user.id, 'character', 3000);
            if (cooldownCheck.onCooldown) {
                const cooldownEmbed = createEmbed(
                    '#ffaa00',
                    '⏰ Calma aí!',
                    `Aguarde ${cooldownCheck.timeLeft}s antes de pedir outro personagem.`
                );
                return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
            }

            const character = selectRandomItem(Personagens);
            
            const embed = createEmbed(
                '#9b59b6',
                '🎭 Personagem Aleatório',
                `**Nome:** ${character.name}\n**Anime:** ${character.anime}\n**Descrição:** ${character.description}`
            );

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            handleCommandError(interaction, error, 'character');
        }
    }
};
