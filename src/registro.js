require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
const { QueueRepeatMode } = require('discord-player')

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
        name: 'character',
        description: 'Envia um Personagem aleatorio'
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
                required: true,
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
    {
        name: 'loop',
        description: 'Modos de Loop',
        options: [
            {
                name: 'modo',
                description: 'Ative/troque o Loop "state"',
                type: ApplicationCommandOptionType.Number,
                required: true,
                choices: [

                    {
                        name: 'Off',
                        value: QueueRepeatMode.OFF,
                    },
                    {
                        name: 'Musica',
                        value: QueueRepeatMode.TRACK,
                    },
                    {
                        name: 'Playlist',
                        value: QueueRepeatMode.QUEUE,
                    },
                    {
                        name: 'Autoplay',
                        value: QueueRepeatMode.AUTOPLAY,
                    },
                ]

            }
        ]

    },
    {
        name: 'shuffle',
        description: 'Deixa a fila em ordem aleatória',
    },
    {
        name: 'nowplaying',
        description: 'Mostra a musica tocando atualmente',
    },
    {
        name: 'clear',
        description: 'Limpa a Playlist atual, deixando-a zerada',
    },
    {
        name: 'invite',
        description: 'Fornece o link para convidar este bot para outros servidores.',
    },

];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

function regh(servers) {
    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            for (const serverId of servers) {
                if (!serverId) {
                    console.error(`Environment variable for a server ID is not set! Skipping.`);
                    continue;
                }

                try {
                    await rest.put(
                        Routes.applicationGuildCommands(process.env.CLIENT_ID, serverId),
                        { body: command },
                    );
                    console.log(`Successfully reloaded application (/) commands for server: ${serverId}`);
                } catch (guildError) {
                    console.error(`Failed to reload commands for server ${serverId}:`, guildError);
                }
            }

            console.log('Finished updating commands for all servers.');

        } catch (error) {
            console.error('An error occurred during command registration:', error);
        }
    })();
}



module.exports = regh;