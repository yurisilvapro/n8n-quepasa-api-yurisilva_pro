# Media Node - Especificação Completa

## 📋 Visão Geral

O **Media Node** gerencia operações relacionadas a download e manipulação de mídias recebidas.

### Propósito
- Download de mídias de mensagens
- Conversão para base64
- Obter fotos de perfil
- Metadados de mídia

### Prioridade
⭐⭐⭐⭐ **ALTA** - Essencial para processar mídias recebidas.

---

## 🎯 Operações Disponíveis

### Resumo das Operações

| Operação | Prioridade | Complexidade | Status |
|----------|-----------|--------------|--------|
| Download Media | ALTA | Média | ✅ Fase 1 |
| **Download as Base64** | MÉDIA | Média | ✅ **Fase 2** |

---

## 📡 Operação 1: Download Media

### Descrição
Faz download de mídia (imagem, vídeo, áudio ou documento) de uma mensagem.

### Endpoint
```
GET /download
```

### Query Parameters
```typescript
{
  messageId: string;       // Obrigatório
  token?: string;          // Token (se não estiver no header)
}
```

### Alternativa com Path Param
```
GET /download/{messageId}
```

### Headers
```typescript
{
  'X-QUEPASA-TOKEN': string,
  'Accept': '*/*'
}
```

### Response Success (200)
- **Content-Type**: Mimetype do arquivo (ex: `image/jpeg`, `video/mp4`)
- **Content-Disposition**: `attachment; filename="filename.ext"`
- **Body**: Stream binário do arquivo

### Exemplo de Uso

#### Request cURL
```bash
curl --location 'https://quepasa.example.com/download?messageId=3EB0C7F3A5B4A7F3D0D1' \
  --header 'X-QUEPASA-TOKEN: abc123xyz789' \
  --output arquivo.jpg
```

#### Workflow n8n
```
1. Webhook Trigger
   └── Recebe notificação de nova mensagem com mídia
   
2. Media Node (Download Media)
   └── messageId: {{ $json.message.id }}
   └── returnBinary: true
   
3. Save to Cloud Storage
   └── file: {{ $binary.data }}
```

### Implementação no n8n

#### Campos de Entrada
```typescript
[
  {
    displayName: 'Message ID',
    name: 'messageId',
    type: 'string',
    required: true,
    placeholder: '3EB0C7F3A5B4A7F3D0D1',
    description: 'ID of the message containing media'
  },
  {
    displayName: 'Download Format',
    name: 'downloadFormat',
    type: 'options',
    options: [
      { name: 'Binary', value: 'binary' },
      { name: 'Base64', value: 'base64' },
      { name: 'JSON with Metadata', value: 'json' }
    ],
    default: 'binary',
    description: 'Format to return the media'
  },
  {
    displayName: 'Binary Property Name',
    name: 'binaryPropertyName',
    type: 'string',
    default: 'data',
    displayOptions: {
      show: {
        downloadFormat: ['binary']
      }
    },
    description: 'Name of the binary property to store the file'
  }
]
```

### Possíveis Erros

#### 404 Not Found
```json
{
  "error": true,
  "message": "Message not found or media not available",
  "code": "MEDIA_NOT_FOUND"
}
```

#### 410 Gone
```json
{
  "error": true,
  "message": "Media expired or deleted",
  "code": "MEDIA_EXPIRED"
}
```

---

## 📡 Operação 2: Download as Base64

### Descrição
Baixa mídia e retorna codificada em base64 com metadados.

### Endpoint
```
POST /download/base64
```

### Request Body
```json
{
  "messageId": "3EB0C7F3A5B4A7F3D0D1"
}
```

### Response Success (200)
```json
{
  "messageId": "3EB0C7F3A5B4A7F3D0D1",
  "mimetype": "image/jpeg",
  "filename": "IMG-20260121-WA0001.jpg",
  "size": 245678,
  "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "width": 1920,
  "height": 1080,
  "duration": null
}
```

