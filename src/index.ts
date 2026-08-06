import { createClient, login } from './client/discord.js';
import { createPlayer } from './client/player.js';
import { loadCommands } from './lib/command-handler.js';
import { config } from './config/env.js';
import { createEmbed } from './utils/embeds.js';

async function main(): Promise<void> {
  console.log('\n🍭 Iniciando Lolly Bot...\n');

  // Validate environment
  console.log('  → Validando configuração...');
  // env.ts already validates on import

  // Create Discord client
  console.log('  → Criando cliente Discord...');
  const client = createClient();

  // Create player
  console.log('  → Configurando player de áudio...');
  createPlayer(client);

  // Load commands
  console.log('  → Carregando comandos...');
  const commands = await loadCommands();
  console.log(`  → ${commands.size} comandos carregados.\n`);

  // Ready
  client.on('ready', (readyClient) => {
    console.log(`  ✓ Logado como ${readyClient.user.tag}`);
    console.log(`  ✓ Presente em ${readyClient.guilds.cache.size} servidor(es)\n`);
  });

  // Prevent application crashes on unhandled errors/rejections
  process.on('unhandledRejection', (reason: unknown) => {
    console.error('  ✗ Unhandled Rejection:', reason);
  });

  process.on('uncaughtException', (err: Error) => {
    console.error('  ✗ Uncaught Exception:', err);
  });

  // Command handler
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) {
      console.error(`Comando não encontrado: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Erro no comando ${interaction.commandName}:`, error);

      const errorEmbed = createEmbed(
        '#ff6b6b',
        '❌ Erro',
        'Ocorreu um erro ao executar o comando. Tente novamente.',
        undefined,
        undefined,
        { text: 'Se persistir, contate um administrador.' },
      );

      try {
        if (interaction.deferred || interaction.replied) {
          await interaction.followUp({ embeds: [errorEmbed], ephemeral: true }).catch(() => {});
        } else {
          await interaction.reply({ embeds: [errorEmbed], ephemeral: true }).catch(() => {});
        }
      } catch {
        // Ignora erros de interação expirada
      }
    }
  });

  // Admin reload command via message
  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content !== 'adminReload') return;
    if (message.author.id !== config.adminId) {
      await message.reply({ content: `${message.author}, você não tem permissão para reload!` });
      return;
    }

    await message.reply({
      content: `Iniciando reload de comandos para **todos os servidores**...`,
    });

    try {
      const collectedCommands = await loadCommands();
      const commandsData = collectedCommands.map((cmd) => {
        const builder = cmd.data as unknown as { toJSON: () => Record<string, unknown> };
        return builder.toJSON ? builder.toJSON() : {};
      });

      const { REST, Routes } = await import('discord.js');
      const rest = new REST({ version: '10' }).setToken(config.token);
      await rest.put(Routes.applicationCommands(config.clientId), { body: commandsData });

      await message.channel.send(`✅ ${collectedCommands.size} comandos re-registrados globalmente!`);
    } catch (error) {
      console.error('Erro ao re-registrar comandos:', error);
      await message.channel.send('❌ Erro ao re-registrar comandos. Verifique o log.');
    }
  });

  // Login
  console.log('  → Fazendo login...\n');
  await login(client);
}

main().catch((error) => {
  console.error('Falha ao iniciar o bot:', error);
  process.exit(1);
});
