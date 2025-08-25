const { replyItems, selectRandomItem, createEmbed, handleCommandError } = require('../varsFunctions.js');

module.exports = {
    name: 'ping',

    async execute(interaction) {
        try {
            const sent = await interaction.reply({ 
                content: 'Calculando ping...', 
                fetchReply: true 
            });
            
            const latency = sent.createdTimestamp - interaction.createdTimestamp;
            const apiLatency = Math.round(interaction.client.ws.ping);
            const response = selectRandomItem(replyItems);

            const embed = createEmbed(
                '#00ff00',
                '🏓 Pong!',
                `${response}\n\n📡 **Latência:** ${latency}ms\n🌐 **API:** ${apiLatency}ms`
            );

            await interaction.editReply({ content: '', embeds: [embed] });

        } catch (error) {
            handleCommandError(interaction, error, 'ping');
        }
    }
};
