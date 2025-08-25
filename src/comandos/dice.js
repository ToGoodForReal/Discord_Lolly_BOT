const { createEmbed, handleCommandError, checkCooldown } = require('../varsFunctions.js');

module.exports = {
    name: 'dice',

    async execute(interaction) {
        try {
            // Check cooldown
            const cooldownCheck = checkCooldown(interaction.user.id, 'dice', 1000);
            if (cooldownCheck.onCooldown) {
                const cooldownEmbed = createEmbed(
                    '#ffaa00',
                    '⏰ Calma aí!',
                    `Aguarde ${cooldownCheck.timeLeft}s antes de rolar novamente.`
                );
                return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
            }

            const sides = interaction.options.getInteger('lados') || 6;
            const quantity = interaction.options.getInteger('quantidade') || 1;

            if (sides < 2 || sides > 100) {
                const errorEmbed = createEmbed(
                    '#ff6b6b',
                    '❌ Valor Inválido',
                    'O dado deve ter entre 2 e 100 lados!'
                );
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            if (quantity < 1 || quantity > 10) {
                const errorEmbed = createEmbed(
                    '#ff6b6b',
                    '❌ Quantidade Inválida',
                    'Você pode rolar entre 1 e 10 dados!'
                );
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            const results = [];
            let total = 0;

            for (let i = 0; i < quantity; i++) {
                const roll = Math.floor(Math.random() * sides) + 1;
                results.push(roll);
                total += roll;
            }

            const diceEmoji = sides === 6 ? '🎲' : '🔢';
            let description = `${diceEmoji} **Resultado${quantity > 1 ? 's' : ''}:** ${results.join(', ')}`;
            
            if (quantity > 1) {
                description += `\n\n📊 **Total:** ${total}`;
            }

            const embed = createEmbed(
                '#e74c3c',
                `🎲 Rolando ${quantity} dado${quantity > 1 ? 's' : ''} de ${sides} lado${sides > 1 ? 's' : ''}`,
                description
            );

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            handleCommandError(interaction, error, 'dice');
        }
    }
};
