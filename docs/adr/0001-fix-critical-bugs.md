# ADR 0001: Correção de Bugs Críticos e Melhorias de Qualidade
- **Status**: Aceito | **Data**: 2026-08-05

## Contexto
O projeto Lolly Bot v2.0.0 foi migrado de JavaScript para TypeScript com estrutura modular. A análise identificou 3 bugs críticos, 4 erros ESLint e 6 melhorias de qualidade que comprometem a funcionalidade e a manutenibilidade do bot.

## Decisões

### 1. `/clear` deve limpar a fila, não destruir a queue
- **Problema**: `queue.delete()` destrói a queue inteira e desconecta o bot do canal de voz
- **Decisão**: Usar `queue.tracks.clear()` que remove apenas as músicas da fila mantendo a conexão

### 2. Thumbnails via avatar do bot
- **Problema**: URLs do Google Drive não são renderizadas em embeds do Discord
- **Decisão**: Remover URLs estáticas do Google Drive e usar `client.user.displayAvatarURL()` dinamicamente

### 3. Admin reload via REST API
- **Problema**: O handler de reload era um shell vazio com `forEach` async não aguardado
- **Decisão**: Implementar reload real registrando comandos via REST API do Discord

### 4. Cleanup de dependências mortas
- **Problema**: `mediaplex` e `ytdl-core-discord` instalados mas não usados
- **Decisão**: Remover do package.json com `npm uninstall`

### 5. Memory leak no `/guess`
- **Problema**: `setTimeout` continua rodando mesmo após o jogo terminar
- **Decisão**: Armazenar timer ID e cancelar com `clearTimeout` ao encerrar o jogo
