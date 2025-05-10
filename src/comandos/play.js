const {createEmbed} = require('../varsFunctions')
const { useQueue } = require('discord-player');
const discord = require('discord.js');

module.exports = {
    // Definimos o nome do comando, útil para organização
    name: 'play',
    // A função execute conterá a lógica do comando
    async execute(interaction, player, checkVoiceChannel, createEmbed) { // Adicionamos player, checkVoiceChannel, createEmbed como parâmetros
        // Verifica se o usuário está em um canal de voz
        if (!checkVoiceChannel(interaction)) {
            return; // A função checkVoiceChannel já deve enviar a resposta de erro
        }

        // Obtém o argumento da URL/busca
        let args = interaction.options.getString('url');
        if (!args) {
            return interaction.reply('Me de algo para buscar!!');
        }

        // Toca a música usando o player
        try {
            await player.play(interaction.member.voice.channel, args, {
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel,
                        client: interaction.guild.members.me,
                        RequestedBy: interaction.user,
                    },
                    selfDeaf: true,
                    volume: 100,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 300000,
                    leaveOnEnd: true,
                    leaveOnEndCooldown: 300000,
                },
            });

            // Cria e envia o embed de "Procurando"
            let embed = createEmbed('#fff4ce', '🔎 Procurando:', `**${args}**`, null);
            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(`Erro ao tocar a música: ${error}`);
            interaction.reply('Ocorreu um erro ao tentar tocar a música.');
        }
    },
};