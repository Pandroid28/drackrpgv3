import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, Colors, SlashCommandOptionsOnlyBuilder } from 'discord.js';
import { Command } from '../structures/Command';
import { BotClient } from '../structures/BotClient';
import { PocketBaseService } from '../services/PocketBaseService';
import { Utils } from '../utils/Utils';

const database = new PocketBaseService();

export default class BalanceCommand extends Command {
  constructor() {
    super({
      name: 'balance',
      description: 'Check your balance or another user\'s balance',
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
          .setDescription('The user to check balance for')
          .setRequired(false)
      );
  }

  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const balance = await database.getBalance(targetUser.id);

    const embed = new EmbedBuilder()
      .setColor(Colors.Gold)
      .setAuthor({
        name: `${targetUser.username}'s Balance`,
        iconURL: targetUser.displayAvatarURL()
      })
      .addFields(
        { name: '💰 Coins', value: Utils.formatNumber(balance.coins), inline: true },
        { name: '💎 Gems', value: Utils.formatNumber(balance.gems), inline: true },
        { name: '🎒 Inventory Items', value: balance.inventory.length.toString(), inline: true }
      )
      .setTimestamp()
      .setFooter({ text: `User ID: ${targetUser.id}` });

    await interaction.reply({ embeds: [embed] });
  }
}