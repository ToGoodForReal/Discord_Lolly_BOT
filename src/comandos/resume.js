module.exports = {
    name: 'resume',

    async execute(interaction, checkVoiceChannel, checkQueue, createEmbed) {

        if (!checkVoiceChannel(interaction)) return;

        const queue = checkQueue(interaction);
        if (!queue) return;

        try {
            
            if (queue.node.isPaused()) {
    
                queue.node.resume();
    
                let embed = createEmbed('#dbffff', 'Voltando à Festa! Oh Yeah', '☆*: .｡. o(≧▽≦)o .｡.:*☆', 'https://drive.google.com/u/1/drive-viewer/AKGpihYNrCFSd2oVwo2JYD5WeF4AYEDIMTfhMCujWYu7udq2Q0vkmeaUPN1NGEbHDYPVZ0tbqkxtfCSXn0KPtjnALQgETgxfpUk4BQ=s2560');
                interaction.reply({ embeds: [embed] });
                
            } else {

                let embedResume = createEmbed('#d88588', 'Eu não sou Adivinha', 'Mas acho que já está tocando!');
                interaction.reply({ embeds: [embedResume] });
            };


        } catch (error) {

            console.log(`Erro codigo resume: ${error}`);
            interaction.reply('Ocorreu um erro ao tentar voltar a tocar a música!');

        }
        


    }
};

