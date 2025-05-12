module.exports = {
    name: 'loop',
    async execute(interaction, checkQueue, createEmbed){
        const queue = checkQueue(interaction);
        if (!queue) return;

        const loopMode = interaction.options.getNumber('modo');
        
        try {
            queue.setRepeatMode(loopMode);
            const loopModes = ['Desativado', 'Música', 'Playlist', 'Autoplay'];
            const lop = loopModes[loopMode] || 'Desconhecido';
            
            let embed = createEmbed('#dbffff', 'Hora do Loop', `Loop está atualmente ${lop}`, 'https://drive.google.com/u/1/drive-viewer/AKGpihYNrCFSd2oVwo2JYD5WeF4AYEDIMTfhMCujWYu7udq2Q0vkmeaUPN1NGEbHDYPVZ0tbqkxtfCSXn0KPtjnALQgETgxfpUk4BQ=s2560');
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao definir loop mode:', error);
            await interaction.reply({ 
                content: 'Ocorreu um erro ao ativar o modo autoplay. Por favor, tente novamente mais tarde.', 
                ephemeral: true 
            });
        }
    }
};