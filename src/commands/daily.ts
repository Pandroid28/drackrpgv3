import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, Colors } from 'discord.js';
import { Command } from '../structures/Command';
import { BotClient } from '../structures/BotClient';
import { PocketBaseService } from '../services/PocketBaseService';
import { Utils } from '../utils/Utils';

const database = new PocketBaseService();
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours
const DAILY_REWARD = { coins: 100, gems: 5 };

export default class DailyCommand extends Command {
  constructor() {
    super({
      name: 'daily',
      description: 'Claim your daily reward',
      category: 'economy',
      cooldown: 5
    });
  }

  data() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }

  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const balance = await database.getBalance(interaction.user.id);

    if (!Utils.canClaim(balance.lastDaily, DAILY_COOLDOWN)) {
      const remaining = Utils.getClaimCooldown(balance.lastDaily, DAILY_COOLDOWN);
      const timeLeft = Utils.formatDuration(remaining);

      const embed = new EmbedBuilder()
        .setColor(Colors.Orange)
        .setDescription(`⏰ You've already claimed your daily reward!\n\nCome back in **${timeLeft}**`)
        .setFooter({ text: 'Daily rewards reset every 24 hours' });

      await interaction.reply({ embeds: [embed] });
      return;
    }

    // Update balance
    database.addCoins(interaction.user.id, DAILY_REWARD.coins);
    database.addGems(interaction.user.id, DAILY_REWARD.gems);
    database.updateBalance(interaction.user.id, { lastDaily: Date.now() });

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle('✅ Daily Reward Claimed!')
      .setDescription(`You received your daily reward!`)
      .addFields(
        { name: '💰 Coins', value: `+${Utils.formatNumber(DAILY_REWARD.coins)}`, inline: true },
        { name: '💎 Gems', value: `+${Utils.formatNumber(DAILY_REWARD.gems)}`, inline: true }
      )
      .setFooter({ text: 'Come back tomorrow for more rewards!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
}