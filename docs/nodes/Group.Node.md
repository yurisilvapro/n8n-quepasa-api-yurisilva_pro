# Group Node - Especificação Completa

## 📋 Visão Geral

O **Group Node** gerencia todas as operações relacionadas a grupos do WhatsApp, desde criação até administração de participantes.

### Propósito
- Listar e gerenciar grupos
- Criar novos grupos
- Adicionar/remover participantes
- Gerenciar administradores
- Configurar informações do grupo (nome, descrição, foto)
- Gerenciar links de convite

### Prioridade
⭐⭐⭐⭐ **ALTA** - Essencial para operações corporativas e atendimento em grupo.

---

## 🎯 Operações Disponíveis

### Resumo das Operações

| Operação | Prioridade | Complexidade | Status |
|----------|-----------|--------------|--------|
| List Groups | ALTA | Baixa | ✅ Fase 1 |
| Get Group Info | ALTA | Baixa | ✅ Fase 1 |
| Create Group | MÉDIA | Média | ✅ Fase 1 |
| Update Name | MÉDIA | Baixa | ✅ Fase 1 |
| Add Participants | ALTA | Média | ✅ Fase 1 |
| Remove Participant | ALTA | Baixa | ✅ Fase 1 |
| Leave Group | BAIXA | Baixa | ✅ Fase 1 |
| **Update Description** | ALTA | Baixa | ✅ **Fase 2** |
| **Update Picture** | ALTA | Média | ✅ **Fase 2** |
| **Remove Picture** | BAIXA | Baixa | ✅ **Fase 2** |
| **Promote to Admin** | ALTA | Baixa | ✅ **Fase 2** |
| **Demote from Admin** | ALTA | Baixa | ✅ **Fase 2** |
| **Get Invite Link** | ALTA | Baixa | ✅ **Fase 2** |
| **Revoke Invite Link** | MÉDIA | Baixa | ✅ **Fase 2** |
| **Join via Invite** | MÉDIA | Baixa | ✅ **Fase 2** |

---

## 📡 Operação 1: List Groups

### Descrição
Lista todos os grupos dos quais a conta faz parte.

### Endpoint
```
GET /groups
```

### Versões Suportadas
- `/groups` (v4 - Recomendado)
- `/v2/groups` (v2 - Legado)

### Headers Obrigatórios
```typescript
{
  'X-QUEPASA-TOKEN': string,
  'Accept': 'application/json'
}
```

### Query Parameters (Opcionais)
```typescript
{
  page?: number;          // Default: 1
  limit?: number;         // Default: 50, Max: 100
  filter?: 'admin' | 'participant' | 'all';  // Default: 'all'
}
```

### Response Success (200)
```json
{
  "groups": [
    {
      "id": "123456789012345678@g.us",
      "name": "Equipe de Suporte",
      "topic": "Grupo para discussões da equipe",
      "participants": 25,
      "isAdmin": true,
      "creation": "2025-06-15T10:00:00Z",
      "owner": "5511999999999@s.whatsapp.net"
    },
    {
      "id": "987654321098765432@g.us",
      "name": "Clientes VIP",
      "topic": "Atendimento exclusivo",
      "participants": 12,
      "isAdmin": false,
      "creation": "2025-08-20T14:30:00Z",
      "owner": "5511888888888@s.whatsapp.net"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 50
}
```

### Response Fields

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | JID do grupo (termina com @g.us) |
| `name` | string | Nome do grupo |
| `topic` | string | Descrição/tópico do grupo |
| `participants` | number | Número de participantes |
| `isAdmin` | boolean | Se a conta é admin do grupo |
| `creation` | string | Data de criação (ISO 8601) |
| `owner` | string | Criador do grupo |

### Implementação no n8n

#### Campos de Entrada
```typescript
[
  {
    displayName: 'Filter',
    name: 'filter',
    type: 'options',
    options: [
      { name: 'All Groups', value: 'all' },
      { name: 'Only Admin', value: 'admin' },
      { name: 'Only Participant', value: 'participant' }
    ],
    default: 'all',
    description: 'Filter groups by role'
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    typeOptions: {
      minValue: 1,
      maxValue: 100
    },
    description: 'Number of groups to return'
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    description: 'Return all groups (pagination automatic)'
  }
]
```

### Exemplo de Uso

```bash
curl --location 'https://quepasa.example.com/groups?filter=admin&limit=50' \
  --header 'X-QUEPASA-TOKEN: abc123xyz789' \
  --header 'Accept: application/json'
```

