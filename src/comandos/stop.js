module.exports = {
    name: 'stop',

    async execute(interaction, checkQueue, checkVoiceChannel, createEmbed) {

        if (!checkVoiceChannel(interaction)) return;
        const queue = checkQueue(interaction);
        if (!queue) return;

        try {

            queue.delete();
            queue.node.stop();

            let embed = createEmbed('#fff4ce', 'Paro-Paro-Paro!', 'Manual do Mundo não me processa 👌', 'https://avatarfiles.alphacoders.com/206/thumb-1920-206638.jpg');
            interaction.reply({ embeds: [embed] });

        } catch (error) {

            console.log(`Erro codigo stop: ${error}`);
            interaction.reply('Ocorreu erro ao executar o comando Stop');

        }

    }
}
