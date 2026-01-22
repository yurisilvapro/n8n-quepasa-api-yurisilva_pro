# Guia de Endpoints QuePasa - Referência para Implementação

> 📌 **Objetivo:** Este documento serve como checklist e referência técnica para garantir cobertura completa de todos os endpoints da API QuePasa nas diferentes versões (v2, v3, v4).

---

## 📊 Status de Implementação

**Legenda:**
- ✅ Implementado
- 🔄 Em desenvolvimento
- ⏳ Planejado
- ❌ Não implementado

---

## 1. Autenticação e Sessão

### 1.1 QR Code e Conexão

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/scan` | POST | ⏳ | ALTA | Session | Gerar QR Code para conectar conta |
| `/v2/scan` | POST | ⏳ | MÉDIA | Session | Versão legada |
| `/v3/scan` | POST | ⏳ | MÉDIA | Session | Versão legada |

**Headers obrigatórios:**
```
X-QUEPASA-USER: <user_id>
X-QUEPASA-TOKEN: <token> (pode ser vazio para gerar novo)
Accept: application/json
```

**Resposta esperada:**
```json
{
  "qrcode": "data:image/png;base64,...",
  "token": "generated-token-if-empty",
  "timestamp": "2026-01-21T10:00:00Z"
}
```

### 1.2 Status da Sessão

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/info` | GET | ⏳ | ALTA | Session | Info completa da sessão |
| `/v2/info` | GET | ⏳ | BAIXA | Session | Legado |
| `/v3/info` | GET | ⏳ | BAIXA | Session | Legado |

**Headers:**
```
X-QUEPASA-TOKEN: <token>
Accept: application/json
```

**Resposta esperada:**
```json
{
  "connected": true,
  "phone": "5511999999999",
  "user": "username",
  "version": "v4",
  "groups": true,
  "broadcasts": false
}
```

### 1.3 Desconexão

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/logout` | POST | ⏳ | MÉDIA | Session | Desconectar sessão atual |
| `/v2/logout` | POST | ⏳ | BAIXA | Session | Legado |

---

## 2. Envio de Mensagens

### 2.1 Texto Simples

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/send` | POST | ✅ | ALTA | Message | Envio básico de texto |
| `/v2/send` | POST | ⏳ | BAIXA | Message | Legado |
| `/v3/send` | POST | ⏳ | BAIXA | Message | Legado |

**Headers:**
```
X-QUEPASA-TOKEN: <token>
X-QUEPASA-CHATID: <recipient>
X-QUEPASA-TRACKID: <optional-tracking-id>
Content-Type: application/json
```

**Body:**
```json
{
  "text": "Hello World!\nMultiline support"
}
```

**Resposta:**
```json
{
  "id": "message-id",
  "timestamp": "2026-01-21T10:00:00Z",
  "chatId": "5511999999999",
  "trackId": "custom-track"
}
```

### 2.2 Mídia (Imagem, Vídeo, Áudio, Documento)

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/send` | POST | ✅ | ALTA | Message | Envio com attachment |
| `/sendbinary` | POST | ⏳ | ALTA | Message | Envio base64 |
| `/sendurl` | POST | ⏳ | ALTA | Message | Envio via URL externa |

**Body para attachment:**
```json
{
  "text": "Caption text (opcional)",
  "attachment": {
    "mimetype": "image/jpeg",
    "filename": "photo.jpg",
    "base64": "data:image/jpeg;base64,..."
  }
}
```

**Body para URL:**
```json
{
  "text": "Caption",
  "url": "https://example.com/file.pdf"
}
```

### 2.3 Recursos Avançados de Mensagem

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/message/{id}/revoke` | DELETE | ⏳ | MÉDIA | Message | Revogar/apagar mensagem enviada |
| `/message/{id}/react` | POST | ⏳ | BAIXA | Message | Enviar reação (emoji) |
| `/message/{id}/forward` | POST | ⏳ | BAIXA | Message | Encaminhar mensagem |

**Body para reação:**
```json
{
  "emoji": "👍"
}
```

