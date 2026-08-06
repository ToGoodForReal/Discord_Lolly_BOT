# Glossário de Domínio e Linguagem Ubíqua

## Queue (Fila)
- **Definição**: Estrutura de dados do discord-player que gerencia as músicas em ordem de reprodução
- **Métodos**: `tracks.clear()` (limpa músicas), `delete()` (destrói queue e desconecta), `tracks.shuffle()` (embaralha)

## Player
- **Definição**: Instância global do discord-player que orquestra a reprodução de áudio nos canais de voz
- **Ciclo de vida**: Criado no startup, compartilhado entre todos os servidores via `useQueue(guildId)`

## Command (Comando)
- **Definição**: Objeto contendo `data` (SlashCommandBuilder) e `execute` (handler) para um slash command do Discord
- **Padrão**: Exportado como `default` em cada arquivo sob `src/commands/`

## Cooldown
- **Definição**: Mecanismo de rate-limiting por usuário que impede o uso excessivo de comandos
- **Implementação**: Map em memória com chave `${userId}-${commandName}` e cleanup a cada 60s

## Extractor
- **Definição**: Módulo do discord-player responsável por buscar e extrair metadados de músicas de fontes externas
- **Em uso**: `YoutubeiExtractor` (discord-player-youtubei) para buscas no YouTube
