const { memeGifs, selectRandomItem, createEmbed, handleCommandError, checkCooldown } = require('../varsFunctions.js');
const axios = require('axios');

module.exports = {
    name: 'meme',

    async execute(interaction) {
        try {
            // Check cooldown
            const cooldownCheck = checkCooldown(interaction.user.id, 'meme', 3000);
            if (cooldownCheck.onCooldown) {
                const cooldownEmbed = createEmbed(
                    '#ffaa00',
                    '⏰ Calma aí!',
                    `Aguarde ${cooldownCheck.timeLeft}s antes de pedir outro meme.`
                );
                return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
            }

            await interaction.deferReply();

            try {
                // Try to get a random meme from Reddit API
                const response = await axios.get('https://www.reddit.com/r/memes/random.json', {
                    headers: {
                        'User-Agent': 'Discord Bot'
                    },
                    timeout: 5000
                });

                const post = response.data[0].data.children[0].data;
                
                if (post.url && (post.url.includes('.jpg') || post.url.includes('.png') || post.url.includes('.gif'))) {
                    const embed = createEmbed(
                        '#ff6b35',
                        '😂 Meme Aleatório',
                        `**${post.title}**\n\n👍 ${post.ups} upvotes`,
                        null,
                        post.url,
                        { text: `r/memes • u/${post.author}` }
                    );

                    return interaction.editReply({ embeds: [embed] });
                }
            } catch (error) {
                console.log('Reddit API failed, using fallback GIF');
            }

            // Fallback to local GIF collection
            const randomGif = selectRandomItem(memeGifs);
            const embed = createEmbed(
                '#ff6b35',
                '😂 Meme Aleatório',
                'Aqui está um meme para alegrar seu dia!',
                null,
                randomGif
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            handleCommandError(interaction, error, 'meme');
        }
    }
};