### 2.4 Marcação e Leitura

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/markasread` | POST | ⏳ | MÉDIA | Chat | Marcar chat como lido |
| `/readupdate` | POST | ⏳ | BAIXA | Chat | Atualizar status de leitura |

**Body:**
```json
{
  "chatId": "5511999999999@s.whatsapp.net"
}
```

---

## 3. Download de Mídia

### 3.1 Download Direto

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/download` | GET | ✅ | ALTA | Media | Download por query param |
| `/download/{messageId}` | GET | ⏳ | ALTA | Media | Download por path param |
| `/v2/download` | GET | ⏳ | BAIXA | Media | Legado |

**Query params:**
```
?messageId=<msg-id>&token=<token>
```

**Resposta:** Stream binário com Content-Type apropriado

### 3.2 Download Base64

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/download/base64` | POST | ⏳ | MÉDIA | Media | Retorna base64 do arquivo |

**Body:**
```json
{
  "messageId": "message-id"
}
```

**Resposta:**
```json
{
  "mimetype": "image/jpeg",
  "filename": "file.jpg",
  "base64": "data:image/jpeg;base64,..."
}
```

---

## 4. Grupos

### 4.1 Listagem e Informações

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/groups` | GET | ⏳ | ALTA | Group | Lista todos os grupos |
| `/groups/{groupId}` | GET | ⏳ | ALTA | Group | Detalhes de um grupo específico |
| `/v2/groups` | GET | ⏳ | BAIXA | Group | Legado |

**Resposta lista:**
```json
{
  "groups": [
    {
      "id": "123456@g.us",
      "name": "Nome do Grupo",
      "topic": "Descrição",
      "participants": 25,
      "isAdmin": true
    }
  ]
}
```

### 4.2 Criação e Gerenciamento

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/groups` | POST | ⏳ | MÉDIA | Group | Criar novo grupo |
| `/groups/{groupId}/name` | PUT | ⏳ | MÉDIA | Group | Atualizar nome |
| `/groups/{groupId}/topic` | PUT | ⏳ | MÉDIA | Group | Atualizar descrição |
| `/groups/{groupId}/picture` | PUT | ⏳ | BAIXA | Group | Atualizar foto |
| `/groups/{groupId}/picture` | DELETE | ⏳ | BAIXA | Group | Remover foto |

**Body criar grupo:**
```json
{
  "name": "Novo Grupo",
  "participants": [
    "5511999999999@s.whatsapp.net",
    "5511888888888@s.whatsapp.net"
  ]
}
```

**Body atualizar nome:**
```json
{
  "name": "Novo Nome"
}
```

**Body atualizar tópico:**
```json
{
  "topic": "Nova descrição do grupo"
}
```

### 4.3 Participantes

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/groups/{groupId}/participants` | POST | ⏳ | ALTA | Group | Adicionar participantes |
| `/groups/{groupId}/participants/{participantId}` | DELETE | ⏳ | ALTA | Group | Remover participante |
| `/groups/{groupId}/participants/{participantId}/promote` | PUT | ⏳ | MÉDIA | Group | Promover a admin |
| `/groups/{groupId}/participants/{participantId}/demote` | PUT | ⏳ | MÉDIA | Group | Remover de admin |

**Body adicionar:**
```json
{
  "participants": [
    "5511999999999@s.whatsapp.net"
  ]
}
```

### 4.4 Convites

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/groups/{groupId}/invitecode` | GET | ⏳ | MÉDIA | Group | Obter link de convite |
| `/groups/{groupId}/invitecode/revoke` | POST | ⏳ | BAIXA | Group | Revogar link atual |
| `/groups/join/{inviteCode}` | POST | ⏳ | BAIXA | Group | Entrar via convite |

**Resposta invitecode:**
```json
{
  "code": "ABC123XYZ",
  "link": "https://chat.whatsapp.com/ABC123XYZ"
}
```

### 4.5 Ações do Grupo

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/groups/{groupId}/leave` | DELETE | ⏳ | BAIXA | Group | Sair do grupo |

---

## 5. Contatos

### 5.1 Listagem e Informações

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/contacts` | GET | ⏳ | MÉDIA | Contact | Lista todos os contatos |
| `/contacts/{contactId}` | GET | ⏳ | MÉDIA | Contact | Detalhes de contato |
| `/v2/contacts` | GET | ⏳ | BAIXA | Contact | Legado |

**Resposta:**
```json
{
  "contacts": [
    {
      "id": "5511999999999@s.whatsapp.net",
      "name": "João Silva",
      "pushname": "João",
      "isMyContact": true
    }
  ]
}
```

### 5.2 Verificações

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/contacts/check` | POST | ⏳ | ALTA | Contact | Verificar se está no WhatsApp |
| `/v2/contacts/check` | POST | ⏳ | BAIXA | Contact | Legado |

