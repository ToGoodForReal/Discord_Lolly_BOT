const cooldowns = new Map<string, number>();

interface CooldownResult {
  onCooldown: boolean;
  timeLeft?: string;
}

export function checkCooldown(userId: string, commandName: string, cooldownMs = 3_000): CooldownResult {
  const key = `${userId}-${commandName}`;
  const now = Date.now();

  const existing = cooldowns.get(key);
  if (existing !== undefined) {
    const expiration = existing + cooldownMs;
    if (now < expiration) {
      return { onCooldown: true, timeLeft: ((expiration - now) / 1_000).toFixed(1) };
    }
  }

  cooldowns.set(key, now);
  return { onCooldown: false };
}

// Cleanup expired entries every 60s
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of cooldowns.entries()) {
    if (now - timestamp > 60_000) {
      cooldowns.delete(key);
    }
  }
}, 60_000);
