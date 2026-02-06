export interface UserBalance {
  userId: string;
  coins: number;
  gems: number;
  lastDaily?: number;
  lastWeekly?: number;
  inventory: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  type: ItemType;
}

export enum ItemType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  CONSUMABLE = 'consumable',
  MATERIAL = 'material',
  SPECIAL = 'special'
}

export interface PlayerStats {
  userId: string;
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  wins: number;
  losses: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  rewards: QuestReward;
  requirements: QuestRequirement;
  completed: boolean;
}

export interface QuestReward {
  coins?: number;
  gems?: number;
  experience?: number;
  items?: InventoryItem[];
}

export interface QuestRequirement {
  level?: number;
  items?: string[];
  completedQuests?: string[];
}
