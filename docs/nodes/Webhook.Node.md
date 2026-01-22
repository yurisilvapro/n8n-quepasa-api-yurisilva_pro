# Webhook Node - Especificação Completa

## 📋 Visão Geral

O **Webhook Node** gerencia configurações de webhooks e integrações de eventos em tempo real.

### Propósito
- Configurar webhooks para receber eventos
- Gerenciar configurações de webhook
- Configurar RabbitMQ como alternativa
- Filtrar tipos de eventos

### Prioridade
⭐⭐⭐⭐ **ALTA** - Essencial para automações e integrações em tempo real.

---

## 🎯 Operações Disponíveis

### Resumo das Operações

| Operação | Prioridade | Complexidade | Status |
|----------|-----------|--------------|--------|
| Set Webhook | ALTA | Baixa | ✅ Fase 1 |
| Get Webhook | MÉDIA | Baixa | ✅ Fase 1 |
| Delete Webhook | MÉDIA | Baixa | ✅ Fase 1 |
| **Update Webhook** | MÉDIA | Baixa | ✅ **Fase 2** |

---

## 📡 Operação 1: Set Webhook

### Descrição
Configura um webhook para receber eventos do WhatsApp em tempo real.

### Endpoint
```
POST /webhook
```

### Request Body
```json
{
  "url": "https://webhook.example.com/whatsapp/events",
  "forwardinternal": true,
  "trackid": "production-webhook",
  "extra": {
    "clientId": "12345",
    "company": "MyCompany",
    "environment": "production",
    "version": "1.0"
  }
}
```

### Request Fields

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `url` | string | Sim | URL completa do webhook |
| `forwardinternal` | boolean | Não | Encaminhar eventos internos (default: true) |
| `trackid` | string | Não | ID de rastreamento customizado |
| `extra` | object | Não | Metadados adicionais enviados em todos os eventos |

### Response Success (200)
```json
{
  "success": true,
  "webhook": {
    "url": "https://webhook.example.com/whatsapp/events",
    "forwardinternal": true,
    "trackid": "production-webhook",
    "extra": {
      "clientId": "12345",
      "company": "MyCompany"
    }
  },
  "timestamp": "2026-01-21T13:00:00Z"
}
```

### Possíveis Erros

#### 400 Bad Request
```json
{
  "error": true,
  "message": "Invalid webhook URL",
  "code": "INVALID_URL"
}
```

#### 422 Unprocessable Entity
```json
{
  "error": true,
  "message": "Webhook URL is not accessible",
  "code": "URL_NOT_ACCESSIBLE"
}
```

### Implementação no n8n

#### Campos de Entrada
```typescript
[
  {
    displayName: 'Webhook URL',
    name: 'url',
    type: 'string',
    required: true,
    placeholder: 'https://webhook.example.com/events',
    description: 'URL to receive webhook events'
  },
  {
    displayName: 'Forward Internal Events',
    name: 'forwardinternal',
    type: 'boolean',
    default: true,
    description: 'Forward internal system events'
  },
  {
    displayName: 'Track ID',
    name: 'trackid',
    type: 'string',
    default: '',
    placeholder: 'production-webhook',
    description: 'Custom tracking identifier'
  },
  {
    displayName: 'Extra Metadata',
    name: 'extra',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true
    },
    default: {},
    options: [
      {
        name: 'metadata',
        displayName: 'Metadata',
        values: [
          {
            displayName: 'Key',
            name: 'key',
            type: 'string',
            default: ''
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: ''
          }
        ]
      }
    ],
    description: 'Additional metadata to include in all events'
  }
]
```

---

## 📡 Operação 2: Get Webhook

### Descrição
Obtém a configuração atual do webhook.

### Endpoint
```
GET /webhook
```

### Response Success (200)
```json
{
  "url": "https://webhook.example.com/whatsapp/events",
  "forwardinternal": true,
  "trackid": "production-webhook",
  "extra": {
    "clientId": "12345",
    "company": "MyCompany"
  },
  "active": true,
  "lastEvent": "2026-01-21T12:55:00Z",
  "totalEvents": 1523
}
```

### Response quando não há webhook
```json
{
  "active": false,
  "message": "No webhook configured"
}
```

---

## 📡 Operação 3: Update Webhook

### Descrição
Atualiza a configuração do webhook existente.

### Endpoint
```
PUT /webhook
```

### Request Body
```json
{
  "url": "https://webhook-new.example.com/events",
  "forwardinternal": false
}
```

*Nota: Campos não fornecidos mantêm valores anteriores*

---

## 📡 Operação 4: Delete Webhook

### Descrição
Remove a configuração do webhook.

### Endpoint
```
DELETE /webhook
```

### Response Success (200)
```json
{
  "success": true,
  "message": "Webhook removed successfully",
  "timestamp": "2026-01-21T13:10:00Z"
}
```

---

## 📡 Operação 5: Set RabbitMQ

