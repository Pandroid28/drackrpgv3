import { 
  ChatInputCommandInteraction, 
  EmbedBuilder, 
  SlashCommandBuilder, 
  Colors} from 'discord.js';
import { Command } from '../structures/Command';
import { BotClient } from '../structures/BotClient';

export default class HelpCommand extends Command {
  constructor() {
    super({
      name: 'help',
      description: 'Show all available commands',
      category: 'utility',
      cooldown: 5
    });
  }

  data() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addStringOption(option =>
        option
          .setName('command')
          .setDescription('Get detailed help for a specific command')
          .setRequired(false)
      );
  }

  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const commandName = interaction.options.getString('command');

    if (commandName) {
      return this.showCommandHelp(interaction, client, commandName);
    }

    // Group commands by category
    const categories = new Map<string, Command[]>();
    
    client.commands.forEach(command => {
      if (!categories.has(command.category)) {
        categories.set(command.category, []);
      }
      categories.get(command.category)!.push(command);
    });

    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle('📚 Command Help')
      .setDescription('Here are all available commands. Use `/help <command>` for detailed information about a specific command.')
      .setTimestamp();

    // Add fields for each category
    categories.forEach((commands, category) => {
      const commandList = commands
        .map(cmd => `\`/${cmd.name}\` - ${cmd.description}`)
        .join('\n');

      const emoji = this.getCategoryEmoji(category);
      embed.addFields({
        name: `${emoji} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        value: commandList,
        inline: false
      });
    });

    embed.setFooter({ 
      text: `Total commands: ${client.commands.size} | Use /help <command> for details` 
    });

    await interaction.reply({ embeds: [embed] });
  }

  private async showCommandHelp(
    interaction: ChatInputCommandInteraction, 
    client: BotClient, 
    commandName: string
  ): Promise<void> {
    const command = client.commands.get(commandName);

    if (!command) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`❌ Command \`${commandName}\` not found.`)
        ],
        ephemeral: true
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle(`📖 Command: /${command.name}`)
      .setDescription(command.description)
      .addFields(
        { name: '📁 Category', value: command.category, inline: true },
        { name: '⏱️ Cooldown', value: `${command.cooldown} seconds`, inline: true }
      );

    if (command.ownerOnly) {
      embed.addFields({ name: '👑 Owner Only', value: 'Yes', inline: true });
    }

    if (command.guildOnly) {
      embed.addFields({ name: '🏠 Server Only', value: 'Yes', inline: true });
    }

    if (command.permissions.length > 0) {
      embed.addFields({
        name: '🔒 Required Permissions',
        value: command.permissions.join(', ')
      });
    }

    await interaction.reply({ embeds: [embed] });
  }

  private getCategoryEmoji(category: string): string {
    const emojis: Record<string, string> = {
      economy: '💰',
      utility: '🛠️',
      rpg: '⚔️',
      fun: '🎮',
      moderation: '🛡️',
      admin: '👑'
    };
    return emojis[category] || '📦';
  }
}
