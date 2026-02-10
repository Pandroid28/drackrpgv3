interface user {
  id?: string
  userId: string
  coins: number
  armor: number
  guiild: drackGUild
  inventory:inventory // JSON string
  currentHealth: number
  maxHealth: number
  location: location
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
interface drackGUild {
    name: string
    leader: user
    coLeader: user
    veterans: [user]
    members: [user]
    creator: user
}

interface inventory {
objCounter: number
capacity: number
objects:[drackObject]

}

interface drackObject {
    name: string
    health: number 
    price: number 
    cost: number
    canBuy: boolean
    canSell: boolean
    canShare: boolean
    canCraft:boolean
    isUsable: boolean
    rarity: objectRarity
}

interface cooldown { 
  id: string              // Identificador
  name: string            // Nombre del cooldown
  timeRemaining: number   // Tiempo restante (ms)
  eta: number             // Timestamp de finalización
  type: cooldownType      // Tipo de cooldown
}
enum cooldownType {
  GOLD = 1,    // Oro
  IRON = 2,    // Hierro
  WOOD = 3,    // Madera
  DAILY = 4,   // Diario
  WEEKLY = 5,  // Semanal
  BATTLE = 6,  // Batalla
}

interface power {
    //For each object extends from  DrackObject
    weapon: weapon,
    shield: shield,
    helmet: helmet,
    chestplate: chestplate,
    neckplace: neckplace,
    ring: ring
  }
interface weapon extends drackObject {
    damage: number

}

interface shield extends drackObject {
    protection: number
}

interface craftingRecipe {
  id: string;
  result: drackObject;
  materials: materialRecipe[];
  requiredLevel: number;
  craftingTime: number;
}

interface materialRecipe {
    item: drackObject
    quantity:number
}

enum objectRarity {
  COMMON,      // ⚪ Común
  UNCOMMON,    // 🟢 Poco común
  RARE,        // 🔵 Raro
  EPIC,        // 🟣 Épico
  LEGENDARY,   // 🟡 Legendario
  MYTHIC,      // 🔴 Mítico
}