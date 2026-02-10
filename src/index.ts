import { config } from 'dotenv';
import { GatewayIntentBits, Partials } from 'discord.js';
import { BotClient } from './structures/BotClient';
import { CommandHandler } from './utils/CommandHandler';
import { EventHandler } from './utils/EventHandler';
import { AutoPoster } from 'topgg-autoposter'
import express from 'express'
import {Webhook} from '@top-gg/sdk'
// Load environment variables
config();
const app = express()
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
const TOPGG_TOKEN = () => {
  if (process.env.TOPGG_TOKEN) {
    return process.env.TOPGG_TOKEN
  }
  throw Error("TOPGG_TOKEN cant be empty")
}

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
    const ap = AutoPoster(TOPGG_TOKEN(), client)
    ap.on('posted', () => {
      console.log('Posted stats to Top.gg!')
    })
    const webhook = new Webhook()

    app.post("/dblwebhook", webhook.listener(vote => {
      // vote will be your vote object, e.g
      console.log('El usuario voto:', vote.user) // 395526710101278721 < user who voted\

      // You can also throw an error to the listener callback in order to resend the webhook after a few seconds
    }))

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
app.listen(3000)