### Response Fields

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `messageId` | string | ID da mensagem |
| `mimetype` | string | Tipo MIME do arquivo |
| `filename` | string | Nome do arquivo |
| `size` | number | Tamanho em bytes |
| `base64` | string | Dados codificados em base64 |
| `width` | number | Largura (para imagens/vídeos) |
| `height` | number | Altura (para imagens/vídeos) |
| `duration` | number | Duração em segundos (para vídeos/áudios) |

### Implementação no n8n

#### Exemplo de Output
```typescript
{
  json: {
    messageId: '3EB0C7F3A5B4A7F3D0D1',
    mimetype: 'image/jpeg',
    filename: 'photo.jpg',
    size: 245678,
    dimensions: {
      width: 1920,
      height: 1080
    }
  },
  binary: {
    data: {
      data: '<base64-data>',
      mimeType: 'image/jpeg',
      fileName: 'photo.jpg',
      fileExtension: 'jpg'
    }
  }
}
```

---

## 📡 Operação 3: Get Profile Picture

### Descrição
Obtém a foto de perfil de um contato ou grupo.

### Endpoint
```
GET /pic
```

### Query Parameters
```typescript
{
  phone?: string;          // Número do contato
  chatId?: string;         // ID do chat (alternativa)
  type?: 'image' | 'preview';  // Default: 'image'
}
```

### Alternativa (Path Param)
```
GET /contacts/{contactId}/picture
GET /groups/{groupId}/picture
```

### Response Success (200)
- **Content-Type**: `image/jpeg`
- **Body**: Stream binário da imagem

### Tamanhos Disponíveis

| Type | Tamanho Aprox. | Uso |
|------|----------------|-----|
| `preview` | ~100x100 px | Miniaturas, listagens |
| `image` | ~640x640 px | Visualização completa |

### Implementação no n8n

#### Campos de Entrada
```typescript
[
  {
    displayName: 'Type',
    name: 'profileType',
    type: 'options',
    options: [
      { name: 'Contact', value: 'contact' },
      { name: 'Group', value: 'group' }
    ],
    default: 'contact',
    required: true
  },
  {
    displayName: 'Phone Number',
    name: 'phone',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        profileType: ['contact']
      }
    },
    placeholder: '5511999999999'
  },
  {
    displayName: 'Group ID',
    name: 'groupId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        profileType: ['group']
      }
    },
    placeholder: '123456@g.us'
  },
  {
    displayName: 'Picture Size',
    name: 'pictureSize',
    type: 'options',
    options: [
      { name: 'Preview (100x100)', value: 'preview' },
      { name: 'Full (640x640)', value: 'image' }
    ],
    default: 'image'
  }
]
```

---

## 📡 Operação 4: Get Picture Info

### Descrição
Obtém metadados da foto de perfil sem fazer download.

### Endpoint
```
GET /picinfo
```

### Query Parameters
```typescript
{
  phone: string;
}
```

### Response Success (200)
```json
{
  "phone": "5511999999999",
  "url": "https://pps.whatsapp.net/v/t61.24694-24/...",
  "id": "1642584000",
  "type": "image",
  "exists": true
}
```

### Response quando não tem foto
```json
{
  "phone": "5511999999999",
  "exists": false
}
```

---

## 🔧 Implementação Técnica Completa

