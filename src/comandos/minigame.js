module.exports = {
    name: 'minigame',

    async execute(interaction, selectRandomItem, RockPaperScissors, createEmbed) {

        const escolha = selectRandomItem(RockPaperScissors);

        let embed = createEmbed('Random', 'Resultado!', `O bot escolheu: ${escolha}`, 'https://goglobalways.com/wp-content/uploads/2023/03/Rock-Scissors-Game.png')
        
        if (interaction.options.getString('jogada_usuario') === 'pedra') {

            embed.addFields(
                { name: 'Sua jogada:', value: 'Pedra' },
            );
            if (escolha === 'pedra') {
                embed.addFields(
                    { name: 'Resultado:', value: 'Empate!' },
                );
            } else if (escolha === 'papel') {
                embed.addFields(
                    { name: 'Resultado:', value: 'Eu Venci! >:)' },
                );
            } else if (escolha === 'shotgun') {
                embed.addFields(
                    { name: 'Resultado:', value: `Eu Venci! (●'◡'●)` },
                );
            } else {
                embed.addFields(
                    { name: 'Resultado:', value: 'Eu perdi... :(' },
                );
            }
        } else if (interaction.options.getString('jogada_usuario') === 'papel') {
            embed.addFields(
                { name: 'Sua jogada:', value: 'Papel' },
            );
            if (escolha === 'pedra') {
                embed.addFields(
                    { name: 'Resultado:', value: 'Você Venceu! :(' },
                );
            } else if (escolha === 'papel') {
                embed.addFields(
                    { name: 'Resultado:', value: 'Empate!' },
                );
            } else if (escolha === 'shotgun') {
                embed.addFields(
                    { name: 'Resultado:', value: `Eu Venci! (●'◡'●)` },
                );
            } else {
                embed.addFields(
                    { name: 'Resultado:', value: 'Eu Venci! >:)' },
                );
            }
        } else if (interaction.options.getString('jogada_usuario') === 'tesoura') {
            embed.addFields(
                { name: 'Sua jogada:', value: 'Tesoura' },
            );
            if (escolha === 'pedra') {
                embed.addFields(
                    { name: 'Resultado:', value: 'Eu Venci! >:)' },
                );
            } else if (escolha === 'papel') {
                embed.addFields(
                    { name: 'Resultado:', value: 'Você Venceu! :(' },
                );
            } else if (escolha === 'shotgun') {
                embed.addFields(
                    { name: 'Resultado:', value: `Eu Venci! (●'◡'●)` },
                );
            } else {
                embed.addFields(
                    { name: 'Resultado:', value: 'Empate!' },
                );
            }
        } else {
            embed.addFields(
                { name: 'Resultado:', value: 'Jogada inválida.' },
            );
        }

        interaction.reply({ embeds: [embed] });

    }
};