**Body:**
```json
{
  "phones": [
    "5511999999999",
    "5511888888888"
  ]
}
```

**Resposta:**
```json
{
  "results": [
    {
      "phone": "5511999999999",
      "exists": true,
      "jid": "5511999999999@s.whatsapp.net"
    },
    {
      "phone": "5511888888888",
      "exists": false
    }
  ]
}
```

### 5.3 Foto de Perfil

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/contacts/{contactId}/picture` | GET | ⏳ | BAIXA | Media | Foto do contato |
| `/pic` | GET | ⏳ | BAIXA | Media | Foto por query param |
| `/picinfo` | GET | ⏳ | BAIXA | Media | Info da foto |

**Query params para /pic:**
```
?phone=5511999999999&token=<token>
```

### 5.4 Bloqueio

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/contacts/block` | POST | ⏳ | BAIXA | Contact | Bloquear contato |
| `/contacts/unblock` | POST | ⏳ | BAIXA | Contact | Desbloquear contato |

**Body:**
```json
{
  "contactId": "5511999999999@s.whatsapp.net"
}
```

---

## 6. Webhooks

### 6.1 Configuração

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/webhook` | POST | ✅ | ALTA | Webhook | Configurar webhook |
| `/webhook` | GET | ⏳ | MÉDIA | Webhook | Obter config atual |
| `/webhook` | PUT | ⏳ | MÉDIA | Webhook | Atualizar webhook |
| `/webhook` | DELETE | ⏳ | MÉDIA | Webhook | Remover webhook |

**Body POST/PUT:**
```json
{
  "url": "https://webhook.example.com/webhook/12345",
  "forwardinternal": true,
  "trackid": "custom-track",
  "extra": {
    "clientId": "12345",
    "company": "myCompany",
    "environment": "production",
    "version": "1.0"
  }
}
```

**Resposta GET:**
```json
{
  "url": "https://webhook.example.com/webhook/12345",
  "forwardinternal": true,
  "trackid": "custom-track",
  "extra": {
    "clientId": "12345"
  }
}
```

### 6.2 Eventos Recebidos via Webhook

**Estrutura geral:**
```json
{
  "event": "message|message.sent|message.delivered|message.read|reaction|group.update|presence|call",
  "timestamp": "2026-01-21T10:00:00Z",
  "message": {
    "id": "message-id",
    "chatId": "5511999999999@s.whatsapp.net",
    "fromMe": false,
    "text": "Conteúdo",
    "timestamp": "2026-01-21T10:00:00Z"
  }
}
```

---

## 7. RabbitMQ (Alternativa a Webhooks)

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/rabbitmq` | POST | ⏳ | BAIXA | Webhook | Configurar RabbitMQ |
| `/rabbitmq` | GET | ⏳ | BAIXA | Webhook | Obter config |
| `/rabbitmq` | DELETE | ⏳ | BAIXA | Webhook | Remover config |

**Body:**
```json
{
  "url": "amqp://user:pass@host:5672/vhost",
  "exchange": "quepasa",
  "queue": "messages"
}
```

---

## 8. Chat/Conversa

### 8.1 Gerenciamento de Chats

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/chat/{chatId}/archive` | POST | ⏳ | BAIXA | Chat | Arquivar conversa |
| `/chat/{chatId}/unarchive` | POST | ⏳ | BAIXA | Chat | Desarquivar |
| `/chat/{chatId}/pin` | POST | ⏳ | BAIXA | Chat | Fixar conversa |
| `/chat/{chatId}/unpin` | POST | ⏳ | BAIXA | Chat | Desafixar |
| `/chat/{chatId}/mute` | POST | ⏳ | BAIXA | Chat | Silenciar |
| `/chat/{chatId}/unmute` | POST | ⏳ | BAIXA | Chat | Reativar sons |

### 8.2 Histórico

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/receive` | GET | ⏳ | MÉDIA | Message | Receber mensagens (polling) |
| `/history` | GET | ⏳ | BAIXA | Message | Histórico de mensagens |

**Query params:**
```
?chatId=5511999999999@s.whatsapp.net&limit=100&before=message-id
```

---

## 9. Presença e Status

