# 🍭 Lolly Bot

Bot multiuso para Discord com reprodução de música, jogos interativos, memes e utilidades.

## Funcionalidades

### 🎵 Música
| Comando | Descrição |
|---------|-----------|
| `/play <url>` | Busca e reproduz uma música |
| `/skip` | Pula para a próxima faixa |
| `/stop` | Para e limpa a fila |
| `/pause` | Pausa a reprodução |
| `/resume` | Retoma a música pausada |
| `/volume <vol>` | Ajusta o volume (0-500) |
| `/loop <modo>` | Alterna loop (Off/Música/Playlist/Autoplay) |
| `/shuffle` | Embaralha a fila |
| `/nowplaying` | Mostra a música atual |
| `/queue` | Exibe a fila com paginação |
| `/clear` | Limpa toda a fila |

### 🎮 Jogos
| Comando | Descrição |
|---------|-----------|
| `/rps <escolha>` | Pedra, Papel ou Tesoura |
| `/8ball <pergunta>` | Bola 8 mágica |
| `/dice [lados] [quantidade]` | Role dados |
| `/trivia` | Perguntas de trivia com botões |
| `/guess [maximo] [numero]` | Adivinhe o número |

### 😂 Diversão
| Comando | Descrição |
|---------|-----------|
| `/meme` | Meme aleatório |
| `/joke` | Piada do papai |
| `/character` | Personagem de anime aleatório |

### 🛠️ Utilidades
| Comando | Descrição |
|---------|-----------|
| `/ping` | Latência do bot |
| `/invite` | Link de convite |

## Requisitos

- **Node.js** 20+
- Token de bot do Discord
- YouTube Data API Key (opcional, para thumbnails)

## Instalação

```bash
# Instalar dependências
npm install

# Copiar e configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Desenvolvimento (hot-reload)
npm run dev

# Build para produção
npm run build

# Executar produção
npm start

# Registrar comandos no Discord
npm run reg
```

## Docker

```bash
# Build da imagem
docker build -t lolly-bot .

# Executar com .env
docker run --env-file .env --name lolly-bot --restart unless-stopped lolly-bot

# Ou com docker-compose
docker compose up -d

# Parar
docker compose down
```

> **Nota:** A imagem tem ~670MB devido ao `ffmpeg-static` (necessário para processamento de áudio).

## Estrutura do Projeto

```
src/
├── index.ts                 # Entry point
├── config/
│   ├── env.ts               # Validação de variáveis
│   └── constants.ts         # Constantes do bot
├── client/
│   ├── discord.ts           # Setup do Discord.Client
│   └── player.ts            # Setup do Discord-Player
├── commands/
│   ├── _types.ts            # Interface Command
│   ├── music/               # Comandos de música
│   ├── fun/                 # Jogos
│   ├── utility/             # Utilidades
│   └── memes/               # Memes e piadas
├── lib/
│   ├── command-handler.ts   # Auto-load de comandos
│   └── command-registry.ts  # Registro de slash commands
├── services/
│   └── youtube.ts           # YouTube Data API
└── utils/
    ├── embeds.ts            # Construtores de embed
    ├── cooldown.ts          # Sistema de cooldown
    ├── games.ts             # Lógica de jogos
    └── data/                # Dados estáticos
```

## Tech Stack

- **TypeScript** — tipagem estática completa
- **discord.js v14** — SDK oficial do Discord
- **discord-player v7** — player de áudio
- **ESLint + Prettier** — linting e formatação

## Licença

ISC
