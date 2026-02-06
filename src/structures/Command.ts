import { 
  ChatInputCommandInteraction, 
  SlashCommandBuilder,
  PermissionResolvable, 
  SlashCommandOptionsOnlyBuilder
} from 'discord.js';
import { BotClient } from './BotClient';

export interface CommandOptions {
  name: string;
  description: string;
  category: string;
  cooldown?: number;
  ownerOnly?: boolean;
  guildOnly?: boolean;
  permissions?: PermissionResolvable[];
}

export abstract class Command {
  public name: string;
  public description: string;
  public category: string;
  public cooldown: number;
  public ownerOnly: boolean;
  public guildOnly: boolean;
  public permissions: PermissionResolvable[];

  constructor(options: CommandOptions) {
    this.name = options.name;
    this.description = options.description;
    this.category = options.category;
    this.cooldown = options.cooldown ?? 3;
    this.ownerOnly = options.ownerOnly ?? false;
    this.guildOnly = options.guildOnly ?? false;
    this.permissions = options.permissions ?? [];
  }

  abstract data(): SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>| SlashCommandOptionsOnlyBuilder;
  abstract execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void>;
}