module.exports = {
    name: 'shuffle',

    async execute(interaction, checkQueue, createEmbed) {

        const queue = checkQueue(interaction);
        if (!queue) return;

        queue.tracks.shuffle();

        if (queue.tracks.size < 2) {
            let embed = createEmbed('#dbffff', 'Não há músicas suficientes para aleatorizar a playlist!', 'Adicina mais umas ai! （￣︶￣）↗　', 'https://drive.google.com/u/1/drive-viewer/AKGpihYNrCFSd2oVwo2JYD5WeF4AYEDIMTfhMCujWYu7udq2Q0vkmeaUPN1NGEbHDYPVZ0tbqkxtfCSXn0KPtjnALQgETgxfpUk4BQ=s2560');
            return interaction.reply({ embeds: [embed] });
        }

        let embed = createEmbed('#db8a8f', 'Embaralhandoa Playlist', `Aleatorizando ${queue.tracks.size} musicas. Use /queue para ver a nova playlist`, 'https://drive.google.com/u/1/drive-viewer/AKGpihYNrCFSd2oVwo2JYD5WeF4AYEDIMTfhMCujWYu7udq2Q0vkmeaUPN1NGEbHDYPVZ0tbqkxtfCSXn0KPtjnALQgETgxfpUk4BQ=s2560');
        interaction.reply({ embeds: [embed] });

    }
};