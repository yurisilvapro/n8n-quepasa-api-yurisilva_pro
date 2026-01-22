# Chat Node - Especificação Completa

## 📋 Visão Geral

O **Chat Node** gerencia operações relacionadas a conversas/chats individuais.

### Propósito
- Arquivar/desarquivar conversas
- Fixar/desafixar chats
- Silenciar/reativar notificações
- Marcar como lido
- Gerenciar estado das conversas

### Prioridade
⭐⭐ **MÉDIA-BAIXA** - Útil para organização e gerenciamento.

---

## 🎯 Operações Disponíveis

### Resumo das Operações

| Operação | Prioridade | Complexidade | Status |
|----------|-----------|--------------|--------|
| Archive Chat | BAIXA | Baixa | ✅ Fase 1 |
| Mark as Read | MÉDIA | Baixa | ✅ Fase 1 |
| **Unarchive Chat** | BAIXA | Baixa | ✅ **Fase 2** |
| **Pin Chat** | BAIXA | Baixa | ✅ **Fase 2** |
| **Unpin Chat** | BAIXA | Baixa | ✅ **Fase 2** |
| **Mute Chat** | BAIXA | Baixa | ✅ **Fase 2** |
| **Unmute Chat** | BAIXA | Baixa | ✅ **Fase 2** |

---

## 📡 Operação 1: Archive Chat

### Descrição
Arquiva uma conversa, removendo da lista principal.

### Endpoint
```
POST /chat/{chatId}/archive
```

### Path Parameters
- `chatId`: ID do chat (formato: `5511999999999@s.whatsapp.net`)

### Response Success (200)
```json
{
  "success": true,
  "chatId": "5511999999999@s.whatsapp.net",
  "archived": true,
  "timestamp": "2026-01-21T14:10:00Z"
}
```

---

## 📡 Operação 2: Unarchive Chat

### Descrição
Desarquiva uma conversa, retornando para a lista principal.

### Endpoint
```
POST /chat/{chatId}/unarchive
```

### Response Success (200)
```json
{
  "success": true,
  "chatId": "5511999999999@s.whatsapp.net",
  "archived": false,
  "timestamp": "2026-01-21T14:15:00Z"
}
```

---

## 📡 Operação 3: Pin Chat

### Descrição
Fixa uma conversa no topo da lista. Máximo 3 conversas fixadas.

### Endpoint
```
POST /chat/{chatId}/pin
```

### Response Success (200)
```json
{
  "success": true,
  "chatId": "5511999999999@s.whatsapp.net",
  "pinned": true,
  "timestamp": "2026-01-21T14:20:00Z"
}
```

### Erro: Limite Atingido
```json
{
  "error": true,
  "message": "Maximum of 3 pinned chats reached",
  "code": "PIN_LIMIT_REACHED"
}
```

---

## 📡 Operação 4: Unpin Chat

### Descrição
Remove fixação de uma conversa.

### Endpoint
```
POST /chat/{chatId}/unpin
```

### Response Success (200)
```json
{
  "success": true,
  "chatId": "5511999999999@s.whatsapp.net",
  "pinned": false,
  "timestamp": "2026-01-21T14:25:00Z"
}
```

---

## 📡 Operação 5: Mute Chat

### Descrição
Silencia notificações de uma conversa.

### Endpoint
```
POST /chat/{chatId}/mute
```

### Request Body (Opcional)
```json
{
  "duration": 28800
}
```

Durações sugeridas:
- `28800` - 8 horas
- `604800` - 1 semana
- `0` - Sempre (até desmutar manualmente)

### Response Success (200)
```json
{
  "success": true,
  "chatId": "5511999999999@s.whatsapp.net",
  "muted": true,
  "muteUntil": "2026-01-22T22:25:00Z",
  "timestamp": "2026-01-21T14:25:00Z"
}
```

---

## 📡 Operação 6: Unmute Chat

### Descrição
Reativa notificações de uma conversa.

### Endpoint
```
POST /chat/{chatId}/unmute
```

### Response Success (200)
```json
{
  "success": true,
  "chatId": "5511999999999@s.whatsapp.net",
  "muted": false,
  "timestamp": "2026-01-21T14:30:00Z"
}
```

---

## 📡 Operação 7: Mark as Read

### Descrição
Marca todas as mensagens de um chat como lidas.

### Endpoint
```
POST /markasread
```

