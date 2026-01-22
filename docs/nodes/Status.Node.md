# Status Node - Especificação Completa

## 📋 Visão Geral

O **Status Node** gerencia operações relacionadas a presença e status (recado) do WhatsApp.

### Propósito
- Atualizar presença (online/offline)
- Atualizar status/recado
- Obter status de contatos
- Gerenciar visibilidade de presença

### Prioridade
⭐ **BAIXA** - Funcionalidades secundárias, mas úteis para automações específicas.

---

## 🎯 Operações Disponíveis

### Resumo das Operações

| Operação | Prioridade | Complexidade | Status |
|----------|-----------|--------------|--------|
| Update Presence | BAIXA | Baixa | ✅ Fase 1 |
| **Update Status** | MÉDIA | Baixa | ✅ **Fase 2** |
| **Get Contact Status** | MÉDIA | Baixa | ✅ **Fase 2** |

---

## 📡 Operação 1: Update Presence

### Descrição
Atualiza o status de presença da conta (disponível/indisponível).

### Endpoint
```
POST /presence
```

### Request Body
```json
{
  "presence": "available",
  "chatId": "5511999999999@s.whatsapp.net"
}
```

### Presence Values

| Valor | Descrição | Visível para |
|-------|-----------|-------------|
| `available` | Online/Disponível | Todos os contatos |
| `unavailable` | Offline/Indisponível | Ninguém |
| `composing` | Digitando | Chat específico |
| `recording` | Gravando áudio | Chat específico |
| `paused` | Parou de digitar | Chat específico |

### Response Success (200)
```json
{
  "success": true,
  "presence": "available",
  "chatId": "5511999999999@s.whatsapp.net",
  "timestamp": "2026-01-21T14:40:00Z"
}
```

### Implementação no n8n

#### Campos de Entrada
```typescript
[
  {
    displayName: 'Presence',
    name: 'presence',
    type: 'options',
    options: [
      { name: 'Available (Online)', value: 'available' },
      { name: 'Unavailable (Offline)', value: 'unavailable' },
      { name: 'Composing (Typing)', value: 'composing' },
      { name: 'Recording (Audio)', value: 'recording' },
      { name: 'Paused', value: 'paused' }
    ],
    default: 'available',
    required: true,
    description: 'Presence status to set'
  },
  {
    displayName: 'Chat ID',
    name: 'chatId',
    type: 'string',
    default: '',
    placeholder: '5511999999999@s.whatsapp.net',
    displayOptions: {
      show: {
        presence: ['composing', 'recording', 'paused']
      }
    },
    description: 'Required for composing/recording/paused status'
  }
]
```

### Casos de Uso

#### 1. Simular Digitação
```typescript
// Workflow: Simular digitação antes de enviar mensagem
async function sendWithTypingIndicator(chatId: string, text: string) {
  // Mostrar "digitando"
  await statusAPI.updatePresence('composing', chatId);
  
  // Aguardar alguns segundos (simular digitação)
  await sleep(3000);
  
  // Enviar mensagem
  await messageAPI.sendText({ chatId, text });
  
  // Voltar ao normal
  await statusAPI.updatePresence('paused', chatId);
}
```

#### 2. Auto-Away
```typescript
// Workflow: Marcar como indisponível automaticamente
async function autoAway() {
  // Verificar se há mensagens não respondidas
  const hasUnread = await checkUnreadMessages();
  
  if (!hasUnread) {
    // Marcar como indisponível
    await statusAPI.updatePresence('unavailable');
    console.log('Marcado como indisponível');
  }
}
```

---

## 📡 Operação 2: Update Status

### Descrição
Atualiza o status/recado do WhatsApp (texto que aparece no perfil).

### Endpoint
```
POST /status
```

### Request Body
```json
{
  "status": "Disponível para conversas 🟢"
}
```

### Limitações
- Máximo 139 caracteres
- Suporta emojis
- Visível para todos os contatos

### Response Success (200)
```json
{
  "success": true,
  "status": "Disponível para conversas 🟢",
  "timestamp": "2026-01-21T14:45:00Z"
}
```

### Implementação no n8n

