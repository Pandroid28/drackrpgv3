import { Collection } from 'discord.js';

export class CooldownService {
  private cooldowns: Collection<string, Collection<string, number>>;

  constructor() {
    this.cooldowns = new Collection();
  }

  public isOnCooldown(commandName: string, userId: string): boolean {
    if (!this.cooldowns.has(commandName)) {
      return false;
    }

    const timestamps = this.cooldowns.get(commandName)!;
    if (!timestamps.has(userId)) {
      return false;
    }

    const expirationTime = timestamps.get(userId)!;
    return Date.now() < expirationTime;
  }

  public getRemainingCooldown(commandName: string, userId: string): number {
    if (!this.isOnCooldown(commandName, userId)) {
      return 0;
    }

    const timestamps = this.cooldowns.get(commandName)!;
    const expirationTime = timestamps.get(userId)!;
    return Math.ceil((expirationTime - Date.now()) / 1000);
  }

  public setCooldown(commandName: string, userId: string, cooldownSeconds: number): void {
    if (!this.cooldowns.has(commandName)) {
      this.cooldowns.set(commandName, new Collection());
    }

    const timestamps = this.cooldowns.get(commandName)!;
    const expirationTime = Date.now() + (cooldownSeconds * 1000);
    timestamps.set(userId, expirationTime);

    setTimeout(() => {
      timestamps.delete(userId);
      if (timestamps.size === 0) {
        this.cooldowns.delete(commandName);
      }
    }, cooldownSeconds * 1000);
  }

  public clearCooldown(commandName: string, userId: string): void {
    if (!this.cooldowns.has(commandName)) {
      return;
    }

    const timestamps = this.cooldowns.get(commandName)!;
    timestamps.delete(userId);

    if (timestamps.size === 0) {
      this.cooldowns.delete(commandName);
    }
  }
}
