module.exports = {
    name: 'invite',


    async execute(interaction) {
         const LINK_DE_CONVITE = 'https://discord.com/oauth2/authorize?client_id=765032958125801582&permissions=8&integration_type=0&scope=bot';
        await interaction.reply(`🔗 **Use este link para me convidar para outros servidores:** ${LINK_DE_CONVITE}`);
    },
}