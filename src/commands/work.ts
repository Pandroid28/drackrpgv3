import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, Colors } from 'discord.js';
import { Command } from '../structures/Command';
import { BotClient } from '../structures/BotClient';
import { DatabaseService } from '../services/DatabaseService';
import { Utils } from '../utils/Utils';

const database = new DatabaseService();
const WORK_COOLDOWN = 60 * 60 * 1000; // 1 hour

const JOBS = [
  { name: 'Developer', min: 50, max: 150, emoji: '💻' },
  { name: 'Teacher', min: 40, max: 120, emoji: '👨‍🏫' },
  { name: 'Doctor', min: 80, max: 200, emoji: '👨‍⚕️' },
  { name: 'Chef', min: 45, max: 130, emoji: '👨‍🍳' },
  { name: 'Artist', min: 35, max: 140, emoji: '🎨' },
  { name: 'Musician', min: 40, max: 160, emoji: '🎵' },
  { name: 'Streamer', min: 60, max: 180, emoji: '🎮' },
  { name: 'Athlete', min: 70, max: 190, emoji: '⚽' }
];

export default class WorkCommand extends Command {
  constructor() {
    super({
      name: 'work',
      description: 'Work to earn coins',
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
    const balance = database.getBalance(interaction.user.id);
    const lastWork = balance.lastDaily; // Reusing lastDaily for work cooldown

    if (!Utils.canClaim(lastWork, WORK_COOLDOWN)) {
      const remaining = Utils.getClaimCooldown(lastWork, WORK_COOLDOWN);
      const timeLeft = Utils.formatDuration(remaining);

      const embed = new EmbedBuilder()
        .setColor(Colors.Orange)
        .setDescription(`⏰ You're tired! Rest for **${timeLeft}** before working again.`)
        .setFooter({ text: 'You can work once per hour' });

      await interaction.reply({ embeds: [embed] });
      return;
    }

    // Random job and earnings
    const job = Utils.randomElement(JOBS);
    const earnings = Utils.randomInt(job.min, job.max);

    // Bonus chance (10%)
    const bonusChance = Math.random() < 0.1;
    const bonus = bonusChance ? Math.floor(earnings * 0.5) : 0;
    const totalEarnings = earnings + bonus;

    // Update balance
    database.addCoins(interaction.user.id, totalEarnings);

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`${job.emoji} Work Complete!`)
      .setDescription(`You worked as a **${job.name}** and earned:`)
      .addFields(
        { name: '💰 Base Earnings', value: `${Utils.formatNumber(earnings)} coins`, inline: true }
      );

    if (bonusChance) {
      embed.addFields(
        { name: '✨ Bonus!', value: `+${Utils.formatNumber(bonus)} coins`, inline: true }
      );
      embed.setFooter({ text: 'Lucky! You got a bonus!' });
    }

    embed.addFields(
      { name: '📊 Total', value: `**${Utils.formatNumber(totalEarnings)} coins**`, inline: false }
    );

    const newBalance = database.getBalance(interaction.user.id);
    embed.addFields(
      { name: '💼 Your Balance', value: `${Utils.formatNumber(newBalance.coins)} coins`, inline: false }
    );

    embed.setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
}