---

## 📡 Operação 2: Get Group Info

### Descrição
Obtém informações detalhadas de um grupo específico, incluindo lista completa de participantes.

### Endpoint
```
GET /groups/{groupId}
```

### Path Parameters
- `groupId`: ID do grupo (formato: `123456@g.us`)

### Response Success (200)
```json
{
  "id": "123456789012345678@g.us",
  "name": "Equipe de Suporte",
  "topic": "Grupo para discussões da equipe",
  "creation": "2025-06-15T10:00:00Z",
  "owner": "5511999999999@s.whatsapp.net",
  "participants": [
    {
      "id": "5511999999999@s.whatsapp.net",
      "name": "João Silva",
      "isAdmin": true,
      "isSuperAdmin": true
    },
    {
      "id": "5511888888888@s.whatsapp.net",
      "name": "Maria Santos",
      "isAdmin": true,
      "isSuperAdmin": false
    },
    {
      "id": "5511777777777@s.whatsapp.net",
      "name": "Pedro Costa",
      "isAdmin": false,
      "isSuperAdmin": false
    }
  ],
  "picture": "https://pps.whatsapp.net/v/...",
  "restrict": false,
  "announce": false,
  "inviteCode": "ABC123XYZ"
}
```

### Response Fields Adicionais

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `participants` | array | Lista completa de participantes |
| `picture` | string | URL da foto do grupo |
| `restrict` | boolean | Se restringe edição de info apenas para admins |
| `announce` | boolean | Se apenas admins podem enviar mensagens |
| `inviteCode` | string | Código de convite atual |

### Implementação no n8n

#### Campos de Entrada
```typescript
[
  {
    displayName: 'Group ID',
    name: 'groupId',
    type: 'string',
    required: true,
    placeholder: '123456789012345678@g.us',
    description: 'ID of the group'
  },
  {
    displayName: 'Include Participants',
    name: 'includeParticipants',
    type: 'boolean',
    default: true,
    description: 'Include full list of participants'
  }
]
```

---

## 📡 Operação 3: Create Group

### Descrição
Cria um novo grupo com participantes iniciais.

### Endpoint
```
POST /groups
```

### Request Body
```json
{
  "name": "Novo Grupo de Suporte",
  "participants": [
    "5511999999999@s.whatsapp.net",
    "5511888888888@s.whatsapp.net",
    "5511777777777@s.whatsapp.net"
  ],
  "topic": "Descrição opcional do grupo"
}
```

### Requisitos
- Mínimo **1 participante** (além do criador)
- Máximo **256 participantes** na criação
- Todos os participantes devem ter WhatsApp válido

### Response Success (201)
```json
{
  "id": "123456789012345678@g.us",
  "name": "Novo Grupo de Suporte",
  "topic": "Descrição opcional do grupo",
  "participants": 4,
  "creation": "2026-01-21T11:00:00Z",
  "inviteCode": "XYZ789ABC"
}
```

### Possíveis Erros

#### 400 Bad Request
```json
{
  "error": true,
  "message": "Group name is required",
  "code": "INVALID_GROUP_NAME"
}
```

```json
{
  "error": true,
  "message": "At least one participant is required",
  "code": "NO_PARTICIPANTS"
}
```

#### 403 Forbidden
```json
{
  "error": true,
  "message": "Some participants are invalid",
  "code": "INVALID_PARTICIPANTS",
  "details": {
    "invalid": ["5511000000000@s.whatsapp.net"]
  }
}
```

### Implementação no n8n

#### Campos de Entrada
```typescript
[
  {
    displayName: 'Group Name',
    name: 'name',
    type: 'string',
    required: true,
    placeholder: 'My New Group',
    description: 'Name of the new group'
  },
  {
    displayName: 'Participants',
    name: 'participants',
    type: 'string',
    typeOptions: {
      multipleValues: true
    },
    required: true,
    placeholder: '5511999999999',
    description: 'Phone numbers of initial participants'
  },
  {
    displayName: 'Description',
    name: 'topic',
    type: 'string',
    default: '',
    description: 'Group description (optional)'
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    default: {},
    options: [
      {
        displayName: 'Announce Mode',
        name: 'announce',
        type: 'boolean',
        default: false,
        description: 'Only admins can send messages'
      },
      {
        displayName: 'Restrict Mode',
        name: 'restrict',
        type: 'boolean',
        default: false,
        description: 'Only admins can edit group info'
      }
    ]
  }
]
```

