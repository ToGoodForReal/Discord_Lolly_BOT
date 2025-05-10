module.exports = {
    name: 'shuffle',

    async execute(interaction, checkQueue, createEmbed) {

        const queue = checkQueue(interaction);
        if (!queue) return;

        queue.tracks.shuffle();

        if (queue.tracks.size < 2) {
            let embed = createEmbed('#dbffff', 'Não há músicas suficientes para aleatorizar a playlist!', 'Adicina mais umas ai! （￣︶￣）↗　', 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
            return interaction.reply({ embeds: [embed] });
        }

        let embed = createEmbed('#db8a8f', 'Embaralhandoa Playlist', `Aleatorizando ${queue.tracks.size} musicas. Use /queue para ver a nova playlist`, 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
        interaction.reply({ embeds: [embed] });

    }
};