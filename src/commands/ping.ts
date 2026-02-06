import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, Colors } from 'discord.js';
import { Command } from '../structures/Command';
import { BotClient } from '../structures/BotClient';

export default class PingCommand extends Command {
  constructor() {
    super({
      name: 'ping',
      description: 'Check the bot\'s latency',
      category: 'utility',
      cooldown: 5
    });
  }

  data() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }

  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const sent = await interaction.reply({ content: '🏓 Pinging...', fetchReply: true });
    const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
    const wsLatency = client.ws.ping;

    const getLatencyColor = (ping: number): number => {
      if (ping < 100) return Colors.Green;
      if (ping < 200) return Colors.Yellow;
      return Colors.Red;
    };

    const embed = new EmbedBuilder()
      .setColor(getLatencyColor(roundtrip))
      .setTitle('🏓 Pong!')
      .addFields(
        { name: '📶 Roundtrip Latency', value: `${roundtrip}ms`, inline: true },
        { name: '💓 WebSocket Latency', value: `${wsLatency}ms`, inline: true }
      )
      .setTimestamp();

    await interaction.editReply({ content: '', embeds: [embed] });
  }
}
