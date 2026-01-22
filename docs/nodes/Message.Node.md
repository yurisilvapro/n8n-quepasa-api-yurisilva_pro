# Message Node - Especificação Completa

## 📋 Visão Geral

O **Message Node** é o coração do sistema, responsável por todas as operações de envio, recebimento e manipulação de mensagens no WhatsApp.

### Propósito
- Enviar mensagens de texto
- Enviar mídia (imagens, vídeos, áudios, documentos)
- Revogar mensagens
- Enviar reações
- Encaminhar mensagens
- Obter histórico de conversas

### Prioridade
⭐⭐⭐⭐⭐ **CRÍTICA** - Principal funcionalidade do sistema.

---

## 🎯 Operações Disponíveis

### Resumo das Operações

| Operação | Prioridade | Complexidade | Status |
|----------|-----------|--------------|--------|
| Send Text | CRÍTICA | Baixa | ✅ Fase 1 |
| Send Media | CRÍTICA | Média | ✅ Fase 1 |
| Send from URL | ALTA | Média | ✅ Fase 1 |
| Revoke Message | MÉDIA | Baixa | ✅ Fase 1 |
| **React to Message** | ALTA | Baixa | ✅ **Fase 2** |
| **Forward Message** | ALTA | Média | ✅ **Fase 2** |
| **Get History** | MÉDIA | Média | ✅ **Fase 2** |

---

## 📡 Operação 1: Send Text

### Descrição
Envia uma mensagem de texto simples para um contato ou grupo.

### Endpoint
```
POST /send
```

### Versões Suportadas
- `/send` (v4 - Recomendado)
- `/v3/send` (v3 - Compatibilidade)
- `/v2/send` (v2 - Legado)

### Headers Obrigatórios
```typescript
{
  'X-QUEPASA-TOKEN': string,         // Token da sessão
  'X-QUEPASA-CHATID': string,        // ID do destinatário
  'X-QUEPASA-TRACKID'?: string,      // ID de rastreamento (opcional)
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

### Request Body
```json
{
  "text": "Hello World!\nSuporta múltiplas linhas\n\n✅ E emojis também!"
}
```

### Response Success (200)
```json
{
  "id": "3EB0C7F3A5B4A7F3D0D1",
  "timestamp": "2026-01-21T10:30:45Z",
  "chatId": "5511999999999@s.whatsapp.net",
  "fromMe": true,
  "text": "Hello World!\nSuporta múltiplas linhas\n\n✅ E emojis também!",
  "trackId": "custom-track-id"
}
```

### Response Fields

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | ID único da mensagem |
| `timestamp` | string | Data/hora do envio (ISO 8601) |
| `chatId` | string | JID do destinatário |
| `fromMe` | boolean | Sempre true para mensagens enviadas |
| `text` | string | Conteúdo da mensagem |
| `trackId` | string | ID de rastreamento (se fornecido) |

### Formatação de Chat ID

```typescript
// Contatos individuais
"5511999999999@s.whatsapp.net"

// Grupos
"123456789012345678@g.us"

// Broadcast (se habilitado)
"status@broadcast"
```

### Possíveis Erros

#### 400 Bad Request
```json
{
  "error": true,
  "message": "Text message is required",
  "code": "INVALID_MESSAGE"
}
```

#### 401 Unauthorized
```json
{
  "error": true,
  "message": "Invalid or expired token",
  "code": "UNAUTHORIZED"
}
```

#### 404 Not Found
```json
{
  "error": true,
  "message": "Chat not found",
  "code": "CHAT_NOT_FOUND"
}
```

#### 429 Too Many Requests
```json
{
  "error": true,
  "message": "Rate limit exceeded. Please wait.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 30
}
```

### Implementação no n8n

#### Parâmetros do Node
```typescript
{
  name: 'Send Text',
  value: 'sendText',
  description: 'Send a text message',
  action: 'Send text message'
}
```

#### Campos de Entrada
```typescript
[
  {
    displayName: 'Chat ID',
    name: 'chatId',
    type: 'string',
    default: '',
    required: true,
    placeholder: '5511999999999',
    description: 'Phone number or group ID'
  },
  {
    displayName: 'Message',
    name: 'text',
    type: 'string',
    typeOptions: {
      rows: 4
    },
    default: '',
    required: true,
    description: 'Text message to send'
  },
  {
    displayName: 'Track ID',
    name: 'trackId',
    type: 'string',
    default: '',
    description: 'Custom tracking ID (optional)'
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    default: {},
    options: [
      {
        displayName: 'Auto Format Phone',
        name: 'autoFormat',
        type: 'boolean',
        default: true,
        description: 'Automatically format phone number'
      },
      {
        displayName: 'Quote Message ID',
        name: 'quotedMessageId',
        type: 'string',
        default: '',
        description: 'Reply to a specific message'
      }
    ]
  }
]
```

### Exemplo de Uso

#### Request cURL
```bash
curl --location 'https://quepasa.example.com/send' \
  --header 'X-QUEPASA-TOKEN: abc123xyz789' \
  --header 'X-QUEPASA-CHATID: 5511999999999' \
  --header 'X-QUEPASA-TRACKID: msg-001' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data '{
    "text": "Olá! Esta é uma mensagem de teste."
  }'