### Request Body
```json
{
  "chatId": "5511999999999@s.whatsapp.net"
}
```

### Response Success (200)
```json
{
  "success": true,
  "chatId": "5511999999999@s.whatsapp.net",
  "unreadCount": 0,
  "timestamp": "2026-01-21T14:35:00Z"
}
```

---

## 🔧 Implementação Técnica

```typescript
export enum ChatOperation {
  ARCHIVE_CHAT = 'archiveChat',
  UNARCHIVE_CHAT = 'unarchiveChat',
  PIN_CHAT = 'pinChat',
  UNPIN_CHAT = 'unpinChat',
  MUTE_CHAT = 'muteChat',
  UNMUTE_CHAT = 'unmuteChat',
  MARK_AS_READ = 'markAsRead'
}

export interface ChatActionRequest {
  chatId: string;
  duration?: number; // Para mute
}

export class ChatAPI {
  constructor(private baseUrl: string, private token: string) {}

  async archiveChat(chatId: string): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/chat/${chatId}/archive`,
      {},
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

  async pinChat(chatId: string): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/chat/${chatId}/pin`,
      {},
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

  async muteChat(chatId: string, duration: number = 0): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/chat/${chatId}/mute`,
      { duration },
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

  async markAsRead(chatId: string): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/markasread`,
      { chatId },
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }
}
```

---

## 📚 Casos de Uso Práticos

### 1. Auto-Arquivar Chats Inativos

```typescript
// Workflow: Arquivar chats sem atividade por 30 dias
async function archiveInactiveChats() {
  const contacts = await contactAPI.listContacts();
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  for (const contact of contacts) {
    const history = await messageAPI.getHistory({
      chatId: contact.id,
      limit: 1
    });
    
    if (history.messages.length > 0) {
      const lastMessage = history.messages[0];
      const lastMessageTime = new Date(lastMessage.timestamp).getTime();
      
      if (lastMessageTime < thirtyDaysAgo) {
        await chatAPI.archiveChat(contact.id);
        console.log(`Arquivado: ${contact.name}`);
      }
    }
  }
}
```

### 2. Fixar Chats VIP

```typescript
// Workflow: Fixar automaticamente chats de clientes VIP
const vipClients = [
  '5511999999999@s.whatsapp.net',
  '5511888888888@s.whatsapp.net'
];

for (const clientId of vipClients) {
  try {
    await chatAPI.pinChat(clientId);
    console.log(`Chat fixado: ${clientId}`);
  } catch (error) {
    if (error.code === 'PIN_LIMIT_REACHED') {
      console.log('Limite de chats fixados atingido');
    }
  }
}
```

### 3. Marcar Todos como Lido

```typescript
// Workflow: Marcar todos os chats como lidos
async function markAllAsRead() {
  const contacts = await contactAPI.listContacts();
  
  for (const contact of contacts) {
    await chatAPI.markAsRead(contact.id);
    await sleep(500); // Rate limiting
  }
  
  console.log('Todos os chats marcados como lidos');
}
```

---

## 🎨 Implementação no n8n

### Campos de Entrada Padrão

```typescript
[
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    options: [
      { name: 'Archive Chat', value: 'archiveChat' },
      { name: 'Unarchive Chat', value: 'unarchiveChat' },
      { name: 'Pin Chat', value: 'pinChat' },
      { name: 'Unpin Chat', value: 'unpinChat' },
      { name: 'Mute Chat', value: 'muteChat' },
      { name: 'Unmute Chat', value: 'unmuteChat' },
      { name: 'Mark as Read', value: 'markAsRead' }
    ],
    default: 'markAsRead'
  },
  {
    displayName: 'Chat ID',
    name: 'chatId',
    type: 'string',
    required: true,
    placeholder: '5511999999999@s.whatsapp.net',
    description: 'ID of the chat'
  },
  {
    displayName: 'Mute Duration',
    name: 'muteDuration',
    type: 'options',
    options: [
      { name: '8 Hours', value: 28800 },
      { name: '1 Week', value: 604800 },
      { name: 'Always', value: 0 }
    ],
    default: 28800,
    displayOptions: {
      show: {
        operation: ['muteChat']
      }
    },
    description: 'Duration to mute the chat'
  }
]
```

---

**Documento criado em:** 21/01/2026  
**Versão:** 1.0  
**Status:** 📋 Especificação Completa
