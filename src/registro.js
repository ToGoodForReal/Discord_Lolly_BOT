require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
const { QueueRepeatMode } = require('discord-player')

const command = [
    // Utility Commands
    {
        name: 'ping',
        description: 'Mostra a latência do bot'
    },
    {
        name: 'invite',
        description: 'Fornece o link para convidar este bot para outros servidores'
    },
    {
        name: 'character',
        description: 'Mostra um personagem de anime aleatório'
    },

    // Game Commands
    {
        name: 'rps',
        description: 'Jogue pedra, papel ou tesoura comigo!',
        options: [
            {
                name: 'escolha',
                description: 'Escolha entre pedra, papel ou tesoura!',
                type: ApplicationCommandOptionType.String,
                choices: [
                    { name: 'Pedra ', value: 'pedra' },
                    { name: 'Papel ', value: 'papel' },
                    { name: 'Tesoura ', value: 'tesoura' }
                ],
                required: true
            }
        ]
    },
    {
        name: '8ball',
        description: 'Faça uma pergunta para a bola 8 mágica!',
        options: [
            {
                name: 'pergunta',
                description: 'Sua pergunta para a bola 8',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'dice',
        description: 'Role dados com número personalizado de lados',
        options: [
            {
                name: 'lados',
                description: 'Número de lados do dado (2-100)',
                type: ApplicationCommandOptionType.Integer,
                required: false
            },
            {
                name: 'quantidade',
                description: 'Quantos dados rolar (1-10)',
                type: ApplicationCommandOptionType.Integer,
                required: false
            }
        ]
    },
    {
        name: 'trivia',
        description: 'Responda uma pergunta de trivia!'
    },
    {
        name: 'guess',
        description: 'Jogo de adivinhação - adivinhe o número que pensei!',
        options: [
            {
                name: 'maximo',
                description: 'Número máximo para adivinhar (padrão: 100)',
                type: ApplicationCommandOptionType.Integer,
                required: false
            },
            {
                name: 'numero',
                description: 'Seu palpite (use apenas quando já tiver um jogo ativo)',
                type: ApplicationCommandOptionType.Integer,
                required: false
            }
        ]
    },

    // Meme Commands
    {
        name: 'meme',
        description: 'Receba um meme aleatório para alegrar seu dia!'
    },
    {
        name: 'joke',
        description: 'Receba uma piada do papai para dar risada!'
    },

    // Music Commands
    {
        name: 'play',
        description: 'Selecione uma música e comece a escutar!',
        options: [
            {
                name: 'url',
                description: 'URL ou nome da música que deseja tocar',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'skip',
        description: 'Pula para próxima música da fila atual'
    },
    {
        name: 'stop',
        description: 'Para e limpa a fila atual'
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
        description: 'Continua a música pausada'
    },
    {
        name: 'volume',
        description: 'Altere o volume das músicas',
        options: [
            {
                name: 'vol',
                description: 'Volume desejado (0-200)',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
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
                        value: QueueRepeatMode.OFF
                    },
                    {
                        name: 'Música',
                        value: QueueRepeatMode.TRACK
                    },
                    {
                        name: 'Playlist',
                        value: QueueRepeatMode.QUEUE
                    },
                    {
                        name: 'Autoplay',
                        value: QueueRepeatMode.AUTOPLAY
                    }
                ]
            }
        ]
    },
    {
        name: 'shuffle',
        description: 'Deixa a fila em ordem aleatória'
    },
    {
        name: 'nowplaying',
        description: 'Mostra a música tocando atualmente'
    },
    {
        name: 'clear',
        description: 'Limpa a Playlist atual, deixando-a zerada'
    }
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