```

#### Workflow n8n
```
1. Webhook Trigger
   └── Recebe dados do cliente
   
2. Message Node (Send Text)
   └── chatId: {{ $json.phone }}
   └── text: "Olá {{ $json.name }}, recebemos seu contato!"
   
3. Database Node
   └── Salva registro do envio
```

### Validações Necessárias

```typescript
export class MessageValidator {
  static validateText(text: string): void {
    if (!text || text.trim().length === 0) {
      throw new Error('Message text is required');
    }
    if (text.length > 4096) {
      throw new Error('Message too long (max 4096 characters)');
    }
  }

  static validateChatId(chatId: string): string {
    // Remove espaços e caracteres especiais
    let cleaned = chatId.replace(/[^\d@.]/g, '');
    
    // Adicionar sufixo se necessário
    if (!cleaned.includes('@')) {
      // Assumir que é um número de telefone
      cleaned = `${cleaned}@s.whatsapp.net`;
    }
    
    return cleaned;
  }

  static validateTrackId(trackId?: string): void {
    if (trackId && trackId.length > 100) {
      throw new Error('Track ID too long (max 100 characters)');
    }
  }
}
```

---

## 📡 Operação 2: Send Media

### Descrição
Envia mídia (imagem, vídeo, áudio ou documento) com caption opcional.

### Endpoint
```
POST /send
```
*Mesmo endpoint, mas com campo `attachment`*

### Headers Obrigatórios
```typescript
{
  'X-QUEPASA-TOKEN': string,
  'X-QUEPASA-CHATID': string,
  'X-QUEPASA-TRACKID'?: string,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

### Request Body
```json
{
  "text": "Legenda da imagem (opcional)",
  "attachment": {
    "mimetype": "image/jpeg",
    "filename": "foto.jpg",
    "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }
}
```

### Tipos de Mídia Suportados

#### Imagens
```typescript
{
  mimetype: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
  maxSize: 5 * 1024 * 1024 // 5MB
}
```

#### Vídeos
```typescript
{
  mimetype: 'video/mp4' | 'video/3gpp' | 'video/quicktime',
  maxSize: 16 * 1024 * 1024 // 16MB
}
```

#### Áudios
```typescript
{
  mimetype: 'audio/mpeg' | 'audio/ogg' | 'audio/aac' | 'audio/mp4',
  maxSize: 16 * 1024 * 1024 // 16MB
}
```

#### Documentos
```typescript
{
  mimetype: 'application/pdf' | 'application/msword' | 'application/vnd.ms-excel' | 
            'application/vnd.openxmlformats-officedocument.*',
  maxSize: 100 * 1024 * 1024 // 100MB
}
```

### Response Success (200)
```json
{
  "id": "3EB0C7F3A5B4A7F3D0D1",
  "timestamp": "2026-01-21T10:35:20Z",
  "chatId": "5511999999999@s.whatsapp.net",
  "fromMe": true,
  "text": "Legenda da imagem",
  "attachment": {
    "mimetype": "image/jpeg",
    "filename": "foto.jpg",
    "size": 245678
  },
  "trackId": "media-001"
}
```

### Implementação no n8n

#### Campos de Entrada
```typescript
[
  {
    displayName: 'Chat ID',
    name: 'chatId',
    type: 'string',
    default: '',
    required: true
  },
  {
    displayName: 'Media Type',
    name: 'mediaType',
    type: 'options',
    options: [
      { name: 'Image', value: 'image' },
      { name: 'Video', value: 'video' },
      { name: 'Audio', value: 'audio' },
      { name: 'Document', value: 'document' }
    ],
    default: 'image',
    required: true
  },
  {
    displayName: 'Media Source',
    name: 'mediaSource',
    type: 'options',
    options: [
      { name: 'Binary Data', value: 'binary' },
      { name: 'URL', value: 'url' },
      { name: 'Base64', value: 'base64' }
    ],
    default: 'binary',
    required: true
  },
  {
    displayName: 'Binary Property',
    name: 'binaryProperty',
    type: 'string',
    default: 'data',
    required: true,
    displayOptions: {
      show: {
        mediaSource: ['binary']
      }
    }
  },
  {
    displayName: 'Caption',
    name: 'caption',
    type: 'string',
    default: '',
    description: 'Optional caption for the media'
  },
  {
    displayName: 'Filename',
    name: 'filename',
    type: 'string',
    default: '',
    placeholder: 'document.pdf',
    description: 'Custom filename'
  }
]
```

### Exemplo de Uso

#### Request cURL (Base64)
```bash
curl --location 'https://quepasa.example.com/send' \
  --header 'X-QUEPASA-TOKEN: abc123xyz789' \
  --header 'X-QUEPASA-CHATID: 5511999999999' \
  --header 'Content-Type: application/json' \
  --data '{
    "text": "Confira esta imagem!",
    "attachment": {
      "mimetype": "image/jpeg",
      "filename": "foto.jpg",
      "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    }
  }'
```

#### Workflow n8n - Enviar Imagem
```
1. HTTP Request Node
   └── Download image from URL
   
2. Message Node (Send Media)
   └── chatId: "5511999999999"
   └── mediaType: "image"
   └── mediaSource: "binary"
   └── binaryProperty: "data"
   └── caption: "Sua imagem solicitada"
```

### Validações de Mídia

```typescript
export class MediaValidator {
  static readonly LIMITS = {
    image: { maxSize: 5 * 1024 * 1024, types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] },
    video: { maxSize: 16 * 1024 * 1024, types: ['video/mp4', 'video/3gpp'] },
    audio: { maxSize: 16 * 1024 * 1024, types: ['audio/mpeg', 'audio/ogg', 'audio/aac'] },
    document: { maxSize: 100 * 1024 * 1024, types: ['application/pdf', 'application/msword'] }
  };

  static validateMedia(type: string, mimetype: string, size: number): void {
    const limit = this.LIMITS[type as keyof typeof this.LIMITS];
    
    if (!limit) {
      throw new Error(`Invalid media type: ${type}`);
    }
    
    if (!limit.types.some(t => mimetype.startsWith(t.split('/')[0]))) {
      throw new Error(`Invalid mimetype for ${type}: ${mimetype}`);
    }
    
    if (size > limit.maxSize) {
      throw new Error(`File too large. Max size for ${type}: ${this.formatBytes(limit.maxSize)}`);
    }
  }

  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  static base64ToBuffer(base64: string): Buffer {
    const matches = base64.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 format');
    }
    return Buffer.from(matches[2], 'base64');
  }
}
```

---

## 📡 Operação 3: Send from URL

### Descrição
Envia mídia a partir de uma URL externa, sem precisar fazer download manual.

### Endpoint
```
POST /sendurl
```

### Request Body
```json
{
  "text": "Documento importante",
  "url": "https://example.com/documento.pdf",
  "filename": "relatorio.pdf"
}
```

### Response Success (200)
```json
{
  "id": "3EB0C7F3A5B4A7F3D0D1",
  "timestamp": "2026-01-21T10:40:15Z",
  "chatId": "5511999999999@s.whatsapp.net",
  "fromMe": true,
  "text": "Documento importante",
  "attachment": {
    "url": "https://example.com/documento.pdf",
    "filename": "relatorio.pdf",
    "size": 1245678
  }
}
```

### Implementação no n8n

#### Campos de Entrada
```typescript
[
  {
    displayName: 'Chat ID',
    name: 'chatId',
    type: 'string',
    required: true
  },
  {
    displayName: 'Media URL',
    name: 'url',
    type: 'string',
    required: true,
    placeholder: 'https://example.com/file.pdf',
    description: 'Direct URL to the media file'
  },
  {
    displayName: 'Caption',
    name: 'caption',
    type: 'string',
    default: ''
  },
  {
    displayName: 'Filename',
    name: 'filename',
    type: 'string',
    default: '',
    description: 'Custom filename (optional)'
  }
]
```

### Validações de URL

```typescript
export class URLValidator {
  static validateURL(url: string): void {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Only HTTP(S) URLs are supported');
      }
    } catch (error) {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  static async checkURLAccessibility(url: string): Promise<boolean> {
    try {
      const response = await axios.head(url, { timeout: 5000 });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  static extractFilenameFromURL(url: string): string {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/');
    return parts[parts.length - 1] || 'file';
  }
}
```

---

## 📡 Operação 4: Send Base64 (Binary)

### Descrição
Envia arquivo codificado em base64 diretamente.

### Endpoint
```
POST /sendbinary
```

### Request Body
```json
{
  "text": "Arquivo enviado",
  "mimetype": "application/pdf",
  "filename": "documento.pdf",
  "base64": "/9j/4AAQSkZJRg..."
}
```

*Nota: `base64` pode ser com ou sem o prefixo `data:...;base64,`*

---

## 📡 Operação 5: Revoke Message

### Descrição
Revoga (apaga) uma mensagem enviada anteriormente.

### Endpoint
```
DELETE /message/{messageId}
```

### Headers Obrigatórios
```typescript
{
  'X-QUEPASA-TOKEN': string,
  'Accept': 'application/json'
}
```

### Path Parameters
- `messageId`: ID da mensagem a ser revogada

### Response Success (200)
```json
{
  "success": true,
  "messageId": "3EB0C7F3A5B4A7F3D0D1",
  "timestamp": "2026-01-21T10:45:00Z"
}
```

### Limitações
- Mensagens podem ser revogadas até **48 horas** após o envio
- Destinatário verá "Esta mensagem foi apagada"
- Não funciona para mensagens já lidas por muito tempo

### Implementação no n8n

#### Campos de Entrada
```typescript
[
  {
    displayName: 'Message ID',
    name: 'messageId',
    type: 'string',
    required: true,
    description: 'ID of the message to revoke'
  }
]
```

### Exemplo de Uso

```typescript
// Enviar mensagem
const sent = await messageNode.sendText({
  chatId: '5511999999999',
  text: 'Mensagem temporária'
});

// Aguardar 5 segundos
await sleep(5000);

// Revogar
await messageNode.revokeMessage({
  messageId: sent.id
});
```

---

## 📡 Operação 6: React to Message

### Descrição
Envia uma reação (emoji) para uma mensagem específica.

### Endpoint
```
POST /message/{messageId}/react
```

### Request Body
```json
{
  "emoji": "👍"
}
```

### Emojis Suportados
```typescript
const SUPPORTED_EMOJIS = [
  '👍', '❤️', '😂', '😮', '😢', '🙏'
];
```

### Response Success (200)
```json
{
  "success": true,
  "messageId": "3EB0C7F3A5B4A7F3D0D1",
  "emoji": "👍",
  "timestamp": "2026-01-21T10:50:00Z"
}
```

### Remover Reação
```json
{
  "emoji": ""
}
```
*Enviar emoji vazio remove a reação*

---

## 📡 Operação 7: Forward Message

### Descrição
Encaminha uma mensagem existente para outro chat.

### Endpoint
```
POST /message/{messageId}/forward
```

### Request Body
```json
{
  "chatId": "5511888888888@s.whatsapp.net"
}
```

### Response Success (200)
```json
{
  "success": true,
  "originalMessageId": "3EB0C7F3A5B4A7F3D0D1",
  "newMessageId": "4FA1D8G4B6C5B8G4E1E2",
  "chatId": "5511888888888@s.whatsapp.net",
  "timestamp": "2026-01-21T10:55:00Z"
}
```

---

## 📡 Operação 8: Get History

### Descrição
Obtém histórico de mensagens de um chat específico.

### Endpoint
```
GET /history
```

### Query Parameters
```typescript
{
  chatId: string;          // Obrigatório
  limit?: number;          // Default: 50, Max: 100
  before?: string;         // Message ID para paginação
  after?: string;          // Message ID para paginação
  fromTimestamp?: string;  // ISO 8601
  toTimestamp?: string;    // ISO 8601
}
```

### Response Success (200)
```json
{
  "messages": [
    {
      "id": "3EB0C7F3A5B4A7F3D0D1",
      "timestamp": "2026-01-21T09:30:00Z",
      "chatId": "5511999999999@s.whatsapp.net",
      "fromMe": false,
      "text": "Olá!",
      "sender": "5511999999999"
    },
    {
      "id": "4FA1D8G4B6C5B8G4E1E2",
      "timestamp": "2026-01-21T09:31:00Z",
      "chatId": "5511999999999@s.whatsapp.net",
      "fromMe": true,
      "text": "Oi! Como posso ajudar?"
    }
  ],
  "hasMore": true,
  "nextCursor": "4FA1D8G4B6C5B8G4E1E2"
}
```

### Exemplo de Paginação

```typescript
// Primeira página
const page1 = await messageNode.getHistory({
  chatId: '5511999999999',
  limit: 50
});

// Próxima página
if (page1.hasMore) {
  const page2 = await messageNode.getHistory({
    chatId: '5511999999999',
    limit: 50,
    before: page1.nextCursor
  });
}
```

---

## 🔧 Implementação Técnica Completa

### Interface TypeScript

```typescript
export enum MessageOperation {
  SEND_TEXT = 'sendText',
  SEND_MEDIA = 'sendMedia',
  SEND_FROM_URL = 'sendFromUrl',
  SEND_BASE64 = 'sendBase64',
  REVOKE_MESSAGE = 'revokeMessage',
  REACT_TO_MESSAGE = 'reactToMessage',
  FORWARD_MESSAGE = 'forwardMessage',
  GET_HISTORY = 'getHistory'
}

export interface SendTextRequest {
  chatId: string;
  text: string;
  trackId?: string;
  quotedMessageId?: string;
}

export interface SendMediaRequest extends SendTextRequest {
  mediaType: 'image' | 'video' | 'audio' | 'document';
  mediaSource: 'binary' | 'url' | 'base64';
  binaryProperty?: string;
  url?: string;
  base64?: string;
  mimetype?: string;
  filename?: string;
}

export interface MessageResponse {
  id: string;
  timestamp: string;
  chatId: string;
  fromMe: boolean;
  text?: string;
  attachment?: {
    mimetype: string;
    filename: string;
    size?: number;
  };
  trackId?: string;
}

export interface RevokeMessageRequest {
  messageId: string;
}

export interface ReactToMessageRequest {
  messageId: string;
  emoji: string;
}

export interface ForwardMessageRequest {
  messageId: string;
  chatId: string;
}

export interface GetHistoryRequest {
  chatId: string;
  limit?: number;
  before?: string;
  after?: string;
  fromTimestamp?: string;
  toTimestamp?: string;
}

export interface GetHistoryResponse {
  messages: MessageResponse[];
  hasMore: boolean;
  nextCursor?: string;
}
```

### API Client Completo

```typescript
export class MessageAPI {
  constructor(
    private baseUrl: string,
    private token: string
  ) {}

  async sendText(request: SendTextRequest): Promise<MessageResponse> {
    MessageValidator.validateText(request.text);
    const chatId = MessageValidator.validateChatId(request.chatId);

    const response = await axios.post(
      `${this.baseUrl}/send`,
      { text: request.text },
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'X-QUEPASA-CHATID': chatId,
          'X-QUEPASA-TRACKID': request.trackId || '',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    return response.data;
  }

  async sendMedia(request: SendMediaRequest): Promise<MessageResponse> {
    const chatId = MessageValidator.validateChatId(request.chatId);
    let attachment: any;

    if (request.mediaSource === 'binary') {
      // Processar dados binários
      attachment = await this.prepareBinaryAttachment(request);
    } else if (request.mediaSource === 'url') {
      // Usar endpoint /sendurl
      return this.sendFromURL({
        chatId: request.chatId,
        url: request.url!,
        caption: request.text,
        filename: request.filename
      });
    } else if (request.mediaSource === 'base64') {
      attachment = {
        mimetype: request.mimetype,
        filename: request.filename,
        base64: request.base64
      };
    }

    const response = await axios.post(
      `${this.baseUrl}/send`,
      {
        text: request.text,
        attachment
      },
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'X-QUEPASA-CHATID': chatId,
          'X-QUEPASA-TRACKID': request.trackId || '',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    return response.data;
  }

  async revokeMessage(request: RevokeMessageRequest): Promise<any> {
    const response = await axios.delete(
      `${this.baseUrl}/message/${request.messageId}`,
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Accept': 'application/json'
        }
      }
    );

    return response.data;
  }

  async reactToMessage(request: ReactToMessageRequest): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/message/${request.messageId}/react`,
      { emoji: request.emoji },
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

  async getHistory(request: GetHistoryRequest): Promise<GetHistoryResponse> {
    const chatId = MessageValidator.validateChatId(request.chatId);
    
    const params = new URLSearchParams();
    params.append('chatId', chatId);
    if (request.limit) params.append('limit', request.limit.toString());
    if (request.before) params.append('before', request.before);
    if (request.after) params.append('after', request.after);

    const response = await axios.get(
      `${this.baseUrl}/history?${params.toString()}`,
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Accept': 'application/json'
        }
      }
    );

    return response.data;
  }

  private async prepareBinaryAttachment(request: SendMediaRequest): Promise<any> {
    // Implementação para processar dados binários do n8n
    // Converter Buffer para base64
    return {
      mimetype: request.mimetype,
      filename: request.filename,
      base64: 'data:...'
    };
  }
}
```

---

## 🧪 Testes

```typescript
describe('Message Node', () => {
  describe('Send Text', () => {
    it('should send text message successfully', async () => {
      const result = await messageAPI.sendText({
        chatId: '5511999999999',
        text: 'Test message'
      });

      expect(result.id).toBeDefined();
      expect(result.text).toBe('Test message');
    });

    it('should throw error for empty text', async () => {
      await expect(
        messageAPI.sendText({ chatId: '5511999999999', text: '' })
      ).rejects.toThrow('Message text is required');
    });
  });

  describe('Send Media', () => {
    it('should send image successfully', async () => {
      const result = await messageAPI.sendMedia({
        chatId: '5511999999999',
        text: 'Test image',
        mediaType: 'image',
        mediaSource: 'base64',
        base64: 'data:image/jpeg;base64,...',
        mimetype: 'image/jpeg',
        filename: 'test.jpg'
      });

      expect(result.attachment).toBeDefined();
    });
  });

  describe('Revoke Message', () => {
    it('should revoke message successfully', async () => {
      const sent = await messageAPI.sendText({
        chatId: '5511999999999',
        text: 'Temporary message'
      });

      const result = await messageAPI.revokeMessage({
        messageId: sent.id
      });

      expect(result.success).toBe(true);
    });
  });
});
```

---

## 📚 Casos de Uso Práticos

### 1. Atendimento Automático
```typescript
// Workflow: Auto-resposta
async function handleNewMessage(message: any) {
  if (!message.fromMe && message.text.toLowerCase().includes('horário')) {
    await messageAPI.sendText({
      chatId: message.chatId,
      text: 'Nosso horário de atendimento:\nSeg-Sex: 9h às 18h\nSáb: 9h às 13h',
      quotedMessageId: message.id
    });
  }
}
```

### 2. Envio em Massa com Delay
```typescript
async function sendBulkMessages(contacts: string[], message: string) {
  for (const contact of contacts) {
    try {
      await messageAPI.sendText({
        chatId: contact,
        text: message
      });
      
      // Delay de 2 segundos entre envios
      await sleep(2000);
    } catch (error) {
      console.error(`Erro ao enviar para ${contact}:`, error);
    }
  }
}
```

### 3. Envio com Confirmação
```typescript
async function sendWithConfirmation(chatId: string, text: string) {
  const sent = await messageAPI.sendText({ chatId, text });
  
  // Aguardar 30 segundos
  await sleep(30000);
  
  // Se algo deu errado, revogar
  if (shouldRevoke) {
    await messageAPI.revokeMessage({ messageId: sent.id });
  }
}
```

---

**Documento criado em:** 21/01/2026  
**Versão:** 1.0  
**Status:** 📋 Especificação Completa  
**Próximo:** Group Node
