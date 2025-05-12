module.exports = {
    name: 'character',

    async execute(interaction, Personagens, createEmbed) {

        console.log('Personagens:', Personagens);
        const result = selectRandomItem(Personagens);
        console.log('Resultado:', result);

        if (!result) {
            return interaction.reply('Ocorreu um erro ao selecionar um personagem.');
        }

        let embed = createEmbed('#dbffff', `${result.text}`, `${result.description}`, '', `${result.img}`);
        interaction.reply({ embeds: [embed] });

    }
}
