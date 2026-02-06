import { Event } from '../structures/Event';
import { BotClient } from '../structures/BotClient';
import { Interaction, EmbedBuilder, Colors } from 'discord.js';
import { CooldownService } from '../services/CooldownService';

const cooldownService = new CooldownService();

export default class InteractionCreateEvent extends Event<'interactionCreate'> {
  constructor() {
    super('interactionCreate');
  }

  async execute(client: BotClient, interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // Check if command is owner only
    if (command.ownerOnly && interaction.user.id !== client.ownerId) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription('❌ This command can only be used by the bot owner.')
        ],
        ephemeral: true
      });
      return;
    }

    // Check if command is guild only
    if (command.guildOnly && !interaction.guild) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription('❌ This command can only be used in servers.')
        ],
        ephemeral: true
      });
      return;
    }

    // Check permissions
    if (command.permissions.length > 0 && interaction.guild) {
      const member = interaction.guild.members.cache.get(interaction.user.id);
      if (member && !member.permissions.has(command.permissions)) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Red)
              .setDescription('❌ You don\'t have permission to use this command.')
          ],
          ephemeral: true
        });
        return;
      }
    }

    // Check cooldown
    if (cooldownService.isOnCooldown(command.name, interaction.user.id)) {
      const remaining = cooldownService.getRemainingCooldown(command.name, interaction.user.id);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Orange)
            .setDescription(`⏰ Please wait ${remaining} second(s) before using this command again.`)
        ],
        ephemeral: true
      });
      return;
    }

    try {
      await command.execute(interaction, client);

      // Set cooldown after successful execution
      if (command.cooldown > 0) {
        cooldownService.setCooldown(command.name, interaction.user.id, command.cooldown);
      }

      console.log(`✅ ${interaction.user.tag} used /${command.name} in ${interaction.guild?.name || 'DM'}`);
    } catch (error) {
      console.error(`❌ Error executing ${command.name}:`, error);

      const errorEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setDescription('❌ An error occurred while executing this command.');

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  }
}
