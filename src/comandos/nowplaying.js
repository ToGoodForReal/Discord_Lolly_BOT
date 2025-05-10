module.exports = {
    name: 'nowplaying',

    async execute(interaction, checkQueue, createEmbed) {
        
        img.src = './image/cell.jpg'
        const queue = checkQueue(interaction);
        if (!queue) return;
        
        const currentSong = queue.currentTrack;
        if (!currentSong) return interaction.reply('Não existir musica para você ouçar');
        
        let embed = createEmbed('#dbffff', 'Tocando **atualmente**:', `**${currentSong}**`, null);
        interaction.reply({ embeds: [embed] });

    }
};