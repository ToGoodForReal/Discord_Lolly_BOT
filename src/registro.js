require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType, Application } = require('discord.js');

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

    {
        name: 'play',
        description: 'Selecione uma música e comece a escutar!',
        required: true,
        options: [
            {
                name: 'url',
                description: 'Direcione a URL da musica que deseja!',
                type: ApplicationCommandOptionType.String,
            },
        ],
    },
    {
        name: 'skip',
        description: 'Pula para proxima musica da fila atual'
    },
    {
        name: 'stop',
        description: 'Para e limpa a ffila atual'
    },
    {
        name: 'queue',
        description: 'Mostra a fila atual'
    },
    {
        name: 'pause',
        description: 'Pausa a fila atual'
    },
    {
        name: 'resume',
        description: 'Continua a musica pausada'
    },
    {
        name: 'volume',
        description: 'Altere o volume das músicas',
        options: [
            {
                name: 'vol',
                description: 'coloque o valor a ser alterado!',
                type: ApplicationCommandOptionType.Integer,
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