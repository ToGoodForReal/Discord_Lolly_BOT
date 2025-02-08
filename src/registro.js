require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const command = [

    {
        name: 'ping',
        description: 'Replies with Pong!',
        options: []
    },
    {
        name: 'minigame',
        description: 'Jogue pedra, papel ou tesoura comigo!',
        options: [
            {
                name: 'jogada_usuario',  // Renomeei para 'jogada_usuario'
                description: 'Escolha entre pedra, papel ou tesoura!',
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: 'pedra',
                        value: 'pedra',
                    },
                    {
                        name: 'papel',
                        value: 'papel',
                    },
                    {
                        name: 'tesoura',
                        value: 'tesoura',
                    },
                ],
                required: true,
            },
        ],
    },
];


const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {

        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.ID_SERVER),
            { body: command },
        )

        console.log('Successfully reloaded application (/) commands.');

    }

    catch (error) {
        console.log(error);
    }
})();