### 9.1 Presença

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/presence` | POST | ⏳ | BAIXA | Status | Atualizar presença (available/unavailable) |

**Body:**
```json
{
  "presence": "available",
  "chatId": "5511999999999@s.whatsapp.net"
}
```

### 9.2 Status/Recado

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/status` | POST | ⏳ | BAIXA | Status | Atualizar status/recado |
| `/status/{contactId}` | GET | ⏳ | BAIXA | Status | Ver status de contato |

**Body POST:**
```json
{
  "status": "Meu novo status"
}
```

---

## 10. Informações e Monitoramento

### 10.1 Endpoints de Sistema

| Endpoint | Método | Status | Prioridade | Node Target | Notas |
|----------|--------|--------|------------|-------------|-------|
| `/info` | GET | ⏳ | ALTA | Session | Info geral |
| `/version` | GET | ⏳ | BAIXA | - | Versão da API |
| `/health` | GET | ⏳ | MÉDIA | - | Health check |
| `/metrics` | GET | ⏳ | BAIXA | - | Métricas (se habilitado) |

---

## 11. Checklist por Node n8n

### 11.1 Message Node (Operações)

- [ ] **Send Text** - Enviar texto simples
- [ ] **Send Media** - Enviar imagem/vídeo/áudio/documento
- [ ] **Send from URL** - Enviar mídia via URL
- [ ] **Send Base64** - Enviar arquivo codificado
- [ ] **Revoke Message** - Apagar mensagem enviada
- [ ] **React to Message** - Enviar reação
- [ ] **Forward Message** - Encaminhar mensagem
- [ ] **Get History** - Obter histórico

### 11.2 Group Node (Operações)

- [ ] **List Groups** - Listar todos os grupos
- [ ] **Get Group Info** - Detalhes do grupo
- [ ] **Create Group** - Criar novo grupo
- [ ] **Update Name** - Alterar nome
- [ ] **Update Description** - Alterar descrição
- [ ] **Update Picture** - Alterar foto
- [ ] **Remove Picture** - Remover foto
- [ ] **Add Participants** - Adicionar membros
- [ ] **Remove Participant** - Remover membro
- [ ] **Promote to Admin** - Promover admin
- [ ] **Demote from Admin** - Remover admin
- [ ] **Get Invite Link** - Obter link de convite
- [ ] **Revoke Invite Link** - Revogar link
- [ ] **Join via Invite** - Entrar por convite
- [ ] **Leave Group** - Sair do grupo

### 11.3 Contact Node (Operações)

- [ ] **List Contacts** - Listar contatos
- [ ] **Get Contact Info** - Detalhes do contato
- [ ] **Check WhatsApp** - Verificar se está no WhatsApp
- [ ] **Get Picture** - Obter foto de perfil
- [ ] **Block Contact** - Bloquear
- [ ] **Unblock Contact** - Desbloquear

### 11.4 Session Node (Operações)

- [ ] **Get QR Code** - Obter QR para conectar
- [ ] **Check Status** - Verificar status da sessão
- [ ] **Get Info** - Informações da conta
- [ ] **Disconnect** - Desconectar sessão

### 11.5 Chat Node (Operações)

- [ ] **Archive Chat** - Arquivar conversa
- [ ] **Unarchive Chat** - Desarquivar
- [ ] **Pin Chat** - Fixar
- [ ] **Unpin Chat** - Desafixar
- [ ] **Mute Chat** - Silenciar
- [ ] **Unmute Chat** - Reativar sons
- [ ] **Mark as Read** - Marcar como lido

### 11.6 Media Node (Operações)

- [ ] **Download Media** - Baixar mídia por ID
- [ ] **Download as Base64** - Baixar em base64
- [ ] **Get Profile Picture** - Foto de perfil
- [ ] **Get Picture Info** - Info da foto

### 11.7 Status Node (Operações)

- [ ] **Update Presence** - Atualizar presença
- [ ] **Update Status** - Atualizar recado
- [ ] **Get Contact Status** - Ver status de contato

### 11.8 Webhook Node (Operações)

- [ ] **Set Webhook** - Configurar webhook
- [ ] **Get Webhook** - Obter configuração
- [ ] **Update Webhook** - Atualizar
- [ ] **Delete Webhook** - Remover
- [ ] **Set RabbitMQ** - Configurar RabbitMQ

### 11.9 Trigger Node (Eventos)