### Validações

```typescript
export class GroupValidator {
  static validateGroupName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Group name is required');
    }
    if (name.length > 100) {
      throw new Error('Group name too long (max 100 characters)');
    }
  }

  static validateParticipants(participants: string[]): void {
    if (!participants || participants.length === 0) {
      throw new Error('At least one participant is required');
    }
    if (participants.length > 256) {
      throw new Error('Too many participants (max 256)');
    }
    
    // Validar formato de cada participante
    participants.forEach(p => {
      if (!p.includes('@s.whatsapp.net')) {
        throw new Error(`Invalid participant format: ${p}`);
      }
    });
  }

  static validateGroupId(groupId: string): string {
    if (!groupId.endsWith('@g.us')) {
      // Tentar adicionar sufixo
      return `${groupId}@g.us`;
    }
    return groupId;
  }
}
```

---

## 📡 Operação 4: Update Name

### Descrição
Atualiza o nome de um grupo. Requer permissão de admin.

### Endpoint
```
PUT /groups/{groupId}/name
```

### Request Body
```json
{
  "name": "Novo Nome do Grupo"
}
```

### Response Success (200)
```json
{
  "success": true,
  "groupId": "123456789012345678@g.us",
  "name": "Novo Nome do Grupo",
  "timestamp": "2026-01-21T11:15:00Z"
}
```

### Erro Comum

```json
{
  "error": true,
  "message": "You are not an admin of this group",
  "code": "NOT_ADMIN"
}
```

---

## 📡 Operação 5: Update Description

### Descrição
Atualiza a descrição/tópico do grupo. Requer permissão de admin (ou todos, dependendo das configurações).

### Endpoint
```
PUT /groups/{groupId}/topic
```

### Request Body
```json
{
  "topic": "Nova descrição do grupo\nPode ter múltiplas linhas"
}
```

### Response Success (200)
```json
{
  "success": true,
  "groupId": "123456789012345678@g.us",
  "topic": "Nova descrição do grupo\nPode ter múltiplas linhas",
  "timestamp": "2026-01-21T11:20:00Z"
}
```

---

## 📡 Operação 6: Update Picture

### Descrição
Atualiza a foto do grupo. Requer permissão de admin.

### Endpoint
```
PUT /groups/{groupId}/picture
```

