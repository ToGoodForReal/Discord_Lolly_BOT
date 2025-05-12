module.exports = {
    name: 'skip',

    async execute(interaction, checkVoiceChannel, checkQueue, createEmbed) {

        if (!checkVoiceChannel(interaction)) return;

        const queue = checkQueue(interaction);
        if (!queue) return;

        try {

            queue.node.skip();

            let embed = createEmbed('#fff4ce', 'Okay! Pulando para a próxima música', 'A música foi **PULADA**', 'https://drive.google.com/u/1/drive-viewer/AKGpihYNrCFSd2oVwo2JYD5WeF4AYEDIMTfhMCujWYu7udq2Q0vkmeaUPN1NGEbHDYPVZ0tbqkxtfCSXn0KPtjnALQgETgxfpUk4BQ=s2560');
            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.log(`Erro no Skip: ${error}`);
            interaction.reply('Ocorreu um erro ao tentar pular a música!')
        };



    }
};