#### Campos de Entrada
```typescript
[
  {
    displayName: 'Status Text',
    name: 'status',
    type: 'string',
    required: true,
    typeOptions: {
      maxLength: 139
    },
    placeholder: 'Disponível para conversas',
    description: 'Status message (max 139 characters)'
  },
  {
    displayName: 'Include Emoji',
    name: 'includeEmoji',
    type: 'boolean',
    default: true,
    description: 'Automatically add status emoji'
  },
  {
    displayName: 'Emoji',
    name: 'emoji',
    type: 'options',
    options: [
      { name: '🟢 Online', value: '🟢' },
      { name: '🔴 Busy', value: '🔴' },
      { name: '🟡 Away', value: '🟡' },
      { name: '⚪ Offline', value: '⚪' },
      { name: '💼 Working', value: '💼' },
      { name: '🌙 Sleeping', value: '🌙' }
    ],
    default: '🟢',
    displayOptions: {
      show: {
        includeEmoji: [true]
      }
    }
  }
]
```

### Casos de Uso

#### 1. Status Dinâmico por Horário
```typescript
// Workflow: Atualizar status baseado no horário
async function updateStatusByTime() {
  const hour = new Date().getHours();
  let status = '';
  
  if (hour >= 9 && hour < 18) {
    status = '💼 Horário comercial - Disponível';
  } else if (hour >= 18 && hour < 22) {
    status = '🌙 Fora do horário comercial';
  } else {
    status = '⚪ Offline - Retorno às 9h';
  }
  
  await statusAPI.updateStatus(status);
}
```

#### 2. Status de Férias
```typescript
// Workflow: Ativar status de férias
async function setVacationStatus(returnDate: string) {
  const status = `🏖️ Em férias - Retorno em ${returnDate}`;
  await statusAPI.updateStatus(status);
}
```

---

## 📡 Operação 3: Get Contact Status

### Descrição
Obtém o status/recado de um contato específico.

### Endpoint
```
GET /status/{contactId}
```

### Path Parameters
- `contactId`: ID do contato (formato: `5511999999999@s.whatsapp.net`)

### Response Success (200)
```json
{
  "contactId": "5511999999999@s.whatsapp.net",
  "status": "Hey there! I am using WhatsApp.",
  "timestamp": "2026-01-20T10:00:00Z"
}
```

### Response quando status não disponível
```json
{
  "contactId": "5511999999999@s.whatsapp.net",
  "status": null,
  "available": false
}
```

---

## 🔧 Implementação Técnica Completa

```typescript
export enum StatusOperation {
  UPDATE_PRESENCE = 'updatePresence',
  UPDATE_STATUS = 'updateStatus',
  GET_CONTACT_STATUS = 'getContactStatus'
}

export type PresenceType = 'available' | 'unavailable' | 'composing' | 'recording' | 'paused';

export interface UpdatePresenceRequest {
  presence: PresenceType;
  chatId?: string; // Obrigatório para composing, recording, paused
}

export interface UpdateStatusRequest {
  status: string;
}

export class StatusAPI {
  constructor(private baseUrl: string, private token: string) {}

  async updatePresence(presence: PresenceType, chatId?: string): Promise<any> {
    // Validar que chatId é obrigatório para alguns tipos
    if (['composing', 'recording', 'paused'].includes(presence) && !chatId) {
      throw new Error(`chatId is required for presence type: ${presence}`);
    }

    const response = await axios.post(
      `${this.baseUrl}/presence`,
      {
        presence,
        chatId: chatId || undefined
      },
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  async updateStatus(status: string): Promise<any> {
    // Validar tamanho
    if (status.length > 139) {
      throw new Error('Status message too long (max 139 characters)');
    }

    const response = await axios.post(
      `${this.baseUrl}/status`,
      { status },
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  async getContactStatus(contactId: string): Promise<any> {
    const response = await axios.get(
      `${this.baseUrl}/status/${contactId}`,
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token
        }
      }
    );

    return response.data;
  }
}
```

---

## 📚 Casos de Uso Avançados

### 1. Bot com Indicadores de Atividade