### Request Body
```json
{
  "picture": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

### Requisitos da Imagem
- Formato: JPEG ou PNG
- Tamanho máximo: 5MB
- Dimensões recomendadas: 640x640 pixels (quadrado)

### Response Success (200)
```json
{
  "success": true,
  "groupId": "123456789012345678@g.us",
  "pictureUrl": "https://pps.whatsapp.net/v/...",
  "timestamp": "2026-01-21T11:25:00Z"
}
```

---

## 📡 Operação 7: Remove Picture

### Descrição
Remove a foto do grupo. Requer permissão de admin.

### Endpoint
```
DELETE /groups/{groupId}/picture
```

### Response Success (200)
```json
{
  "success": true,
  "groupId": "123456789012345678@g.us",
  "timestamp": "2026-01-21T11:30:00Z"
}
```

---

## 📡 Operação 8: Add Participants

### Descrição
Adiciona um ou mais participantes ao grupo. Requer permissão de admin.

### Endpoint
```
POST /groups/{groupId}/participants
```

### Request Body
```json
{
  "participants": [
    "5511666666666@s.whatsapp.net",
    "5511555555555@s.whatsapp.net"
  ]
}
```

### Response Success (200)
```json
{
  "success": true,
  "groupId": "123456789012345678@g.us",
  "added": [
    {
      "id": "5511666666666@s.whatsapp.net",
      "status": "success"
    },
    {
      "id": "5511555555555@s.whatsapp.net",
      "status": "success"
    }
  ],
  "timestamp": "2026-01-21T11:35:00Z"
}
```

### Response Parcial (200)
```json
{
  "success": true,
  "groupId": "123456789012345678@g.us",
  "added": [
    {
      "id": "5511666666666@s.whatsapp.net",
      "status": "success"
    },
    {
      "id": "5511555555555@s.whatsapp.net",
      "status": "failed",
      "reason": "Privacy settings prevent adding this user"
    }
  ],
  "timestamp": "2026-01-21T11:35:00Z"
}
```

---

## 📡 Operação 9: Remove Participant

### Descrição
Remove um participante do grupo. Requer permissão de admin.

### Endpoint
```
DELETE /groups/{groupId}/participants/{participantId}
```

### Path Parameters
- `groupId`: ID do grupo
- `participantId`: ID do participante (ex: `5511999999999@s.whatsapp.net`)

### Response Success (200)
```json
{
  "success": true,
  "groupId": "123456789012345678@g.us",
  "participantId": "5511999999999@s.whatsapp.net",
  "timestamp": "2026-01-21T11:40:00Z"
}
```

### Erro: Não é Admin
```json
{
  "error": true,
  "message": "You are not an admin of this group",
  "code": "NOT_ADMIN"
}
```

---

## 📡 Operação 10: Promote to Admin

### Descrição
Promove um participante a administrador do grupo. Requer permissão de admin.

### Endpoint
```
PUT /groups/{groupId}/participants/{participantId}/promote
```

### Response Success (200)
```json
{
  "success": true,
  "groupId": "123456789012345678@g.us",
  "participantId": "5511999999999@s.whatsapp.net",
  "isAdmin": true,
  "timestamp": "2026-01-21T11:45:00Z"
}
```

---

## 📡 Operação 11: Demote from Admin

### Descrição
Remove privilégios de administrador de um participante. Requer permissão de admin.

### Endpoint
```
PUT /groups/{groupId}/participants/{participantId}/demote
```

### Response Success (200)
```json
{
  "success": true,
  "groupId": "123456789012345678@g.us",
  "participantId": "5511999999999@s.whatsapp.net",
  "isAdmin": false,
  "timestamp": "2026-01-21T11:50:00Z"
}
```

---

## 📡 Operação 12: Get Invite Link

### Descrição
Obtém o link de convite do grupo. Requer permissão de admin.

### Endpoint
```
GET /groups/{groupId}/invitecode
```

### Response Success (200)
```json
{
  "groupId": "123456789012345678@g.us",
  "code": "ABC123XYZ789",
  "link": "https://chat.whatsapp.com/ABC123XYZ789",
  "timestamp": "2026-01-21T11:55:00Z"
}
```

---

## 📡 Operação 13: Revoke Invite Link

### Descrição
Revoga o link de convite atual e gera um novo. Requer permissão de admin.

### Endpoint
```
POST /groups/{groupId}/invitecode/revoke
```

### Response Success (200)
```json
{
  "success": true,
  "groupId": "123456789012345678@g.us",
  "oldCode": "ABC123XYZ789",
  "newCode": "XYZ789ABC123",
  "newLink": "https://chat.whatsapp.com/XYZ789ABC123",
  "timestamp": "2026-01-21T12:00:00Z"
}
```

---

## 📡 Operação 14: Join via Invite

### Descrição
Entra em um grupo usando código de convite.

### Endpoint
```
POST /groups/join/{inviteCode}
```

### Path Parameters
- `inviteCode`: Código do convite (ex: `ABC123XYZ789`)

### Response Success (200)
```json
{
  "success": true,
  "groupId": "123456789012345678@g.us",
  "name": "Grupo Público",
  "participants": 50,
  "timestamp": "2026-01-21T12:05:00Z"
}
```

### Erros Possíveis

```json
{
  "error": true,
  "message": "Invalid or expired invite code",
  "code": "INVALID_INVITE"
}
```

```json
{
  "error": true,
  "message": "You are already a member of this group",
  "code": "ALREADY_MEMBER"
}
```

---

## 📡 Operação 15: Leave Group

### Descrição
Sai de um grupo.

### Endpoint
```
DELETE /groups/{groupId}/leave
```

### Response Success (200)
```json
{
  "success": true,
  "groupId": "123456789012345678@g.us",
  "timestamp": "2026-01-21T12:10:00Z"
}
```

### Considerações
- Se você é o único admin, não pode sair (precisa promover outro admin primeiro)
- Ao sair, perde acesso ao histórico de mensagens

---

## 🔧 Implementação Técnica Completa

```typescript
export enum GroupOperation {
  LIST_GROUPS = 'listGroups',
  GET_GROUP_INFO = 'getGroupInfo',
  CREATE_GROUP = 'createGroup',
  UPDATE_NAME = 'updateName',
  UPDATE_DESCRIPTION = 'updateDescription',
  UPDATE_PICTURE = 'updatePicture',
  REMOVE_PICTURE = 'removePicture',
  ADD_PARTICIPANTS = 'addParticipants',
  REMOVE_PARTICIPANT = 'removeParticipant',
  PROMOTE_TO_ADMIN = 'promoteToAdmin',
  DEMOTE_FROM_ADMIN = 'demoteFromAdmin',
  GET_INVITE_LINK = 'getInviteLink',
  REVOKE_INVITE_LINK = 'revokeInviteLink',
  JOIN_VIA_INVITE = 'joinViaInvite',
  LEAVE_GROUP = 'leaveGroup'
}

