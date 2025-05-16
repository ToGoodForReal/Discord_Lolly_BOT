module.exports = {
    name: 'play',

    async execute(interaction, player, checkVoiceChannel, createEmbed, volume1) {

        if (!checkVoiceChannel(interaction)) return;

        const args = interaction.options.getString('url');
        if (!args) return interaction.reply({ content: 'Me dê algo para buscar!!', ephemeral: true });

        await interaction.deferReply();

        try {

            const searchResult = await player.search(args, {
                requestedBy: interaction.user,

            });

            if (!searchResult.hasTracks()) {

                return interaction.editReply({ content: 'Não foi possível encontrar resultados para sua busca.', ephemeral: true });

            }

            const playOptions = {
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel,
                        client: interaction.guild.members.me,
                        requestedBy: interaction.user,
                    },
                    selfDeaf: true,
                    volume: volume1,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 300000,
                    leaveOnEnd: true,
                    leaveOnEndCooldown: 300000,
                },
            };

            let embed = createEmbed('#fff4ce', '🔎 Busca iniciada...', `Procurando por: **${args}**`);

            await interaction.editReply({ embeds: [embed] });

            try {

                await player.play(interaction.member.voice.channel, searchResult, playOptions);

            } catch (e) {

                console.error('Erro durante player.play:', e);

                await interaction.followUp({
                    content: `Ocorreu um erro ao tentar tocar a música: ${e.message}. Verifique os logs.`,
                    ephemeral: true
                });

                return;
            }

        } catch (error) {

            console.error(`Erro no comando play: ${error}`);

            if (!interaction.replied && !interaction.deferred) {

                await interaction.reply({ content: 'Ocorreu um erro geral ao processar sua solicitação.', ephemeral: true });

            } else {

                await interaction.editReply({
                    content: 'Ocorreu um erro geral ao processar sua solicitação. Verifique os logs do bot.',

                });
            }
        }
    },
};