module.exports = {
    name: 'nowplaying',

    async execute(interaction, checkQueue, createEmbed) {
        
        const queue = checkQueue(interaction);
        if (!queue) return;
        
        const currentSong = queue.currentTrack;
        if (!currentSong) return interaction.reply('Não existir musica para você ouçar');
        
        let embed = createEmbed('#dbffff', 'Tocando **atualmente**:', `**${currentSong}**`, 'https://drive.google.com/u/1/drive-viewer/AKGpihYNrCFSd2oVwo2JYD5WeF4AYEDIMTfhMCujWYu7udq2Q0vkmeaUPN1NGEbHDYPVZ0tbqkxtfCSXn0KPtjnALQgETgxfpUk4BQ=s2560');
        interaction.reply({ embeds: [embed] });

    }
};