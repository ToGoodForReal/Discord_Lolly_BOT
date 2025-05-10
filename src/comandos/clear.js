module.exports = {
    name: 'clear',

    async execute(interaction, checkQueue, checkVoiceChannel, createEmbed) {
        
        if (!checkVoiceChannel(interaction)) return;
        const queue = checkQueue(interaction);
        if (!queue) return;
        
        queue.delete();
        
        let embed = createEmbed('#fff4ce', 'Playslist Limpa!', 'Pode começar uma nova playlist do zero 👌', './image/cell.jpg');
        interaction.reply({ embeds: [embed] });

    }
};