module.exports = {
    name: 'loop',

    async execute(interaction, checkQueue, createEmbed){

        const queue = checkQueue(interaction);
        if (!queue) return;

        const loopMode = interaction.options.getNumber('modo');
        queue.setRepeatMode(loopMode);

        const loopModes = ['Desativado', 'Música', 'Playlist', 'Autoplay'];
        const lop = loopModes[loopMode] || 'Desconhecido';
        
        let embed = createEmbed('#dbffff', 'Hora do Loop', `Loop está atualmente ${lop}`, 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
        interaction.reply({ embeds: [embed] });

    }
};