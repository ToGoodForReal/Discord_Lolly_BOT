module.exports = {
    name: 'resume',

    async execute(interaction, checkVoiceChannel, checkQueue, createEmbed) {

        if (!checkVoiceChannel(interaction)) return;

        const queue = checkQueue(interaction);
        if (!queue) return;

        try {
            
            if (queue.node.isPaused()) {
    
                queue.node.resume();
    
                let embed = createEmbed('#dbffff', 'Voltando à Festa! Oh Yeah', '☆*: .｡. o(≧▽≦)o .｡.:*☆', 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
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