```typescript
// Workflow: Bot que simula comportamento humano
async function humanLikeResponse(chatId: string, responseText: string) {
  // 1. Mostrar "digitando"
  await statusAPI.updatePresence('composing', chatId);
  
  // 2. Calcular tempo de "digitação" baseado no tamanho da resposta
  const typingTime = Math.min(responseText.length * 50, 5000); // Max 5s
  await sleep(typingTime);
  
  // 3. Enviar mensagem
  await messageAPI.sendText({ chatId, text: responseText });
  
  // 4. Parar indicador
  await statusAPI.updatePresence('paused', chatId);
}
```

### 2. Status Rotativo

```typescript
// Workflow: Rotacionar entre múltiplos status
const statusMessages = [
  '💼 Atendimento: Seg-Sex 9h-18h',
  '📞 WhatsApp Business',
  '⚡ Resposta rápida garantida',
  '🎯 Qualidade no atendimento'
];

let currentIndex = 0;

async function rotateStatus() {
  const status = statusMessages[currentIndex];
  await statusAPI.updateStatus(status);
  
  currentIndex = (currentIndex + 1) % statusMessages.length;
  
  // Agendar próxima rotação em 1 hora
  setTimeout(rotateStatus, 60 * 60 * 1000);
}
```

### 3. Monitorar Status de Clientes

```typescript
// Workflow: Verificar status de clientes importantes
async function monitorVIPStatuses() {
  const vipClients = [
    '5511999999999@s.whatsapp.net',
    '5511888888888@s.whatsapp.net'
  ];
  
  for (const clientId of vipClients) {
    try {
      const status = await statusAPI.getContactStatus(clientId);
      
      if (status.available) {
        console.log(`${clientId}: ${status.status}`);
        
        // Verificar palavras-chave no status
        if (status.status.toLowerCase().includes('férias')) {
          console.log('Cliente em férias - não enviar mensagens promocionais');
        }
      }
    } catch (error) {
      console.error(`Erro ao verificar status de ${clientId}`);
    }
  }
}
```

---

## ⚠️ Considerações Importantes

### Limitações do WhatsApp

1. **Privacidade**: Status só é visível se o contato também compartilhar com você
2. **Presença**: Depende das configurações de privacidade do usuário
3. **Rate Limiting**: Não atualizar status muito frequentemente

### Boas Práticas

1. **Naturalidade**: Usar indicadores de digitação para parecer mais natural
2. **Relevância**: Manter status atualizado e relevante
3. **Profissionalismo**: Status deve refletir o profissionalismo da conta business

### Performance

1. **Cache**: Cachear status de contatos
2. **Batch**: Não verificar status de muitos contatos de uma vez
3. **Timing**: Respeitar delays entre atualizações

---

## 📊 Matriz de Prioridade

| Operação | Uso Comum | Prioridade Implementação |
|----------|-----------|-------------------------|
| Update Presence (composing) | Bots humanizados | MÉDIA |
| Update Status | Horário comercial | BAIXA |
| Get Contact Status | Segmentação | MUITO BAIXA |

---

**Documento criado em:** 21/01/2026  
**Versão:** 1.0  
**Status:** 📋 Especificação Completa

---

## 🎉 Conclusão da Documentação

Com este documento, completamos a especificação de **todos os 8 Nodes** do projeto n8n-nodes-quepasa aprimorado:

1. ✅ **Session Node** - Autenticação e gerenciamento de sessão
2. ✅ **Message Node** - Envio e gerenciamento de mensagens
3. ✅ **Group Node** - Operações completas de grupos
4. ✅ **Contact Node** - Gerenciamento de contatos
5. ✅ **Media Node** - Download e processamento de mídias
6. ✅ **Webhook Node** - Configuração de eventos em tempo real
7. ✅ **Chat Node** - Gerenciamento de conversas
8. ✅ **Status Node** - Presença e status

**Total de Operações Documentadas**: 60+ operações
**Total de Endpoints Cobertos**: 90+ endpoints da API QuePasa
**Páginas de Documentação**: ~400 linhas por documento = 3.200+ linhas

### Próximos Passos Sugeridos

1. **Revisar** documentação com equipe
2. **Priorizar** implementação (sugestão: Session → Message → Group → demais)
3. **Criar** estrutura base do projeto TypeScript
4. **Implementar** primeiro node funcional
5. **Testar** em ambiente real

**A documentação está completa e pronta para guiar a implementação! 🚀**
