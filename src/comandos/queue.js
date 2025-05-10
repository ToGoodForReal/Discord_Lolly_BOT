const discord = require('discord.js');

module.exports = {
    name: 'queue',

    async execute(interaction, checkVoiceChannel, checkQueue, createEmbed) {

        if (!checkVoiceChannel(interaction)) return;

        const queue = checkQueue(interaction);
        if (!queue) return;

        try {

            // Obtém a lista de músicas
            const history = queue.history.tracks.data.map((x, index) => `${index + 1}. ${x.title}`);
            const next = queue.tracks.data.map((x, index) => `${history.length + index + 1}. ${x.title}`);
            const list = [...history, `> ${queue.currentTrack.title}`, ...next];

            // Define o número de músicas por página
            const itemsPerPage = 10;
            let currentPage = 0;

            const generateEmbed = (page) => {
                const start = page * itemsPerPage;
                const end = start + itemsPerPage;
                const pageTracks = list.slice(start, end);
                const embed = createEmbed('#dbffff', `Atualmente a lista em ${interaction.guild.name}`, `Lista servidor: \n${pageTracks.join('\n')}`, null, null, { text: `Página ${page + 1} de ${Math.ceil(list.length / itemsPerPage)}` });
                return embed; // Retorna o embed criado
            }

            const embed = generateEmbed(currentPage); // Chama a função para obter o embed inicial

            const row = new discord.ActionRowBuilder().addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('Anterior')
                    .setStyle(discord.ButtonStyle.Primary)
                    .setDisabled(currentPage === 0), // Desabilita o botão "Anterior" na primeira página
                new discord.ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Próxima')
                    .setStyle(discord.ButtonStyle.Primary)
                    .setDisabled((currentPage + 1) * itemsPerPage >= list.length) // Desabilita o botão "Próxima" na última página
            );

            interaction.reply({
                embeds: [embed], // Use 'embeds' no plural para enviar um array de embeds
                components: [row],
            });

            // Cria um coletor de interações para os botões
            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'previous') {
                    currentPage--;
                } else if (i.customId === 'next') {
                    currentPage++;
                }

                // Atualiza os botões
                row.components[0].setDisabled(currentPage === 0);
                row.components[1].setDisabled((currentPage + 1) * itemsPerPage >= list.length);

                // Atualiza a mensagem com a nova página
                await i.update({
                    embeds: [generateEmbed(currentPage)], // Atualiza o embed chamando a função novamente
                    components: [row],
                });
            });

            collector.on('end', () => {
                // Remove os botões após o tempo expirar
                interaction.editReply({ components: [] });
            });

        } catch (error) {
            console.log(`Erro codigo queue: ${error}`);
            interaction.reply('Ocorreu um erro ao puxar a lista atual para o servidor');
        };
    }
};