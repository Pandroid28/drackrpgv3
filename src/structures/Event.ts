import { ClientEvents } from 'discord.js';
import { BotClient } from './BotClient';

export abstract class Event<K extends keyof ClientEvents = keyof ClientEvents> {
  public name: K;
  public once: boolean;

  constructor(name: K, once: boolean = false) {
    this.name = name;
    this.once = once;
  }

  abstract execute(client: BotClient, ...args: ClientEvents[K]): Promise<void> | void;
}
