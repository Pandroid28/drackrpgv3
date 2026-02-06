import { readdirSync } from 'fs';
import { join } from 'path';
import { BotClient } from '../structures/BotClient';
import { Event } from '../structures/Event';

export class EventHandler {
  private client: BotClient;

  constructor(client: BotClient) {
    this.client = client;
  }

  async loadEvents(): Promise<void> {
    const eventsPath = join(__dirname, '../events');
    const eventFiles = readdirSync(eventsPath).filter(file => 
      file.endsWith('.ts') || file.endsWith('.js')
    );

    for (const file of eventFiles) {
      try {
        const filePath = join(eventsPath, file);
        const { default: EventClass } = await import(filePath);
        
        if (!EventClass) {
          console.warn(`⚠️  ${file} doesn't have a default export`);
          continue;
        }

        const event: Event = new EventClass();

        if (event.once) {
          this.client.once(event.name, (...args) => event.execute(this.client, ...args));
        } else {
          this.client.on(event.name, (...args) => event.execute(this.client, ...args));
        }

        console.log(`✅ Loaded event: ${event.name}${event.once ? ' (once)' : ''}`);
      } catch (error) {
        console.error(`❌ Error loading event ${file}:`, error);
      }
    }
  }
}
