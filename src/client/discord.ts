import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { config } from '../config/env.js';

export function createClient(): Client {
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildPresences,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  });
}

export async function login(client: Client): Promise<void> {
  await client.login(config.token);
}
