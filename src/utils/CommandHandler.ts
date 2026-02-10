import { readdirSync } from 'fs';
import { join } from 'path';
import { BotClient } from '../structures/BotClient';
import { Command } from '../structures/Command';
import { REST, Routes } from 'discord.js';
import { log } from 'console';

export class CommandHandler {
  private client: BotClient;

  constructor(client: BotClient) {
    this.client = client;
  }

  async loadCommands(): Promise<void> {
    const commandsPath = join(__dirname, '../commands');
    const commandFiles = readdirSync(commandsPath).filter(file => 
      file.endsWith('.ts') || file.endsWith('.js')
    );

    for (const file of commandFiles) {
      try {
        const filePath = join(commandsPath, file);
        const { default: CommandClass } = await import(filePath);
        log(file)
        log(filePath)
        if (!CommandClass) {
          console.warn(`⚠️  ${file} doesn't have a default export`);
          continue;
        }

        const command: Command = new CommandClass();
        this.client.commands.set(command.name, command);
        console.log(`✅ Loaded command: ${command.name}`);
      } catch (error) {
        console.error(`❌ Error loading command ${file}:`, error);
      }
    }
  }

  async registerCommands(token: string, clientId: string): Promise<void> {
    const commands = Array.from(this.client.commands.values()).map(cmd => {
      const commandData = cmd.data();
      return commandData.toJSON();
    });

    const rest = new REST().setToken(token);

    try {
      console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);

      const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      ) as any[];

      console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      console.error('❌ Error registering commands:', error);
    }
  }
}