```typescript
export enum MediaOperation {
  DOWNLOAD_MEDIA = 'downloadMedia',
  DOWNLOAD_BASE64 = 'downloadBase64',
  GET_PROFILE_PICTURE = 'getProfilePicture',
  GET_PICTURE_INFO = 'getPictureInfo'
}

export interface DownloadMediaRequest {
  messageId: string;
  returnFormat: 'binary' | 'base64' | 'json';
  binaryPropertyName?: string;
}

export interface MediaMetadata {
  messageId: string;
  mimetype: string;
  filename: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
}

export interface DownloadBase64Response extends MediaMetadata {
  base64: string;
}

export class MediaAPI {
  constructor(private baseUrl: string, private token: string) {}

  async downloadMedia(messageId: string): Promise<Buffer> {
    const response = await axios.get(
      `${this.baseUrl}/download`,
      {
        params: { messageId },
        headers: {
          'X-QUEPASA-TOKEN': this.token
        },
        responseType: 'arraybuffer'
      }
    );

    return Buffer.from(response.data);
  }

  async downloadAsBase64(messageId: string): Promise<DownloadBase64Response> {
    const response = await axios.post(
      `${this.baseUrl}/download/base64`,
      { messageId },
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  async getProfilePicture(
    phone: string,
    type: 'image' | 'preview' = 'image'
  ): Promise<Buffer> {
    const response = await axios.get(
      `${this.baseUrl}/pic`,
      {
        params: { phone, type },
        headers: {
          'X-QUEPASA-TOKEN': this.token
        },
        responseType: 'arraybuffer'
      }
    );

    return Buffer.from(response.data);
  }

  async getPictureInfo(phone: string): Promise<any> {
    const response = await axios.get(
      `${this.baseUrl}/picinfo`,
      {
        params: { phone },
        headers: {
          'X-QUEPASA-TOKEN': this.token
        }
      }
    );

    return response.data;
  }

  // Helper para detectar tipo de mídia
  static getMediaType(mimetype: string): 'image' | 'video' | 'audio' | 'document' {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('audio/')) return 'audio';
    return 'document';
  }

  // Helper para validar tamanho
  static validateMediaSize(size: number, type: string): void {
    const limits = {
      image: 5 * 1024 * 1024,
      video: 16 * 1024 * 1024,
      audio: 16 * 1024 * 1024,
      document: 100 * 1024 * 1024
    };

    const limit = limits[type as keyof typeof limits];
    if (size > limit) {
      throw new Error(`Media too large. Max ${limit / 1024 / 1024}MB for ${type}`);
    }
  }
}
```

---

## 📚 Casos de Uso Práticos

### 1. Salvar Mídias Recebidas

```typescript
// Workflow: Download automático de mídias
async function processIncomingMedia(message: any) {
  if (message.attachment) {
    const media = await mediaAPI.downloadAsBase64(message.id);
    
    // Salvar no S3/Storage
    await saveToCloud({
      filename: media.filename,
      content: media.base64,
      mimetype: media.mimetype,
      folder: `whatsapp/${message.chatId}`
    });
    
    console.log(`Mídia salva: ${media.filename} (${media.size} bytes)`);
  }
}
```

### 2. Backup de Fotos de Perfil

```typescript
// Workflow: Backup de fotos de contatos
async function backupProfilePictures() {
  const contacts = await contactAPI.listContacts();
  
  for (const contact of contacts) {
    try {
      const picture = await mediaAPI.getProfilePicture(contact.phone);
      
      await saveFile({
        filename: `${contact.phone}.jpg`,
        content: picture,
        folder: 'profile-pictures'
      });
    } catch (error) {
      console.log(`Sem foto: ${contact.name}`);
    }
  }
}
```

### 3. Processar Imagem com OCR

```typescript
// Workflow: Extrair texto de imagem recebida
async function processImageWithOCR(messageId: string) {
  // Download da imagem
  const media = await mediaAPI.downloadAsBase64(messageId);
  
  if (MediaAPI.getMediaType(media.mimetype) !== 'image') {
    throw new Error('Não é uma imagem');
  }
  
  // Processar com OCR
  const text = await ocrService.extractText(media.base64);
  
  return {
    originalImage: media.filename,
    extractedText: text
  };
}
```

---

## ⚠️ Considerações Importantes

### Limitações do WhatsApp

1. **Expiração**: Mídias antigas podem expirar e não estar mais disponíveis
2. **Tamanho**: Respeitar limites de tamanho por tipo
3. **Qualidade**: WhatsApp comprime mídias automaticamente

### Performance

1. **Cache**: Cachear mídias baixadas frequentemente
2. **Streaming**: Usar streaming para arquivos grandes
3. **Retry**: Implementar retry para falhas temporárias

### Segurança

1. **Validação**: Sempre validar mimetype e tamanho
2. **Sanitização**: Sanitizar nomes de arquivo
3. **Armazenamento**: Usar storage seguro e privado

---

**Documento criado em:** 21/01/2026  
**Versão:** 1.0  
**Status:** 📋 Especificação Completa
