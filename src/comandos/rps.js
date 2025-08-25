const { RockPaperScissors, createEmbed, handleCommandError, checkCooldown } = require('../varsFunctions.js');

module.exports = {
    name: 'rps',

    async execute(interaction) {
        try {
            // Check cooldown
            const cooldownCheck = checkCooldown(interaction.user.id, 'rps', 2000);
            if (cooldownCheck.onCooldown) {
                const cooldownEmbed = createEmbed(
                    '#ffaa00',
                    '⏰ Calma aí!',
                    `Aguarde ${cooldownCheck.timeLeft}s antes de jogar novamente.`
                );
                return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
            }

            const userChoice = interaction.options.getString('escolha').toLowerCase();
            const validChoices = ['pedra', 'papel', 'tesoura'];

            if (!validChoices.includes(userChoice)) {
                const errorEmbed = createEmbed(
                    '#ff6b6b',
                    '❌ Escolha Inválida',
                    'Escolha entre: **pedra**, **papel** ou **tesoura**'
                );
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            const gameResult = RockPaperScissors(userChoice);
            
            const resultEmbed = createEmbed(
                '#4ecdc4',
                '🎮 Pedra, Papel, Tesoura!',
                `**Você:** ${gameResult.userChoice}\n**Eu:** ${gameResult.botChoice}\n\n**${gameResult.result}**`
            );

            await interaction.reply({ embeds: [resultEmbed] });

        } catch (error) {
            handleCommandError(interaction, error, 'rps');
        }
    }
};
