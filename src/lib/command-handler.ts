import { readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Collection } from 'discord.js';
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

export async function loadCommands(): Promise<Collection<string, Command>> {
  const commands = new Collection<string, Command>();
  const files = await findTsFiles(COMMANDS_DIR);

  for (const file of files) {
    try {
      const mod = await import(file);
      const command = (mod as { default?: Command }).default;

      if (command && command.data && typeof command.execute === 'function') {
        // Extract name from the command data builder
        const builder = command.data as unknown as { toJSON: () => { name: string } };
        if (builder.toJSON) {
          const data = builder.toJSON();
          commands.set(data.name, command);
          console.log(`  ✓ Comando carregado: ${data.name}`);
        }
      }
    } catch (error) {
      console.error(`  ✗ Erro ao carregar ${file}:`, error);
    }
  }

  return commands;
}