- [ ] **Message Received** - Nova mensagem
- [ ] **Message Sent** - Mensagem enviada
- [ ] **Message Delivered** - Mensagem entregue
- [ ] **Message Read** - Mensagem lida
- [ ] **Message Revoked** - Mensagem apagada
- [ ] **Reaction Received** - Reação recebida
- [ ] **Group Update** - Atualização de grupo
- [ ] **Participant Update** - Mudança de participante
- [ ] **Presence Update** - Atualização de presença
- [ ] **Call Received** - Chamada recebida
- [ ] **Status Update** - Atualização de status
- [ ] **Connection Update** - Mudança de conexão

---

## 12. Mapeamento de Headers

### Headers Comuns

```typescript
interface QuePasaHeaders {
  'X-QUEPASA-TOKEN': string;           // Obrigatório em todas as requisições
  'X-QUEPASA-USER'?: string;           // Para operações de admin/multi-user
  'X-QUEPASA-CHATID'?: string;         // Para envio de mensagens
  'X-QUEPASA-TRACKID'?: string;        // Para tracking customizado
  'Content-Type': 'application/json';  // Para POST/PUT
  'Accept': 'application/json';        // Preferência de resposta
}
```

---

## 13. Tratamento de Erros

### Códigos HTTP Comuns

| Código | Significado | Ação |
|--------|-------------|------|
| 200 | Sucesso | Continuar |
| 201 | Criado | Sucesso na criação |
| 400 | Bad Request | Validar parâmetros |
| 401 | Unauthorized | Verificar token |
| 403 | Forbidden | Verificar permissões |
| 404 | Not Found | Recurso não existe |
| 429 | Too Many Requests | Rate limit - aguardar |
| 500 | Server Error | Tentar novamente |
| 503 | Service Unavailable | Servidor indisponível |

### Estrutura de Erro

```json
{
  "error": true,
  "message": "Descrição do erro",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## 14. Rate Limiting Sugerido

| Operação | Limite Sugerido | Observação |
|----------|----------------|------------|
| Envio de mensagem | 1 msg/segundo | Por conta |
| Download de mídia | 10/minuto | Por conta |
| Verificação de contato | 100/minuto | Lote permitido |
| Operações de grupo | 5/minuto | Por grupo |
| Webhooks | Sem limite | Recepção |

---

## 15. Priorização de Desenvolvimento

### **Sprint 1** (Semana 1-2)
1. ✅ Message: Send Text
2. ✅ Message: Send Media
3. ⏳ Session: Get Info
4. ⏳ Session: Get QR Code
5. ⏳ Webhook: Set Webhook

### **Sprint 2** (Semana 3-4)
6. ⏳ Media: Download Media
7. ⏳ Group: List Groups
8. ⏳ Group: Get Group Info
9. ⏳ Contact: Check WhatsApp
10. ⏳ Contact: List Contacts

### **Sprint 3** (Semana 5-6)
11. ⏳ Group: Create Group
12. ⏳ Group: Add/Remove Participants
13. ⏳ Group: Update Name/Description
14. ⏳ Message: Revoke Message
15. ⏳ Chat: Mark as Read

### **Sprint 4** (Semana 7-8)
16. ⏳ Group: Promote/Demote Admin
17. ⏳ Group: Invite Link operations
18. ⏳ Media: Download Base64
19. ⏳ Contact: Block/Unblock
20. ⏳ Message: React to Message

### **Sprint 5** (Semana 9-10)
21. ⏳ Chat: Archive/Pin operations
22. ⏳ Status: Update Presence
23. ⏳ Status: Update Status
24. ⏳ Webhook: Get/Update/Delete
25. ⏳ Trigger: All events

---

## 16. Validações Necessárias

### Validação de Número de Telefone

```typescript
// Formato esperado: [código país][DDD][número]
// Exemplo: 5511999999999
// Com sufixo para chats: 5511999999999@s.whatsapp.net
// Com sufixo para grupos: 123456789@g.us

function validatePhoneNumber(phone: string): boolean {
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Validações básicas
  if (cleaned.length < 10 || cleaned.length > 15) {
    return false;
  }
  
  return true;
}

