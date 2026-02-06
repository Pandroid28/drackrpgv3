# 🎮 RPG Discord Bot - Proyecto Refactorizado

## 📝 Resumen Ejecutivo

Este proyecto es una **refactorización completa** de tu bot de Discord RPG, modernizado con:
- **TypeScript** para mayor seguridad de tipos
- **Discord.js v14** (última versión)
- **Arquitectura event-driven** profesional
- **Código modular y escalable**

## ✨ Características Principales

### 🎯 Lo que tiene el bot:

1. **Sistema de Economía**
   - Balance de monedas y gemas
   - Comando `/balance` para ver tu balance
   - Comando `/daily` para recompensas diarias (100 monedas, 5 gemas)
   - Comando `/work` para trabajar y ganar monedas
   - Sistema de cooldowns (daily: 24h, work: 1h)

2. **Sistema de Inventario**
   - Almacenamiento de items
   - Diferentes tipos de items (armas, armaduras, consumibles, etc.)
   - Comando `/inventory` para ver tus items

3. **Leaderboard**
   - Comando `/leaderboard` para ver los usuarios más ricos
   - Muestra tu posición si no estás en el top

4. **Utilidades**
   - Comando `/ping` para ver la latencia
   - Comando `/help` para ver todos los comandos disponibles

## 🚀 Inicio Rápido

### Paso 1: Instalar dependencias
```bash
npm install
```

### Paso 2: Configurar variables de entorno
Crea un archivo `.env` basado en `.env.example`:
```env
DISCORD_TOKEN=tu_token_aqui
DISCORD_CLIENT_ID=tu_client_id_aqui
OWNER_ID=tu_user_id_aqui
```

### Paso 3: Compilar y ejecutar
```bash
npm run build
npm start
```

O para desarrollo:
```bash
npm run dev
```

## 📂 Estructura del Proyecto

```
rpg-bot-refactored/
├── src/
│   ├── commands/          # Todos los comandos del bot
│   ├── events/            # Manejadores de eventos
│   ├── services/          # Lógica de negocio (DB, cooldowns)
│   ├── structures/        # Clases base (Command, Event, Client)
│   ├── types/             # Definiciones de tipos TypeScript
│   ├── utils/             # Utilidades y handlers
│   └── index.ts           # Punto de entrada
├── data/                  # Archivos de datos (balance.json)
├── README.md              # Documentación principal
├── MIGRATION.md           # Guía de migración desde v12
├── ARCHITECTURE.md        # Documentación de arquitectura
└── package.json
```

## 🆕 Diferencias con tu Código Original

### Antes (Discord.js v12)
```javascript
// Comandos basados en mensajes con prefijo
client.on('message', message => {
  if (message.content === '!balance') {
    // código del comando
  }
});
```

### Ahora (Discord.js v14 + TypeScript)
```typescript
// Slash Commands con arquitectura modular
export default class BalanceCommand extends Command {
  data() {
    return new SlashCommandBuilder()
      .setName('balance')
      .setDescription('Check your balance');
  }
  
  async execute(interaction: ChatInputCommandInteraction) {
    // código del comando
  }
}
```

## 💡 Ventajas de la Nueva Arquitectura

1. **TypeScript**: Detecta errores antes de ejecutar
2. **Modular**: Cada comando/evento en su propio archivo
3. **Slash Commands**: Interfaz nativa de Discord (más profesional)
4. **Escalable**: Fácil agregar nuevos comandos/eventos
5. **Mantenible**: Código organizado y documentado
6. **Event-Driven**: Mejor separación de responsabilidades

## 📚 Documentación Incluida

### README.md
- Guía completa de instalación
- Documentación de todos los comandos
- Cómo crear nuevos comandos y eventos
- Scripts disponibles

### MIGRATION.md
- Guía paso a paso para migrar desde v12
- Ejemplos de código antes/después
- Checklist de migración
- Solución de problemas comunes

### ARCHITECTURE.md
- Explicación detallada de la arquitectura
- Diagramas de flujo
- Principios de diseño aplicados
- Cómo escalar el proyecto

## 🔧 Comandos NPM Disponibles

```bash
npm run build      # Compilar TypeScript
npm start          # Iniciar bot (producción)
npm run dev        # Modo desarrollo (recarga automática)
npm run watch      # Compilar en modo watch
npm run lint       # Ejecutar linter
npm run format     # Formatear código
```

## 🎯 Comandos del Bot

