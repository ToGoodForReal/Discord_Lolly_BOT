module.exports = {
    name: 'pause',

    async execute(interaction, checkVoiceChannel, checkQueue, createEmbed) {

        if (!checkVoiceChannel(interaction)) return;

        const queue = checkQueue(interaction);
        if (!queue) return;

        try {

            if (queue.node.isPaused()) {
                let embedPause = createEmbed('#d88588', 'A música já está pausada!', 'A não ser que sei lá, você quer que eu pare 2x ?');
                return await interaction.reply({ embeds: [embedPause] });
            } else {
                queue.node.pause();
                let embed = createEmbed('#fff4ce', 'Vou pausar pra princesa =_=', 'A música foi **PAUSADA**', 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
                return await interaction.reply({ embeds: [embed] });
            }

        } catch (error) {
            console.log(`Erro codigo pause: ${error}`)
            return interaction.reply('Ocorreu um erro ao tentar pausar a música!');
        };
    }
};