function formatChatId(phone: string, isGroup: boolean = false): string {
  const cleaned = phone.replace(/\D/g, '');
  const suffix = isGroup ? '@g.us' : '@s.whatsapp.net';
  return `${cleaned}${suffix}`;
}
```

### Validação de Token

```typescript
function validateToken(token: string): boolean {
  return token && token.length > 0;
}
```

### Validação de Mídia

```typescript
interface MediaValidation {
  maxSize: number;        // Em bytes
  allowedTypes: string[]; // MIME types
}

const MEDIA_LIMITS: Record<string, MediaValidation> = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
  },
  video: {
    maxSize: 16 * 1024 * 1024, // 16MB
    allowedTypes: ['video/mp4', 'video/3gpp']
  },
  audio: {
    maxSize: 16 * 1024 * 1024, // 16MB
    allowedTypes: ['audio/mpeg', 'audio/ogg', 'audio/aac']
  },
  document: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['application/pdf', 'application/msword', /* etc */]
  }
};
```

---

## 17. Testes de Integração Sugeridos

### Checklist de Testes por Endpoint

```typescript
// Exemplo de estrutura de teste
describe('QuePasa API Integration', () => {
  describe('Message Operations', () => {
    it('should send text message', async () => {
      // Test implementation
    });
    
    it('should send media message', async () => {
      // Test implementation
    });
    
    it('should handle invalid token', async () => {
      // Test error handling
    });
    
    it('should handle rate limiting', async () => {
      // Test rate limit
    });
  });
  
  // ... outros testes
});
```

---

## 18. Documentação de Resposta por Endpoint

### Exemplo: POST /send

**Request:**
```http
POST /send HTTP/1.1
Host: quepasa.example.com
X-QUEPASA-TOKEN: your-token-here
X-QUEPASA-CHATID: 5511999999999@s.whatsapp.net
Content-Type: application/json

{
  "text": "Hello World!"
}
```

**Response Success (200):**
```json
{
  "id": "3EB0C7F3A5B4A7F3D0D1",
  "timestamp": "2026-01-21T10:30:45Z",
  "chatId": "5511999999999@s.whatsapp.net",
  "fromMe": true,
  "text": "Hello World!"
}
```

**Response Error (401):**
```json
{
  "error": true,
  "message": "Invalid or expired token",
  "code": "UNAUTHORIZED"
}
```

---

## 19. Observações Finais

### Compatibilidade de Versões

- **v4**: Versão atual recomendada - priorizar implementação
- **v3**: Manter compatibilidade quando possível
- **v2**: Suporte legado - implementar apenas se necessário
- **v1**: Depreciado - não implementar

### Variáveis de Ambiente do QuePasa

Importante conhecer para troubleshooting:

```env
GROUPS=true                 # Habilita funcionalidades de grupo
BROADCASTS=false            # Broadcasts (experimental)
READRECEIPTS=true           # Recibos de leitura
CALLS=true                  # Aceitar chamadas
READUPDATE=true             # Marcar como lido ao enviar
CACHELENGTH=800             # Mensagens em cache
HISTORYSYNCDAYS=30          # Dias de histórico no QR scan
```

### Dicas de Implementação

1. **Use TypeScript** para tipagem forte
2. **Implemente retry logic** para falhas temporárias
3. **Cache inteligente** para operações frequentes
4. **Logs detalhados** para debugging
5. **Testes automatizados** para cada endpoint
6. **Documentação inline** nos nodes

---

**Documento criado em:** 21/01/2026  
**Última atualização:** 21/01/2026  
**Versão:** 1.0  
**Status:** 📋 Guia de Referência  

---

## 20. Roadmap de Cobertura

```mermaid
gantt
    title Implementação de Endpoints - Timeline
    dateFormat  YYYY-MM-DD
    section Core
    Message Send          :done, 2026-01-15, 7d
    Session Management    :active, 2026-01-21, 14d
    Webhook Basic        :active, 2026-01-21, 7d
    section Groups
    List & Info          : 2026-02-04, 7d
    Create & Manage      : 2026-02-11, 14d
    Participants        : 2026-02-18, 7d
    section Advanced
    Contacts            : 2026-02-25, 7d
    Chat Operations     : 2026-03-04, 7d
    Status & Presence   : 2026-03-11, 7d
    section Polish
    Complete Testing    : 2026-03-18, 14d
    Documentation       : 2026-03-25, 7d
```

---

**Este documento deve ser atualizado conforme endpoints forem implementados. Marque com ✅ quando completar cada item.**
