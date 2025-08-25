const { createEmbed, handleCommandError, checkCooldown } = require('../varsFunctions.js');

const activeGames = new Map();

module.exports = {
    name: 'guess',

    async execute(interaction) {
        try {
            // Check cooldown
            const cooldownCheck = checkCooldown(interaction.user.id, 'guess', 2000);
            if (cooldownCheck.onCooldown) {
                const cooldownEmbed = createEmbed(
                    '#ffaa00',
                    '⏰ Calma aí!',
                    `Aguarde ${cooldownCheck.timeLeft}s antes de iniciar um novo jogo.`
                );
                return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
            }

            const userId = interaction.user.id;
            
            // Check if user already has an active game
            if (activeGames.has(userId)) {
                const gameData = activeGames.get(userId);
                const embed = createEmbed(
                    '#f39c12',
                    '🎯 Jogo em Andamento',
                    `Você já tem um jogo ativo!\n**Tentativas restantes:** ${gameData.attempts}\n**Dica:** O número está entre ${gameData.min} e ${gameData.max}`
                );
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const max = interaction.options.getInteger('maximo') || 100;
            const min = 1;

            if (max < 2 || max > 1000) {
                const errorEmbed = createEmbed(
                    '#ff6b6b',
                    '❌ Valor Inválido',
                    'O número máximo deve estar entre 2 e 1000!'
                );
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            const targetNumber = Math.floor(Math.random() * max) + min;
            const maxAttempts = Math.min(Math.ceil(Math.log2(max)) + 2, 10);

            activeGames.set(userId, {
                target: targetNumber,
                attempts: maxAttempts,
                min: min,
                max: max,
                guesses: []
            });

            const embed = createEmbed(
                '#2ecc71',
                '🎯 Jogo de Adivinhação Iniciado!',
                `Pensei em um número entre **${min}** e **${max}**!\nVocê tem **${maxAttempts}** tentativas.\n\nUse \`/guess número\` para fazer sua tentativa!`
            );

            await interaction.reply({ embeds: [embed] });

            // Auto-cleanup after 5 minutes
            setTimeout(() => {
                if (activeGames.has(userId)) {
                    activeGames.delete(userId);
                }
            }, 300000);

        } catch (error) {
            handleCommandError(interaction, error, 'guess');
        }
    },

    async handleGuess(interaction, guessNumber) {
        try {
            const userId = interaction.user.id;
            
            if (!activeGames.has(userId)) {
                const embed = createEmbed(
                    '#ff6b6b',
                    '❌ Nenhum Jogo Ativo',
                    'Você não tem um jogo ativo! Use `/guess` para iniciar um novo jogo.'
                );
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const gameData = activeGames.get(userId);
            
            if (guessNumber < gameData.min || guessNumber > gameData.max) {
                const embed = createEmbed(
                    '#ff6b6b',
                    '❌ Número Inválido',
                    `O número deve estar entre ${gameData.min} e ${gameData.max}!`
                );
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            gameData.attempts--;
            gameData.guesses.push(guessNumber);

            if (guessNumber === gameData.target) {
                // Win!
                const embed = createEmbed(
                    '#27ae60',
                    '🎉 Parabéns! Você Acertou!',
                    `O número era **${gameData.target}**!\nVocê acertou em **${gameData.guesses.length}** tentativa${gameData.guesses.length > 1 ? 's' : ''}!\n\n**Suas tentativas:** ${gameData.guesses.join(', ')}`
                );
                activeGames.delete(userId);
                return interaction.reply({ embeds: [embed] });
            }

            if (gameData.attempts === 0) {
                // Game over
                const embed = createEmbed(
                    '#e74c3c',
                    '💔 Game Over!',
                    `Suas tentativas acabaram!\nO número era **${gameData.target}**.\n\n**Suas tentativas:** ${gameData.guesses.join(', ')}`
                );
                activeGames.delete(userId);
                return interaction.reply({ embeds: [embed] });
            }

            // Give hint
            const hint = guessNumber < gameData.target ? 
                `📈 **Muito baixo!** O número é maior que ${guessNumber}.` : 
                `📉 **Muito alto!** O número é menor que ${guessNumber}.`;

            const embed = createEmbed(
                '#f39c12',
                '🎯 Continue Tentando!',
                `${hint}\n\n**Tentativas restantes:** ${gameData.attempts}\n**Suas tentativas:** ${gameData.guesses.join(', ')}`
            );

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            handleCommandError(interaction, error, 'guess');
        }
    }
};