### Descrição
Configura RabbitMQ como sistema de mensageria para eventos (alternativa ao webhook HTTP).

### Endpoint
```
POST /rabbitmq
```

### Request Body
```json
{
  "url": "amqp://user:password@rabbitmq.example.com:5672/vhost",
  "exchange": "quepasa-events",
  "queue": "whatsapp-messages",
  "routingKey": "whatsapp.*",
  "durable": true
}
```

### Request Fields

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `url` | string | Sim | URL de conexão AMQP |
| `exchange` | string | Sim | Nome do exchange |
| `queue` | string | Sim | Nome da fila |
| `routingKey` | string | Não | Routing key (default: '#') |
| `durable` | boolean | Não | Fila durável (default: true) |

### Response Success (200)
```json
{
  "success": true,
  "rabbitmq": {
    "exchange": "quepasa-events",
    "queue": "whatsapp-messages",
    "routingKey": "whatsapp.*",
    "durable": true,
    "connected": true
  },
  "timestamp": "2026-01-21T13:15:00Z"
}
```

---

## 🔔 Estrutura de Eventos

### Tipos de Eventos Disponíveis

```typescript
enum WebhookEventType {
  MESSAGE = 'message',
  MESSAGE_SENT = 'message.sent',
  MESSAGE_DELIVERED = 'message.delivered',
  MESSAGE_READ = 'message.read',
  MESSAGE_REVOKED = 'message.revoked',
  REACTION = 'reaction',
  GROUP_UPDATE = 'group.update',
  GROUP_PARTICIPANT = 'group.participant',
  PRESENCE = 'presence',
  CALL = 'call',
  STATUS_UPDATE = 'status',
  CONNECTION_UPDATE = 'connection'
}
```

### Evento: Message (Recebida)

```json
{
  "event": "message",
  "timestamp": "2026-01-21T13:20:00Z",
  "trackid": "production-webhook",
  "extra": {
    "clientId": "12345"
  },
  "message": {
    "id": "3EB0C7F3A5B4A7F3D0D1",
    "chatId": "5511999999999@s.whatsapp.net",
    "fromMe": false,
    "timestamp": "2026-01-21T13:20:00Z",
    "text": "Olá, preciso de ajuda!",
    "sender": {
      "id": "5511999999999@s.whatsapp.net",
      "name": "João Silva",
      "pushname": "João"
    },
    "chat": {
      "id": "5511999999999@s.whatsapp.net",
      "name": "João Silva",
      "isGroup": false
    }
  }
}
```

### Evento: Message com Mídia

```json
{
  "event": "message",
  "timestamp": "2026-01-21T13:25:00Z",
  "message": {
    "id": "4FA1D8G4B6C5B8G4E1E2",
    "chatId": "5511999999999@s.whatsapp.net",
    "fromMe": false,
    "text": "Segue o documento",
    "attachment": {
      "mimetype": "application/pdf",
      "filename": "documento.pdf",
      "size": 245678,
      "downloadUrl": "/download?messageId=4FA1D8G4B6C5B8G4E1E2"
    },
    "sender": {
      "id": "5511999999999@s.whatsapp.net",
      "name": "João Silva"
    }
  }
}
```

### Evento: Message Delivered

```json
{
  "event": "message.delivered",
  "timestamp": "2026-01-21T13:30:00Z",
  "message": {
    "id": "3EB0C7F3A5B4A7F3D0D1",
    "chatId": "5511999999999@s.whatsapp.net",
    "deliveredTo": [
      "5511999999999@s.whatsapp.net"
    ]
  }
}
```

### Evento: Message Read

```json
{
  "event": "message.read",
  "timestamp": "2026-01-21T13:35:00Z",
  "message": {
    "id": "3EB0C7F3A5B4A7F3D0D1",
    "chatId": "5511999999999@s.whatsapp.net",
    "readBy": [
      "5511999999999@s.whatsapp.net"
    ]
  }
}
```

### Evento: Reaction

```json
{
  "event": "reaction",
  "timestamp": "2026-01-21T13:40:00Z",
  "reaction": {
    "messageId": "3EB0C7F3A5B4A7F3D0D1",
    "chatId": "5511999999999@s.whatsapp.net",
    "emoji": "👍",
    "fromMe": false,
    "sender": "5511999999999@s.whatsapp.net"
  }
}
```

### Evento: Group Update

```json
{
  "event": "group.update",
  "timestamp": "2026-01-21T13:45:00Z",
  "group": {
    "id": "123456789012345678@g.us",
    "action": "name_change",
    "newValue": "Novo Nome do Grupo",
    "oldValue": "Nome Antigo",
    "author": "5511999999999@s.whatsapp.net"
  }
}
```

### Evento: Group Participant

```json
{
  "event": "group.participant",
  "timestamp": "2026-01-21T13:50:00Z",
  "group": {
    "id": "123456789012345678@g.us",
    "action": "add",
    "participants": [
      "5511888888888@s.whatsapp.net"
    ],
    "author": "5511999999999@s.whatsapp.net"
  }
}
```

