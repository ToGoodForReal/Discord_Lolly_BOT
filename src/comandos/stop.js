module.exports = {
    name: 'stop',

    async execute(interaction, checkVoiceChannel, checkQueue, createEmbed) {

        if (!checkVoiceChannel(interaction)) return; // Garante que o usuário está em um canal de voz

        const queue = await checkQueue(interaction); // Obtém a fila (ou false se não houver)

        if (!queue) {
            return;
        }

        try {

            // Vamos tentar com queue.destroy() primeiro, que é uma opção robusta.
            if (typeof queue.destroy === 'function') {

                queue.destroy();

            } else if (typeof queue.node?.stop === 'function') {

                queue.node.stop();

            } else if (typeof queue.delete === 'function') {

                queue.delete();

            } else {
                
                console.log('Erro no comando stop: Nenhum método para parar/deletar a fila foi encontrado no objeto queue.');
                interaction.reply('Ocorreu um erro ao tentar parar a música. Não foi possível encontrar a função apropriada.');
                
                return;

            }

            let embed = createEmbed('#fff4ce', 'Paro-Paro-Paro!', 'Manual do Mundo não me processa 👌', 'https://drive.google.com/file/d/13-kPbdrda50KswtXVAQZo05VBWmY4hcw/view?usp=sharing');
            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.log(`Erro no comando stop: ${error}`);
            interaction.reply('Ocorreu um erro ao executar o comando Stop.');
        }
    }
};