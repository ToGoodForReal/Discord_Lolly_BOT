const { handleCommandError } = require('../varsFunctions.js');

module.exports = {
    name: 'play',

    async execute(interaction, player, checkVoiceChannel, createEmbed, volume1) {
        try {
            if (!checkVoiceChannel(interaction)) {
                const embed = createEmbed(
                    '#ff6b6b',
                    '❌ Canal de Voz Necessário',
                    'Você precisa estar em um canal de voz para usar este comando!'
                );
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const args = interaction.options.getString('url');
            if (!args) {
                const embed = createEmbed(
                    '#ff6b6b',
                    '❌ Parâmetro Necessário',
                    'Me dê algo para buscar! (URL ou nome da música)'
                );
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await interaction.deferReply();

            const searchResult = await player.search(args, {
                requestedBy: interaction.user,
            });

            if (!searchResult.hasTracks()) {
                const embed = createEmbed(
                    '#ff9500',
                    '🔍 Nenhum Resultado',
                    `Não foi possível encontrar resultados para: **${args}**`
                );
                return interaction.editReply({ embeds: [embed] });
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

            const embed = createEmbed(
                '#fff4ce', 
                '🔎 Busca iniciada...', 
                `Procurando por: **${args}**`
            );
            await interaction.editReply({ embeds: [embed] });

            await player.play(interaction.member.voice.channel, searchResult, playOptions);

        } catch (error) {
            handleCommandError(interaction, error, 'play');
        }
    },
};