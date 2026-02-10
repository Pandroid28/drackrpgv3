import PocketBase from 'pocketbase';
import { UserBalance, InventoryItem } from '../types/RPGTypes';

interface User {
  id?: string;
  userId: string;
  coins: number;
  armor: number
  guiild: DrackGUild
  inventory: Inventory; // JSON string
  currentHealth: number
  maxHealth: number
  location: Location
  currentXp: number
  maxExperience:number
  damage:number
  power: []
//  cooldowns: [cooldown]
  level: number
  codes:[string]
  ping:string
  created?: string;
  updated?: string;
}
interface DrackGUild {
    name: string
    leader: User
    coLeader: User
    veterans: [User]
    members: [User]
    creator: User
}
/*
inventory {
objCounter: number = 0 
capacity: number =16
objects:[DrackObject]

}

abstrac DrackObject {
    name: string
    health: number 
    price: number 
    cost: number
    canBuy: bool
    canSell: bool
    canShare: bool
    canCraft:bool
    isUsable: bool
}

cooldown {
    id:string    
    name: string
    timeReamining: number
    Eta: number
    type: number // oro: 1, iron: 2, wood:3
}

power {
    For each object extends from  DrackObject
    weapon: weapon,
    shield: shield,
    helmet: helmet,
    chestplate: chestplate,
    neckplace: neckplace,
    ring: ring
  }

*/
export class PocketBaseService {
  private pb: PocketBase;
  private collectionName = 'dk_user_balances';
  private isAuthenticated = false;

  constructor() {
    const pbUrl = process.env.POCKETBASE_URL;
    if (!pbUrl) {
      throw new Error('POCKETBASE_URL is not defined in environment variables');
    }

    this.pb = new PocketBase(pbUrl);
    this.authenticate();
  }

  private async authenticate(): Promise<void> {
    try {
      const email = process.env.POCKETBASE_ADMIN_EMAIL;
      const password = process.env.POCKETBASE_ADMIN_PASSWORD;

      if (!email || !password) {
        console.warn('⚠️  PocketBase credentials not set. Some features may not work.');
        return;
      }

      await this.pb.collection("_superusers").authWithPassword(email, password);
      this.isAuthenticated = true;
      console.log('✅ Authenticated with PocketBase');
    } catch (error) {
      console.error('❌ Failed to authenticate with PocketBase:', error);
      throw error;
    }
  }

  private parseInventory(inventory: string | InventoryItem[]): InventoryItem[] {
    if (Array.isArray(inventory)) return inventory;
    try {
      return JSON.parse(inventory);
    } catch {
      return [];
    }
  }

  private stringifyInventory(inventory: InventoryItem[]): string {
    return JSON.stringify(inventory);
  }

  private convertFromPB(record: UserBalance): UserBalance {
    return {
      userId: record.userId,
      coins: record.coins,
      gems: record.gems,
      lastDaily: record.lastDaily,
      lastWeekly: record.lastWeekly,
      inventory: this.parseInventory(record.inventory)
    };
  }

  private convertToPB(balance: Partial<UserBalance>): Partial<UserBalance> {
    const data: Partial<UserBalance> = {
      userId: balance.userId,
      coins: balance.coins,
      gems: balance.gems,
      lastDaily: balance.lastDaily,
      lastWeekly: balance.lastWeekly
    };
//pending
    if (balance.inventory) {
      data.inventory = this.stringifyInventory(balance.inventory);
    }

    return data;
  }

  public async getBalance(userId: string): Promise<UserBalance> {
    try {
      const records = await this.pb.collection(this.collectionName).getList<UserBalance>(1, 1, {
        filter: `userId = "${userId}"`
      });

      if (records.items.length > 0) {
        return this.convertFromPB(records.items[0]);
      }

      const newBalance: UserBalance = {
        userId,
        coins: 0,
        gems: 0,
        inventory: []
      };

      const created = await this.pb.collection(this.collectionName).create<UserBalance>(
        this.convertToPB(newBalance)
      );

      return this.convertFromPB(created);
    } catch (error) {
      console.error('❌ Error getting balance:', error);
      return {
        userId,
        coins: 0,
        gems: 0,
        inventory: []
      };
    }
  }

