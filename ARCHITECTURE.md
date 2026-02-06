# Arquitectura del Bot

## 🏗️ Visión General

Este bot utiliza una arquitectura **event-driven** (basada en eventos) con una separación clara de responsabilidades siguiendo principios SOLID y clean architecture.

## 📐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                         Discord API                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                       BotClient                              │
│  (Extends Discord.Client con funcionalidad personalizada)   │
└────────────┬───────────────────────────────────┬────────────┘
             │                                    │
             ↓                                    ↓
┌─────────────────────────┐      ┌──────────────────────────┐
│    Event Handler        │      │   Command Handler        │
│  - Carga eventos        │      │  - Carga comandos        │
│  - Registra listeners   │      │  - Registra en Discord   │
└───────────┬─────────────┘      └──────────┬───────────────┘
            │                                │
            ↓                                ↓
┌─────────────────────────┐      ┌──────────────────────────┐
│       Events/           │      │      Commands/           │
│  - ready.ts             │      │  - balance.ts            │
│  - interactionCreate.ts │      │  - daily.ts              │
│  - ...                  │      │  - work.ts               │
└───────────┬─────────────┘      └──────────┬───────────────┘
            │                                │
            │       ┌────────────────────────┘
            │       │
            ↓       ↓
┌─────────────────────────────────────────────────────────────┐
│                        Services/                             │
│  - DatabaseService (persistencia)                            │
│  - CooldownService (rate limiting)                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│                    (balance.json)                            │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Ejecución

### 1. Inicialización

```typescript
index.ts
  ├─> Cargar variables de entorno (.env)
  ├─> Crear BotClient con configuración
  ├─> Inicializar EventHandler
  │   └─> Cargar y registrar todos los eventos
  ├─> Inicializar CommandHandler
  │   └─> Cargar todos los comandos
  ├─> Login a Discord
  └─> Registrar comandos en Discord API
```

### 2. Manejo de Comandos

```typescript
Usuario ejecuta /comando
  ↓
Discord envía evento 'interactionCreate'
  ↓
InteractionCreateEvent detecta el evento
  ↓
Verifica tipo de interacción (slash command)
  ↓
Obtiene comando desde client.commands
  ↓
Validaciones:
  ├─> ¿Es owner only? → Verificar owner
  ├─> ¿Es guild only? → Verificar si es servidor
  ├─> ¿Tiene cooldown? → Verificar CooldownService
  └─> ¿Requiere permisos? → Verificar permisos
  ↓
Ejecutar comando.execute()
  ↓
Comando interactúa con servicios (Database, etc.)
  ↓
Responder al usuario con interaction.reply()
  ↓
Establecer cooldown si es necesario
```

### 3. Manejo de Eventos

```typescript
Discord emite evento (ej: 'messageCreate', 'guildMemberAdd')
  ↓
Event Handler encuentra el evento registrado
  ↓
Ejecuta event.execute() con los parámetros
  ↓
Evento maneja la lógica específica
```

## 📦 Componentes Principales

### 1. Structures (Estructuras Base)

#### BotClient
```typescript
class BotClient extends Client {
  commands: Collection<string, Command>
  ownerId: string
}
```
- Extiende Discord.Client
- Almacena colección de comandos
- Almacena ID del dueño

#### Command (Clase abstracta)
```typescript
abstract class Command {
  name: string
  description: string
  category: string
  cooldown: number
  ownerOnly: boolean
  guildOnly: boolean
  permissions: PermissionResolvable[]
  
  abstract data(): SlashCommandBuilder
  abstract execute(interaction, client): Promise<void>
}
```
- Define estructura común para comandos
- Métodos abstractos que deben implementarse

#### Event (Clase abstracta)
```typescript
abstract class Event<K extends keyof ClientEvents> {
  name: K
  once: boolean
  
  abstract execute(client, ...args): Promise<void>
}
```
- Define estructura común para eventos
- Tipado fuerte con eventos de Discord.js

### 2. Services (Servicios)

#### DatabaseService
**Responsabilidad**: Persistencia de datos

```typescript
class DatabaseService {
  - loadBalances()      // Cargar desde JSON
  - saveBalances()      // Guardar a JSON
  - getBalance(userId)  // Obtener balance de usuario
  - updateBalance()     // Actualizar balance
  - addCoins()          // Agregar monedas
  - addItem()           // Agregar item al inventario
  - getTopUsers()       // Obtener leaderboard
}
```

**Patrón**: Singleton (una sola instancia compartida)

#### CooldownService
**Responsabilidad**: Rate limiting por usuario/comando

```typescript
class CooldownService {
  - isOnCooldown()          // Verificar si está en cooldown
  - getRemainingCooldown()  // Tiempo restante
  - setCooldown()           // Establecer cooldown
  - clearCooldown()         // Limpiar cooldown
}
```

**Estructura de datos**:
```
Map<commandName, Map<userId, expirationTimestamp>>
```

### 3. Handlers (Manejadores)

#### CommandHandler
**Responsabilidad**: Carga y registro de comandos

