# Guía de Migración

## Migración desde Discord.js v12 a v14

Esta guía te ayudará a entender los cambios principales al migrar desde tu bot original a esta versión refactorizada.

## 📋 Cambios Principales

### 1. Sistema de Comandos

#### Antes (v12)
```javascript
// Comandos basados en mensajes con prefijo
client.on('message', message => {
  if (message.content.startsWith('!balance')) {
    // lógica del comando
  }
});
```

#### Ahora (v14)
```typescript
// Slash Commands con interacciones
export default class BalanceCommand extends Command {
  data(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('balance')
      .setDescription('Check your balance');
  }
  
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('...');
  }
}
```

### 2. Intents

#### Antes (v12)
```javascript
const client = new Discord.Client();
```

#### Ahora (v14)
```typescript
const client = new BotClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});
```

### 3. Eventos

#### Antes (v12)
```javascript
client.on('ready', () => {
  console.log('Bot listo!');
});
```

#### Ahora (v14)
```typescript
export default class ReadyEvent extends Event<'ready'> {
  constructor() {
    super('ready', true); // true = ejecutar una sola vez
  }
  
  async execute(client: BotClient): Promise<void> {
    console.log('Bot listo!');
  }
}
```

### 4. Respuestas

#### Antes (v12)
```javascript
message.channel.send('Hola!');
message.reply('Hola!');
```

#### Ahora (v14)
```typescript
// Para slash commands
await interaction.reply('Hola!');
await interaction.editReply('Actualizado!');
await interaction.followUp('Mensaje adicional');

// Embeds
const embed = new EmbedBuilder()
  .setColor(Colors.Blue)
  .setDescription('Hola!');
  
await interaction.reply({ embeds: [embed] });
```

### 5. Permisos

#### Antes (v12)
```javascript
if (message.member.hasPermission('ADMINISTRATOR')) {
  // hacer algo
}
```

#### Ahora (v14)
```typescript
if (member.permissions.has(PermissionFlagsBits.Administrator)) {
  // hacer algo
}
```

## 🔄 Migrando tus Datos

### Balance.json

El formato del archivo `balance.json` es compatible, pero con campos adicionales:

```json
{
  "USER_ID": {
    "userId": "USER_ID",
    "coins": 1000,
    "gems": 50,
    "lastDaily": 1234567890,
    "lastWeekly": 1234567890,
    "inventory": []
  }
}
```

Si tu `balance.json` original solo tiene `coins`, el bot automáticamente agregará los campos faltantes.

## 📝 Checklist de Migración

- [ ] Instalar Node.js 18+
- [ ] Clonar/descargar el nuevo código
- [ ] Ejecutar `npm install`
- [ ] Copiar tu `balance.json` a `data/balance.json`
- [ ] Crear archivo `.env` con tus credenciales
- [ ] Actualizar los intents en el Developer Portal de Discord
- [ ] Compilar con `npm run build`
- [ ] Iniciar con `npm start`
- [ ] Verificar que los comandos se registren correctamente

## 🔑 Variables de Entorno Requeridas

```env
DISCORD_TOKEN=tu_token_bot
DISCORD_CLIENT_ID=tu_client_id
OWNER_ID=tu_user_id
NODE_ENV=production
```

## ⚠️ Breaking Changes

### 1. Comandos de Texto Eliminados
Los comandos con prefijo (`!comando`) ya no funcionan. Todos los comandos ahora son Slash Commands (`/comando`).

### 2. Top.gg Removido
La integración con Top.gg/DBL fue removida. Si la necesitas, puedes agregarla como un servicio separado.

### 3. Mensaje directo vs Interacciones
Ya no se usan eventos de mensaje (`message`). Todo se maneja mediante interacciones.

## 🆕 Nuevas Características

### 1. TypeScript
- Autocompletado en el IDE
- Detección de errores en tiempo de compilación
- Mejor mantenibilidad

### 2. Arquitectura Modular
```
commands/     → Cada comando en su archivo
events/       → Cada evento en su archivo
services/     → Lógica de negocio separada
structures/   → Clases base reutilizables
```

### 3. Sistema de Cooldowns Mejorado
Cooldowns por comando y por usuario, con mensajes informativos.

### 4. Manejo de Errores Robusto
Try-catch en todos los comandos con respuestas amigables.

### 5. Sistema de Permisos
Permisos por comando, verificación automática.

## 🔨 Comandos de Desarrollo

```bash
# Desarrollo (recarga automática)
npm run dev

# Compilar
npm run build

# Producción
npm start

# Watch mode (recompila automáticamente)
npm run watch

# Linting
npm run lint

# Formateo
npm run format
```

## 📚 Recursos Adicionales

- [Discord.js Guide v14](https://discordjs.guide/)
- [Discord.js Docs](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## 🤝 Soporte

Si encuentras problemas durante la migración:

1. Revisa los logs del bot
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de tener los intents correctos en el Developer Portal
4. Comprueba que el bot tenga los permisos necesarios en Discord

## 💡 Tips

1. **Usa el modo desarrollo** (`npm run dev`) mientras migras para ver cambios en tiempo real
2. **Revisa los logs** - el bot imprime información útil en la consola
3. **Prueba comando por comando** - migra gradualmente en lugar de todo a la vez
4. **Usa el comando /help** - para ver todos los comandos disponibles
5. **Lee el README.md** - contiene información detallada sobre la estructura

## ⚡ Performance

El nuevo bot es más eficiente:
- Menos uso de memoria con caché optimizado
- Respuestas más rápidas con async/await
- Mejor manejo de rate limits
- Código más limpio y mantenible

---

**¿Necesitas ayuda?** Abre un issue en el repositorio con:
- Descripción del problema
- Logs relevantes
- Pasos para reproducir
