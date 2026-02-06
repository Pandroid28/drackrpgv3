import { ActivityType } from 'discord.js';
import { Event } from '../structures/Event';
import { BotClient } from '../structures/BotClient';

export default class ReadyEvent extends Event<'ready'> {
  constructor() {
    super('ready', true);
  }

  async execute(client: BotClient): Promise<void> {
    console.log(`✅ Logged in as ${client.user?.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} guilds`);
    console.log(`👥 Watching ${client.users.cache.size} users`);
    console.log(`🎮 Loaded ${client.commands.size} commands`);

    // Set bot presence
    client.user?.setPresence({
      activities: [{
        name: 'RPG Adventure',
        type: ActivityType.Playing
      }],
      status: 'online'
    });

    // Update presence every 5 minutes
    setInterval(() => {
      const activities = [
        { name: 'RPG Adventure', type: ActivityType.Playing },
        { name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching },
        { name: '/help for commands', type: ActivityType.Listening }
      ];

      const activity = activities[Math.floor(Math.random() * activities.length)];
      client.user?.setPresence({
        activities: [activity],
        status: 'online'
      });
    }, 5 * 60 * 1000);
  }
}
