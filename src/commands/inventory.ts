import { 
  ChatInputCommandInteraction, 
  EmbedBuilder, 
  SlashCommandBuilder, 
  Colors} from 'discord.js';
import { Command } from '../structures/Command';
import { BotClient } from '../structures/BotClient';
import { PocketBaseService } from '../services/PocketBaseService';

const database = new PocketBaseService();

export default class InventoryCommand extends Command {
  constructor() {
    super({
      name: 'inventory',
      description: 'View your inventory or another user\'s inventory',
      category: 'economy',
      cooldown: 3
    });
  }

  data(){
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addUserOption(option =>
        option
          .setName('user')
          .setDescription('The user to check inventory for')
          .setRequired(false)
      );
  }

  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const balance = await database.getBalance(targetUser.id);

    if (balance.inventory.length === 0) {
      const embed = new EmbedBuilder()
        .setColor(Colors.Orange)
        .setAuthor({
          name: `${targetUser.username}'s Inventory`,
          iconURL: targetUser.displayAvatarURL()
        })
        .setDescription('🎒 The inventory is empty.')
        .setFooter({ text: 'Use /shop to buy items' });

      await interaction.reply({ embeds: [embed] });
      return;
    }

    // Group items by type
    const itemsByType = balance.inventory.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {} as Record<string, typeof balance.inventory>);

    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setAuthor({
        name: `${targetUser.username}'s Inventory`,
        iconURL: targetUser.displayAvatarURL()
      })
      .setDescription(`Total items: **${balance.inventory.length}**\n`)
      .setTimestamp();

    // Add fields for each item type
    for (const [type, items] of Object.entries(itemsByType)) {
      const itemList = items
        .map(item => `**${item.name}** x${item.quantity}`)
        .join('\n');

      const emoji = this.getTypeEmoji(type);
      embed.addFields({
        name: `${emoji} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        value: itemList,
        inline: true
      });
    }

    await interaction.reply({ embeds: [embed] });
  }

  private getTypeEmoji(type: string): string {
    const emojis: Record<string, string> = {
      weapon: '⚔️',
      armor: '🛡️',
      consumable: '🧪',
      material: '📦',
      special: '✨'
    };
    return emojis[type] || '📦';
  }
}
