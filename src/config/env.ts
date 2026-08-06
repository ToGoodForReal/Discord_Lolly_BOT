import 'dotenv/config';

const requiredVars: readonly (keyof Required<ProcessEnv>)[] = ['TOKEN', 'CLIENT_ID', 'API_YOUTUBE', 'ADMIN_ID'];

interface ProcessEnv {
  TOKEN?: string;
  CLIENT_ID?: string;
  API_YOUTUBE?: string;
  ADMIN_ID?: string;
}

function validate(): void {
  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${missing.join(', ')}\nCopie .env.example para .env e preencha.`);
  }
}

validate();

export const config = {
  token: process.env.TOKEN!,
  clientId: process.env.CLIENT_ID!,
  apiKey: process.env.API_YOUTUBE!,
  adminId: process.env.ADMIN_ID!,
} as const;
