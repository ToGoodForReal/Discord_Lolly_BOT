module.exports = {
    name: 'clear',

    async execute(interaction, checkQueue, checkVoiceChannel, createEmbed) {
        
        if (!checkVoiceChannel(interaction)) return;
        const queue = checkQueue(interaction);
        if (!queue) return;
        
        queue.delete();
        
        let embed = createEmbed('#fff4ce', 'Playslist Limpa!', 'Pode começar uma nova playlist do zero 👌', 'https://drive.google.com/u/1/drive-viewer/AKGpihYNrCFSd2oVwo2JYD5WeF4AYEDIMTfhMCujWYu7udq2Q0vkmeaUPN1NGEbHDYPVZ0tbqkxtfCSXn0KPtjnALQgETgxfpUk4BQ=s2560');
        interaction.reply({ embeds: [embed] });

    }
};