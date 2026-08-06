import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../config/env.js';
import type { Command } from '../commands/_types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');
const COMMANDS_DIR = resolve(__dirname, '..', 'commands');

async function findTsFiles(dir: string): Promise<string[]> {
  const results: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      results.push(...(await findTsFiles(fullPath)));
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.ts') || entry.name.endsWith('.js')) &&
      !entry.name.endsWith('.d.ts') &&
      !entry.name.endsWith('_types.ts')
    ) {
      results.push(fullPath);
    }
  }

  return results;
}

async function collectCommands(): Promise<Command[]> {
  const files = await findTsFiles(COMMANDS_DIR);
  const commands: Command[] = [];

  for (const file of files) {
    const mod = await import(file);
    const command = (mod as { default?: Command }).default;
    if (command?.data) {
      commands.push(command);
    }
  }

  return commands;
}

async function register(guildId?: string): Promise<void> {
  const commands = await collectCommands();
  const commandsData = commands.map((c) => {
    const builder = c.data as unknown as { toJSON: () => Record<string, unknown> };
    return builder.toJSON ? builder.toJSON() : {};
  });

  const rest = new REST({ version: '10' }).setToken(config.token);

  try {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(config.clientId, guildId), { body: commandsData });
      console.log(`Comandos registrados no servidor ${guildId}`);
    } else {
      await rest.put(Routes.applicationCommands(config.clientId), { body: commandsData });
      console.log('Comandos registrados globalmente');
    }
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
  }
}

const guildId = process.argv[2];
register(guildId);