Actions possíveis:
- `add` - Participante adicionado
- `remove` - Participante removido
- `promote` - Promovido a admin
- `demote` - Removido de admin
- `leave` - Participante saiu

### Evento: Presence

```json
{
  "event": "presence",
  "timestamp": "2026-01-21T13:55:00Z",
  "presence": {
    "chatId": "5511999999999@s.whatsapp.net",
    "status": "available",
    "lastSeen": "2026-01-21T13:55:00Z"
  }
}
```

Status possíveis:
- `available` - Online
- `unavailable` - Offline
- `composing` - Digitando
- `recording` - Gravando áudio
- `paused` - Parou de digitar

### Evento: Call

```json
{
  "event": "call",
  "timestamp": "2026-01-21T14:00:00Z",
  "call": {
    "id": "CALL123ABC",
    "from": "5511999999999@s.whatsapp.net",
    "type": "voice",
    "status": "offer"
  }
}
```

### Evento: Connection Update

```json
{
  "event": "connection",
  "timestamp": "2026-01-21T14:05:00Z",
  "connection": {
    "status": "connected",
    "phone": "5511999999999",
    "battery": 85,
    "plugged": true
  }
}
```

Status possíveis:
- `connecting` - Conectando
- `connected` - Conectado
- `disconnecting` - Desconectando
- `disconnected` - Desconectado

---

## 🔧 Implementação Técnica

```typescript
export interface WebhookConfig {
  url: string;
  forwardinternal: boolean;
  trackid?: string;
  extra?: Record<string, any>;
}

export interface WebhookEvent {
  event: WebhookEventType;
  timestamp: string;
  trackid?: string;
  extra?: Record<string, any>;
  message?: any;
  reaction?: any;
  group?: any;
  presence?: any;
  call?: any;
  connection?: any;
}

export class WebhookAPI {
  async setWebhook(config: WebhookConfig): Promise<any> {
    // Validar URL
    this.validateWebhookURL(config.url);

    const response = await axios.post(
      `${this.baseUrl}/webhook`,
      config,
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  async getWebhook(): Promise<any> {
    const response = await axios.get(
      `${this.baseUrl}/webhook`,
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token
        }
      }
    );

    return response.data;
  }

  async deleteWebhook(): Promise<any> {
    const response = await axios.delete(
      `${this.baseUrl}/webhook`,
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token
        }
      }
    );

    return response.data;
  }

  private validateWebhookURL(url: string): void {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Only HTTP(S) URLs are allowed');
      }
    } catch (error) {
      throw new Error(`Invalid webhook URL: ${url}`);
    }
  }
}
```

---

## 📚 Casos de Uso Práticos

### 1. Configurar Webhook para n8n

```typescript
// Workflow: Setup webhook n8n
async function setupN8NWebhook() {
  const webhookUrl = 'https://n8n.example.com/webhook/quepasa';
  
  await webhookAPI.setWebhook({
    url: webhookUrl,
    forwardinternal: true,
    trackid: 'n8n-production',
    extra: {
      environment: 'production',
      version: '1.0',
      account: 'main'
    }
  });
  
  console.log('Webhook configurado para n8n');
}
```

### 2. Processar Eventos no n8n

```
1. Webhook Trigger
   └── Path: /webhook/quepasa
   
2. Switch Node (por tipo de evento)
   └── event === 'message'
       ├── Message Handler
   └── event === 'message.read'
       ├── Read Receipt Handler
   └── event === 'group.participant'
       ├── Group Update Handler
```

### 3. Filtrar Eventos Específicos

```typescript
// No lado do receptor (n8n, etc)
function handleWebhookEvent(event: WebhookEvent) {
  switch (event.event) {
    case 'message':
      if (!event.message?.fromMe) {
        return handleIncomingMessage(event.message);
      }
      break;
      
    case 'message.read':
      return updateMessageStatus(event.message?.id, 'read');
      
    case 'group.participant':
      if (event.group?.action === 'add') {
        return sendWelcomeMessage(event.group);
      }
      break;
  }
}
```

---

## ⚠️ Considerações Importantes

### Segurança

1. **HTTPS**: Sempre usar HTTPS para webhooks
2. **Validação**: Validar origem dos eventos
3. **Timeout**: Configurar timeouts adequados (5-10s)
4. **Retry**: Implementar retry logic no receptor

### Performance

1. **Assíncrono**: Processar eventos de forma assíncrona
2. **Fila**: Usar fila para high-volume
3. **Resposta Rápida**: Retornar 200 rapidamente

### Monitoramento

1. **Logs**: Registrar todos os eventos recebidos
2. **Alertas**: Alertar sobre falhas no webhook
3. **Métricas**: Acompanhar volume e latência

---

**Documento criado em:** 21/01/2026  
**Versão:** 1.0  
**Status:** 📋 Especificação Completa
