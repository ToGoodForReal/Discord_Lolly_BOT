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

            // const track = searchResult.tracks[0]; // Não precisamos mais de isLongVideo para este teste

            // Opções para player.play, sem especificar 'quality' aqui,
            // para que ele use o padrão global definido no bot.js
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
                }
                // Não vamos mais definir playOptions.quality ou playOptions.ytdlOptions.quality aqui
                // para forçar o uso da configuração global.
            };
            
            let embed = createEmbed('#fff4ce', '🔎 Busca iniciada...', `Procurando por: **${args}**`);
            // Enviar a resposta antes de chamar player.play para evitar timeout de interação se o download demorar.
            await interaction.editReply({ embeds: [embed] });

            try {
                // Agora player.play usará as ytdlOptions globais (com quality: "lowestaudio")
                await player.play(interaction.member.voice.channel, searchResult, playOptions);
            } catch (e) {
                console.error('Erro durante player.play com configuração global de lowestaudio:', e);
                // Se a interação já foi respondida com "Busca iniciada...",
                // podemos enviar uma nova mensagem ou editar a anterior se o erro for imediato.
                // Como já demos editReply, uma nova mensagem pode ser mais apropriada se o erro for pego aqui.
                await interaction.followUp({ // Usar followUp pois a interação já foi respondida
                    content: `Ocorreu um erro ao tentar tocar a música: ${e.message}. Verifique os logs.`,
                    ephemeral: true
                });
                return;
            }
            // Não precisamos de outro interaction.editReply aqui, pois o discord-player
            // geralmente envia suas próprias mensagens através dos eventos.

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