  public async updateBalance(userId: string, update: Partial<UserBalance>): Promise<UserBalance> {
    try {
      const records = await this.pb.collection(this.collectionName).getList<UserBalance>(1, 1, {
        filter: `userId = "${userId}"`
      });

      if (records.items.length === 0) {
        const newBalance = { userId, ...update };
        const created = await this.pb.collection(this.collectionName).create<UserBalance>(
          this.convertToPB(newBalance as UserBalance)
        );
        return this.convertFromPB(created);
      }

      const recordId = records.items[0].userId!;
      const updated = await this.pb.collection(this.collectionName).update<UserBalance>(
        recordId,
        this.convertToPB(update)
      );

      return this.convertFromPB(updated);
    } catch (error) {
      console.error('❌ Error updating balance:', error);
      throw error;
    }
  }

  public async addCoins(userId: string, amount: number): Promise<number> {
    const balance = await this.getBalance(userId);
    const newCoins = balance.coins + amount;
    await this.updateBalance(userId, { coins: newCoins });
    return newCoins;
  }

  public async removeCoins(userId: string, amount: number): Promise<boolean> {
    const balance = await this.getBalance(userId);
    if (balance.coins < amount) return false;
    await this.updateBalance(userId, { coins: balance.coins - amount });
    return true;
  }

  public async addGems(userId: string, amount: number): Promise<number> {
    const balance = await this.getBalance(userId);
    const newGems = balance.gems + amount;
    await this.updateBalance(userId, { gems: newGems });
    return newGems;
  }

  public async addItem(userId: string, item: InventoryItem): Promise<void> {
    const balance = await this.getBalance(userId);
    const existing = balance.inventory.find(i => i.id === item.id);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      balance.inventory.push(item);
    }

    await this.updateBalance(userId, { inventory: balance.inventory });
  }

  public async removeItem(userId: string, itemId: string, quantity: number = 1): Promise<boolean> {
    const balance = await this.getBalance(userId);
    const itemIndex = balance.inventory.findIndex(i => i.id === itemId);

    if (itemIndex === -1) return false;

    const item = balance.inventory[itemIndex];
    if (item.quantity < quantity) return false;

    item.quantity -= quantity;
    if (item.quantity === 0) {
      balance.inventory.splice(itemIndex, 1);
    }

    await this.updateBalance(userId, { inventory: balance.inventory });
    return true;
  }

  public async getAllBalances(): Promise<UserBalance[]> {
    try {
      const records = await this.pb.collection(this.collectionName).getFullList<UserBalance>({
        sort: '-coins'
      });
      return records.map(record => this.convertFromPB(record));
    } catch (error) {
      console.error('❌ Error getting all balances:', error);
      return [];
    }
  }

  public async getTopUsers(limit: number = 10): Promise<UserBalance[]> {
    try {
      const records = await this.pb.collection(this.collectionName).getList<UserBalance>(1, limit, {
        sort: '-coins'
      });
      return records.items.map(record => this.convertFromPB(record));
    } catch (error) {
      console.error('❌ Error getting top users:', error);
      return [];
    }
  }

  public async importFromJSON(jsonData: Record<string, UserBalance>): Promise<void> {
    console.log('🔄 Starting migration from JSON to PocketBase...');
    let imported = 0;
    let errors = 0;

    for (const [userId, balance] of Object.entries(jsonData)) {
      try {
        const existing = await this.pb.collection(this.collectionName).getList<UserBalance>(1, 1, {
          filter: `userId = "${userId}"`
        });

        if (existing.items.length > 0) {
          console.log(`⚠️  User ${userId} already exists, skipping...`);
          continue;
        }

        await this.pb.collection(this.collectionName).create<UserBalance>(
          this.convertToPB(balance)
        );
        imported++;
        console.log(`✅ Imported user ${userId}`);
      } catch (error) {
        console.error(`❌ Error importing user ${userId}:`, error);
        errors++;
      }
    }

    console.log(`\n✅ Migration complete! Imported: ${imported}, Errors: ${errors}`);
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.pb.health.check();
      return true;
    } catch (error) {
      console.error('❌ PocketBase health check failed:', error);
      return false;
    }
  }
}