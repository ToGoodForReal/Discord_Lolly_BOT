module.exports = {
    name: 'volume',

    async execute(interaction, checkQueue, createEmbed) {

        const queue = checkQueue(interaction);
        const volumeVal = interaction.options.getInteger('vol');

        if (!queue) return interaction.reply({ content: 'Não tem nenhum Hit no momento!', ephemeral: true });

        if (volumeVal === null || isNaN(volumeVal) || volumeVal < 0 || volumeVal > 500) {

            return interaction.reply({ content: 'Por favor, forneça um valor de volume válido entre 0 a 500.', ephemeral: true });

        } else {

            queue.node.setVolume(volumeVal);

            let embed = createEmbed('#d88588', `Volume definido para **${volumeVal}%**!`, 'Volume alterado', 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
            return interaction.reply({ embeds: [embed] });

        };

    }
};