export interface GroupInfo {
  id: string;
  name: string;
  topic?: string;
  participants: number | ParticipantInfo[];
  isAdmin: boolean;
  creation?: string;
  owner?: string;
  picture?: string;
  inviteCode?: string;
}

export interface ParticipantInfo {
  id: string;
  name?: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export class GroupAPI {
  constructor(private baseUrl: string, private token: string) {}

  async listGroups(filter: 'all' | 'admin' | 'participant' = 'all'): Promise<GroupInfo[]> {
    const response = await axios.get(
      `${this.baseUrl}/groups?filter=${filter}`,
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Accept': 'application/json'
        }
      }
    );
    return response.data.groups;
  }

  async getGroupInfo(groupId: string): Promise<GroupInfo> {
    const validGroupId = GroupValidator.validateGroupId(groupId);
    
    const response = await axios.get(
      `${this.baseUrl}/groups/${validGroupId}`,
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  }

  async createGroup(name: string, participants: string[], topic?: string): Promise<GroupInfo> {
    GroupValidator.validateGroupName(name);
    GroupValidator.validateParticipants(participants);

    const response = await axios.post(
      `${this.baseUrl}/groups`,
      { name, participants, topic },
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  }

  async updateGroupName(groupId: string, name: string): Promise<any> {
    const validGroupId = GroupValidator.validateGroupId(groupId);
    GroupValidator.validateGroupName(name);

    const response = await axios.put(
      `${this.baseUrl}/groups/${validGroupId}/name`,
      { name },
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  }

  async addParticipants(groupId: string, participants: string[]): Promise<any> {
    const validGroupId = GroupValidator.validateGroupId(groupId);

    const response = await axios.post(
      `${this.baseUrl}/groups/${validGroupId}/participants`,
      { participants },
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  }

  async removeParticipant(groupId: string, participantId: string): Promise<any> {
    const validGroupId = GroupValidator.validateGroupId(groupId);

    const response = await axios.delete(
      `${this.baseUrl}/groups/${validGroupId}/participants/${participantId}`,
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  }

  async promoteToAdmin(groupId: string, participantId: string): Promise<any> {
    const validGroupId = GroupValidator.validateGroupId(groupId);

    const response = await axios.put(
      `${this.baseUrl}/groups/${validGroupId}/participants/${participantId}/promote`,
      {},
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  }

  async leaveGroup(groupId: string): Promise<any> {
    const validGroupId = GroupValidator.validateGroupId(groupId);

    const response = await axios.delete(
      `${this.baseUrl}/groups/${validGroupId}/leave`,
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  }
}
```

---

## 📚 Casos de Uso Práticos

### 1. Criar Grupo Automaticamente
```typescript
// Workflow: Criar grupo de suporte para novo cliente
async function createSupportGroup(clientName: string, clientPhone: string) {
  const groupInfo = await groupAPI.createGroup(
    `Suporte - ${clientName}`,
    [
      clientPhone,
      '5511999999999@s.whatsapp.net', // Atendente 1
      '5511888888888@s.whatsapp.net'  // Atendente 2
    ],
    `Grupo de suporte exclusivo para ${clientName}`
  );

  // Enviar mensagem de boas-vindas
  await messageAPI.sendText({
    chatId: groupInfo.id,
    text: `Olá ${clientName}! Bem-vindo ao seu grupo de suporte exclusivo. Estamos aqui para ajudar! 👋`
  });

  return groupInfo;
}
```

### 2. Monitorar Grupos
```typescript
// Workflow: Listar grupos e verificar admins
async function auditGroups() {
  const groups = await groupAPI.listGroups('admin');
  
  for (const group of groups) {
    const info = await groupAPI.getGroupInfo(group.id);
    
    console.log(`Grupo: ${info.name}`);
    console.log(`Participantes: ${info.participants.length}`);
    
    const admins = info.participants.filter(p => p.isAdmin);
    console.log(`Admins: ${admins.length}`);
  }
}
```

---

**Documento criado em:** 21/01/2026  
**Versão:** 1.0  
**Status:** 📋 Especificação Completa  
**Próximo:** Contact Node