```typescript
class CommandHandler {
  - loadCommands()      // Cargar desde /commands
  - registerCommands()  // Registrar en Discord API
}
```

**Proceso**:
1. Leer directorio `/commands`
2. Importar cada archivo
3. Instanciar comando
4. Agregar a `client.commands`
5. Registrar con Discord REST API

#### EventHandler
**Responsabilidad**: Carga y registro de eventos

```typescript
class EventHandler {
  - loadEvents()  // Cargar desde /events y registrar
}
```

**Proceso**:
1. Leer directorio `/events`
2. Importar cada archivo
3. Instanciar evento
4. Registrar con `client.on()` o `client.once()`

## 🎯 Principios de Diseño

### 1. Separation of Concerns (Separación de Responsabilidades)
- Cada clase tiene una responsabilidad única
- Commands: Lógica de comando específico
- Services: Lógica de negocio reutilizable
- Events: Manejo de eventos de Discord
- Handlers: Carga y registro

### 2. DRY (Don't Repeat Yourself)
- Código común en clases base (Command, Event)
- Servicios reutilizables (Database, Cooldown)
- Utilidades compartidas (Utils)

### 3. Open/Closed Principle
- Abierto para extensión (nuevos comandos/eventos)
- Cerrado para modificación (no necesitas cambiar código base)

### 4. Dependency Injection
- Servicios se pasan/instancian donde se necesitan
- No hay dependencias ocultas

### 5. Single Source of Truth
- BotClient mantiene estado central
- DatabaseService es la única fuente de datos de usuarios

## 🔐 Seguridad

### 1. Validación de Entrada
- Opciones de comando con validación integrada de Discord
- Verificación de tipos con TypeScript

### 2. Control de Acceso
```typescript
// Owner only commands
if (command.ownerOnly && user.id !== client.ownerId) {
  return deny();
}

// Permission checks
if (!member.permissions.has(command.permissions)) {
  return deny();
}
```

### 3. Rate Limiting
```typescript
// Cooldowns por usuario/comando
if (cooldownService.isOnCooldown(command, user)) {
  return waitMessage();
}
```

### 4. Error Handling
```typescript
try {
  await command.execute(interaction, client);
} catch (error) {
  console.error(error);
  await interaction.reply({ content: 'Error!', ephemeral: true });
}
```

## 📊 Flujo de Datos

### Lectura de Balance
```
Comando → DatabaseService.getBalance(userId)
              ↓
        Verifica en Map en memoria
              ↓
        ¿Existe? → Retornar
              ↓
        ¿No existe? → Crear nuevo → Guardar → Retornar
```

### Escritura de Balance
```
Comando → DatabaseService.updateBalance(userId, data)
              ↓
        Actualizar Map en memoria
              ↓
        Guardar a balance.json
              ↓
        Retornar balance actualizado
```

## 🚀 Escalabilidad

### Agregar Nuevo Comando
1. Crear archivo en `/src/commands/nombre.ts`
2. Extender clase `Command`
3. Implementar `data()` y `execute()`
4. Reiniciar bot → Se carga automáticamente

### Agregar Nuevo Evento
1. Crear archivo en `/src/events/nombre.ts`
2. Extender clase `Event`
3. Implementar `execute()`
4. Reiniciar bot → Se registra automáticamente

### Agregar Nuevo Servicio
1. Crear clase en `/src/services/`
2. Implementar lógica
3. Importar en comandos/eventos que lo necesiten
4. Instanciar (considerar singleton si es apropiado)

## 🔄 Mejoras Futuras

### 1. Base de Datos Real
Reemplazar JSON con:
- PostgreSQL
- MongoDB
- Redis (para caché)

### 2. Message Broker
Para bots distribuidos:
- RabbitMQ
- Redis Pub/Sub

### 3. Microservicios
Separar en servicios:
- Command Service
- Economy Service
- Battle Service

### 4. Caching Layer
- Redis para datos frecuentemente accedidos
- Reducir lecturas/escrituras a DB

### 5. Logging Avanzado
- Winston o Pino
- Log levels (debug, info, warn, error)
- Log aggregation (ELK Stack)

## 📈 Métricas y Monitoreo

### Métricas Importantes
- Comandos ejecutados por minuto
- Latencia promedio de respuesta
- Errores por comando
- Usuarios activos
- Uso de memoria

### Herramientas Sugeridas
- Prometheus + Grafana
- DataDog
- New Relic

## 🧪 Testing

### Estructura de Tests
```
tests/
  ├── unit/
  │   ├── services/
  │   │   ├── DatabaseService.test.ts
  │   │   └── CooldownService.test.ts
  │   └── utils/
  │       └── Utils.test.ts
  ├── integration/
  │   └── commands/
  │       └── balance.test.ts
  └── e2e/
      └── bot.test.ts
```

### Herramientas
- Jest
- Supertest
- Discord.js mocking

---

**Esta arquitectura está diseñada para ser:**
- ✅ Mantenible
- ✅ Escalable
- ✅ Testeable
- ✅ Extensible
- ✅ Type-safe
