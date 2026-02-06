import { Client, ClientOptions, Collection } from 'discord.js';
import { Command } from './Command';

export interface BotClientOptions extends ClientOptions {
  ownerId: string;
}

export class BotClient extends Client {
  public commands: Collection<string, Command>;
  public ownerId: string;

  constructor(options: BotClientOptions) {
    super(options);
    this.commands = new Collection();
    this.ownerId = options.ownerId;
  }
}