| Comando | Descripción | Categoría | Cooldown |
|---------|-------------|-----------|----------|
| `/balance [user]` | Ver balance de monedas y gemas | Economía | 3s |
| `/daily` | Reclamar recompensa diaria | Economía | 5s |
| `/work` | Trabajar para ganar monedas | Economía | 5s |
| `/inventory [user]` | Ver inventario de items | Economía | 3s |
| `/leaderboard [limit]` | Ver los más ricos | Economía | 5s |
| `/ping` | Ver latencia del bot | Utilidad | 5s |
| `/help [command]` | Ver ayuda de comandos | Utilidad | 5s |

## 🔐 Seguridad

- ✅ Variables de entorno para credenciales
- ✅ Validación de permisos por comando
- ✅ Sistema de cooldowns anti-spam
- ✅ Manejo robusto de errores
- ✅ Tipado estricto con TypeScript

## 📈 Próximos Pasos Sugeridos

1. **Sistema de Batallas**
   - Comando `/battle @usuario`
   - Sistema de stats (HP, ataque, defensa)
   - Experiencia y niveles

2. **Shop/Tienda**
   - Comando `/shop` para ver items
   - Comando `/buy` para comprar items
   - Diferentes categorías de items

3. **Quests/Misiones**
   - Sistema de misiones diarias
   - Recompensas por completar misiones
   - Tracking de progreso

4. **Base de Datos Real**
   - Migrar de JSON a PostgreSQL/MongoDB
   - Mejor rendimiento con muchos usuarios
   - Queries más complejas

## 🤝 Contribuir

Para agregar nuevas funcionalidades:

1. **Nuevo Comando**: Crear archivo en `src/commands/`
2. **Nuevo Evento**: Crear archivo en `src/events/`
3. **Nuevo Servicio**: Crear clase en `src/services/`
4. El bot carga automáticamente los nuevos archivos

## 🐛 Solución de Problemas

### "Module not found"
```bash
npm install
npm run build
```

### "Discord login failed"
- Verifica que `DISCORD_TOKEN` esté correcto en `.env`
- Asegúrate de que el bot esté habilitado en el Developer Portal

### "Commands not registering"
- Verifica `DISCORD_CLIENT_ID` en `.env`
- Espera unos minutos (Discord puede tardar en actualizar)
- Verifica que el bot tenga permiso `applications.commands`

### "Permission denied"
- El bot necesita los intents correctos en el Developer Portal
- Verifica que tenga permisos en el servidor

## 📞 Soporte

- Lee el `README.md` para documentación completa
- Revisa `MIGRATION.md` si vienes de la versión anterior
- Consulta `ARCHITECTURE.md` para entender la estructura
- Revisa los logs en la consola para errores

## ⭐ Características Destacadas

### 1. Type Safety (Seguridad de Tipos)
```typescript
// TypeScript detecta errores inmediatamente
const balance: UserBalance = database.getBalance(userId);
// ✅ Autocompletado
// ✅ Validación de tipos
// ✅ Prevención de errores
```

### 2. Auto-Loading (Carga Automática)
- Agrega un archivo en `/commands` → Se carga automáticamente
- Agrega un archivo en `/events` → Se registra automáticamente
- No necesitas modificar código existente

### 3. Embeds Profesionales
```typescript
const embed = new EmbedBuilder()
  .setColor(Colors.Gold)
  .setTitle('Balance')
  .addFields({ name: 'Coins', value: '1000' });
```

### 4. Error Handling Robusto
- Try-catch en todos los comandos
- Mensajes de error amigables
- Logs detallados en consola

## 🎓 Recursos de Aprendizaje

- [Discord.js Guide](https://discordjs.guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Discord Developer Portal](https://discord.com/developers)

## 📊 Estadísticas del Proyecto

- **Archivos TypeScript**: 22
- **Comandos**: 7
- **Eventos**: 2
- **Servicios**: 2
- **Líneas de código**: ~2,500
- **Documentación**: 3 archivos MD detallados

## ✅ Checklist de Migración

- [ ] Copiar `balance.json` a `data/balance.json`
- [ ] Crear `.env` con credenciales
- [ ] Ejecutar `npm install`
- [ ] Ejecutar `npm run build`
- [ ] Verificar que compile sin errores
- [ ] Ejecutar `npm start`
- [ ] Probar cada comando en Discord
- [ ] Verificar que los datos se guarden correctamente

---

## 🎉 ¡Listo para usar!

Tu bot está completamente refactorizado y listo para producción. Solo necesitas:
1. Instalar dependencias
2. Configurar el `.env`
3. Compilar y ejecutar

¡Disfruta de tu nuevo bot moderno y profesional! 🚀
