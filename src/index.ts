import { config } from 'dotenv';
import { GatewayIntentBits, Partials } from 'discord.js';
import { BotClient } from './structures/BotClient';
import { CommandHandler } from './utils/CommandHandler';
import { EventHandler } from './utils/EventHandler';

// Load environment variables
config();

// Validate environment variables
const requiredEnvVars = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID', 'OWNER_ID'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Create bot client
const client = new BotClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember
  ],
  ownerId: process.env.OWNER_ID!
});

// Initialize handlers
const commandHandler = new CommandHandler(client);
const eventHandler = new EventHandler(client);

// Start bot
async function start() {
  try {
    console.log('🚀 Starting bot...');

    // Load events first
    await eventHandler.loadEvents();

    // Load commands
    await commandHandler.loadCommands();

    // Login to Discord
    await client.login(process.env.DISCORD_TOKEN!);

    // Register commands after login
    await commandHandler.registerCommands(
      process.env.DISCORD_TOKEN!,
      process.env.DISCORD_CLIENT_ID!
    );

  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

// Handle process events
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

// Start the bot
start();
