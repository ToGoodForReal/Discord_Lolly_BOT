module.exports = {
    name: 'volume',

    async execute(interaction, checkQueue, createEmbed) {

        const queue = checkQueue(interaction);
        const volumeVal = interaction.options.getInteger('vol');

        if (!queue) {

            return interaction.reply({ content: 'A lista está vazia, **BIZONHO** O.O', ephemeral: true });

        }

        if (volumeVal === null || isNaN(volumeVal) || volumeVal < 0 || volumeVal > 500) {

            return interaction.reply({ content: 'Por favor, forneça um valor de volume válido entre 0 a 500.', ephemeral: true });

        } else {

            try {

                await queue.node.setVolume(volumeVal);
                let embed = createEmbed('#d88588', `Volume definido para **${volumeVal}%**!`, 'Volume alterado', 'https://drive.google.com/file/d/13-kPbdrda50KswtXVAQZo05VBWmY4hcw/view?usp=sharing');
                await interaction.reply({ embeds: [embed] });
                return volumeVal;

            } catch (error) {

                console.error("Erro ao definir o volume:", error);
                await interaction.reply({ content: 'Ocorreu um erro ao tentar definir o volume.', ephemeral: true });
                return null; // Ou algum indicativo de erro
                
            }
        }
    }
};