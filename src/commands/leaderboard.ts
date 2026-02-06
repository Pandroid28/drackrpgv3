import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, Colors } from 'discord.js';
import { Command } from '../structures/Command';
import { BotClient } from '../structures/BotClient';
import { DatabaseService } from '../services/DatabaseService';
import { Utils } from '../utils/Utils';

const database = new DatabaseService();

export default class LeaderboardCommand extends Command {
  constructor() {
    super({
      name: 'leaderboard',
      description: 'View the richest users',
      category: 'economy',
      cooldown: 5
    });
  }

  data() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addIntegerOption(option =>
        option
          .setName('limit')
          .setDescription('Number of users to show (1-25)')
          .setMinValue(1)
          .setMaxValue(25)
          .setRequired(false)
      );
  }

  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const limit = interaction.options.getInteger('limit') || 10;
    const topUsers = database.getTopUsers(limit);

    if (topUsers.length === 0) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Orange)
            .setDescription('📊 No users found in the leaderboard.')
        ]
      });
      return;
    }

    const leaderboardText = await Promise.all(
      topUsers.map(async (balance, index) => {
        const user = await client.users.fetch(balance.userId).catch(() => null);
        const username = user ? user.username : 'Unknown User';
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        
        return `${medal} **${username}** - 💰 ${Utils.formatNumber(balance.coins ?? 0)} coins`;
      })
    );

    const embed = new EmbedBuilder()
      .setColor(Colors.Gold)
      .setTitle('🏆 Leaderboard - Top Users')
      .setDescription(leaderboardText.join('\n'))
      .setTimestamp()
      .setFooter({ text: `Showing top ${topUsers.length} users` });

    // Add user's position if not in top list
    const userBalance = database.getBalance(interaction.user.id);
    const allUsers = database.getAllBalances().sort((a, b) => b.coins - a.coins);
    const userPosition = allUsers.findIndex(b => b.userId === interaction.user.id) + 1;

    if (userPosition > limit) {
      embed.addFields({
        name: 'Your Position',
        value: `#${userPosition} - 💰 ${Utils.formatNumber(userBalance.coins)} coins`
      });
    }

    await interaction.reply({ embeds: [embed] });
  }
}
