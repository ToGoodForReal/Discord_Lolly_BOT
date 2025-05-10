module.exports = {
    name: 'skip',

    async execute(interaction, checkVoiceChannel, checkQueue, createEmbed) {

        if (!checkVoiceChannel(interaction)) return;

        const queue = checkQueue(interaction);
        if (!queue) return;

        try {

            queue.node.skip();

            let embed = createEmbed('#fff4ce', 'Okay! Pulando para a próxima música', 'A música foi **PULADA**', 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.log(`Erro no Skip: ${error}`);
            interaction.reply('Ocorreu um erro ao tentar pular a música!')
        };



    }
};