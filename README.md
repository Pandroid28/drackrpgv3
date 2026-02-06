# RPG Discord Bot - TypeScript Refactor

Un bot de Discord RPG completamente refactorizado con TypeScript, Discord.js v14 y arquitectura event-driven.

## 🚀 Características

- ✅ TypeScript con tipado estricto
- ✅ Discord.js v14 con Slash Commands
- ✅ Arquitectura event-driven modular
- ✅ Sistema de economía (monedas y gemas)
- ✅ Sistema de inventario
- ✅ Recompensas diarias
- ✅ Leaderboard global
- ✅ Sistema de cooldowns
- ✅ Manejo robusto de errores

## 📋 Requisitos

- Node.js 18.0.0 o superior
- npm o yarn
- Un bot de Discord (token y client ID)

## 🛠️ Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Copia `.env.example` a `.env` y configura tus valores:

```env
DISCORD_TOKEN=tu_token_aqui
DISCORD_CLIENT_ID=tu_client_id_aqui
OWNER_ID=tu_user_id_aqui
NODE_ENV=development
```

4. **Compilar TypeScript**
```bash
npm run build
```

5. **Iniciar el bot**
```bash
npm start
```

Para desarrollo con recarga automática:
```bash
npm run dev
```

## 📁 Estructura del Proyecto

```
rpg-bot-refactored/
├── src/
│   ├── commands/           # Comandos del bot
│   │   ├── balance.ts
│   │   ├── daily.ts
│   │   ├── inventory.ts
│   │   ├── leaderboard.ts
│   │   └── ping.ts
│   ├── events/             # Manejadores de eventos
│   │   ├── ready.ts
│   │   └── interactionCreate.ts
│   ├── services/           # Servicios (base de datos, cooldowns)
│   │   ├── DatabaseService.ts
│   │   └── CooldownService.ts
│   ├── structures/         # Clases base
│   │   ├── BotClient.ts
│   │   ├── Command.ts
│   │   └── Event.ts
│   ├── types/              # Tipos TypeScript
│   │   └── RPGTypes.ts
│   ├── utils/              # Utilidades
│   │   ├── CommandHandler.ts
│   │   ├── EventHandler.ts
│   │   └── Utils.ts
│   └── index.ts            # Punto de entrada
├── data/                   # Archivos de datos JSON
│   └── balance.json
├── dist/                   # Código compilado
├── .env                    # Variables de entorno
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## 🎮 Comandos Disponibles

### Economía
- `/balance [user]` - Ver el balance de monedas y gemas
- `/daily` - Reclamar recompensa diaria (100 monedas, 5 gemas)
- `/leaderboard [limit]` - Ver los usuarios más ricos
- `/inventory [user]` - Ver el inventario

### Utilidad
- `/ping` - Ver la latencia del bot

## 🔧 Crear Nuevos Comandos

1. Crea un nuevo archivo en `src/commands/`:

```typescript
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, Colors } from 'discord.js';
import { Command } from '../structures/Command';
import { BotClient } from '../structures/BotClient';

export default class MiComando extends Command {
  constructor() {
    super({
      name: 'micomando',
      description: 'Descripción del comando',
      category: 'categoria',
      cooldown: 5,
      ownerOnly: false,
      guildOnly: false
    });
  }

  data(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }

  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    // Tu lógica aquí
    await interaction.reply('¡Hola!');
  }
}
```

2. El comando se cargará automáticamente al reiniciar el bot.

## 🎯 Crear Nuevos Eventos

1. Crea un nuevo archivo en `src/events/`:

```typescript
import { Event } from '../structures/Event';
import { BotClient } from '../structures/BotClient';
import { Message } from 'discord.js';

export default class MessageCreateEvent extends Event<'messageCreate'> {
  constructor() {
    super('messageCreate', false); // false = se ejecuta cada vez
  }

  async execute(client: BotClient, message: Message): Promise<void> {
    // Tu lógica aquí
    console.log(`Mensaje de ${message.author.tag}: ${message.content}`);
  }
}
```

2. El evento se cargará automáticamente al reiniciar el bot.

## 💾 Sistema de Base de Datos

El bot usa un sistema de base de datos JSON simple. Los datos se guardan en `data/balance.json`.

Para usar el servicio de base de datos:

```typescript
import { DatabaseService } from '../services/DatabaseService';

const database = new DatabaseService();

// Obtener balance
const balance = database.getBalance(userId);

// Agregar monedas
database.addCoins(userId, 100);

// Agregar item
database.addItem(userId, {
  id: 'sword_1',
  name: 'Iron Sword',
  quantity: 1,
  type: ItemType.WEAPON
});
```

## 🔄 Arquitectura Event-Driven

El bot usa una arquitectura completamente event-driven:

1. **Events**: Todos los eventos de Discord se manejan en archivos separados
2. **Commands**: Cada comando es una clase independiente
3. **Services**: Lógica de negocio separada en servicios reutilizables
4. **Handlers**: Cargadores automáticos de comandos y eventos

### Ventajas

- ✅ Código modular y fácil de mantener
- ✅ Separación clara de responsabilidades
- ✅ Fácil de testear
- ✅ Escalable para agregar nuevas funcionalidades
- ✅ TypeScript proporciona autocompletado y detección de errores

## 📊 Scripts Disponibles

- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Iniciar el bot (requiere compilación previa)
- `npm run dev` - Modo desarrollo con ts-node
- `npm run watch` - Compilar TypeScript en modo watch
- `npm run lint` - Ejecutar ESLint
- `npm run format` - Formatear código con Prettier

## 🔒 Seguridad

- ✅ Token y credenciales en variables de entorno
- ✅ `.gitignore` configurado para excluir datos sensibles
- ✅ Validación de permisos en comandos
- ✅ Sistema de cooldowns para prevenir spam
- ✅ Manejo de errores robusto

## 🆕 Diferencias con el Código Original

### Mejoras Principales

1. **TypeScript**: Tipado estricto para prevenir errores
2. **Discord.js v14**: Última versión con Slash Commands
3. **Arquitectura Modular**: Separación clara de componentes
4. **Event-Driven**: Sistema basado en eventos
5. **Servicios**: Lógica de negocio encapsulada
6. **Async/Await**: Código moderno y legible
7. **Error Handling**: Manejo robusto de errores
8. **Escalabilidad**: Fácil agregar nuevas funcionalidades

### Cambios Técnicos

- ❌ Eliminado: `dblapi.js` y `top.gg` (obsoletos)
- ✅ Agregado: Sistema de tipos completo
- ✅ Agregado: Slash Commands (reemplaza comandos de texto)
- ✅ Agregado: Sistema de handlers automáticos
- ✅ Agregado: Embeds modernos para respuestas
- ✅ Agregado: Sistema de cooldowns mejorado

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

ISC

## 🐛 Reportar Bugs

Si encuentras un bug, por favor abre un issue con:
- Descripción del bug
- Pasos para reproducirlo
- Comportamiento esperado vs actual
- Logs relevantes

## 💡 Ideas y Sugerencias

¿Tienes ideas para mejorar el bot? ¡Abre un issue con la etiqueta "enhancement"!

---

**Nota**: Este es un proyecto de refactorización que mejora significativamente el código original, añadiendo TypeScript, arquitectura moderna y mejores prácticas de desarrollo.
