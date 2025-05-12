module.exports = {
    name: 'ping',

    async execute(interaction, replyItems) {

        function selectRandomItem(items) {

            const random = Math.random();
            let sum = 0;

            for (const item of items) {

                sum += item.probability;

                if (random <= sum) {

                    return item.text;

                }
            }

            return "Pong!"; // Fallback
        }

        try {

            // Responder imediatamente ou deferir
            if (interaction.deferred || interaction.replied) {

                const response = selectRandomItem(replyItems);
                await interaction.editReply(response);

            } else {

                const response = selectRandomItem(replyItems);
                await interaction.reply(response);

            }

        } catch (error) {

            console.error('Erro ao executar o comando ping:', error);

            if (interaction.deferred || interaction.replied) {

                await interaction.editReply('Ocorreu um erro ao executar este comando.');

            } else {

                await interaction.reply('Ocorreu um erro ao executar este comando.');

            }
        }
    }
};