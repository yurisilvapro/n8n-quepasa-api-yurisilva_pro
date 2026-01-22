# Contact Node - Especificação Completa

## 📋 Visão Geral

O **Contact Node** gerencia todas as operações relacionadas a contatos do WhatsApp.

### Propósito
- Listar contatos salvos
- Verificar se número está no WhatsApp
- Obter informações de contatos
- Bloquear/desbloquear contatos
- Obter fotos de perfil

### Prioridade
⭐⭐⭐ **MÉDIA** - Importante para validação e gerenciamento de contatos.

---

## 🎯 Operações Disponíveis

### Resumo das Operações

| Operação | Prioridade | Complexidade | Status |
|----------|-----------|--------------|--------|
| List Contacts | MÉDIA | Baixa | ✅ Fase 1 |
| Get Contact Info | MÉDIA | Baixa | ✅ Fase 1 |
| Check WhatsApp | ALTA | Baixa | ✅ Fase 1 |
| **Get Picture** | MÉDIA | Baixa | ✅ **Fase 2** |
| **Block Contact** | BAIXA | Baixa | ✅ **Fase 2** |
| **Unblock Contact** | BAIXA | Baixa | ✅ **Fase 2** |

---

## 📡 Operação 1: List Contacts

### Descrição
Lista todos os contatos salvos no WhatsApp.

### Endpoint
```
GET /contacts
```

### Response Success (200)
```json
{
  "contacts": [
    {
      "id": "5511999999999@s.whatsapp.net",
      "name": "João Silva",
      "pushname": "João",
      "isMyContact": true,
      "isBusiness": false
    },
    {
      "id": "5511888888888@s.whatsapp.net",
      "name": "Maria Santos",
      "pushname": "Maria",
      "isMyContact": true,
      "isBusiness": true,
      "businessProfile": {
        "name": "Maria Santos - Consultoria",
        "category": "Business Services"
      }
    }
  ],
  "total": 2
}
```

---

## 📡 Operação 2: Check WhatsApp

### Descrição
Verifica se um ou mais números de telefone estão registrados no WhatsApp.

### Endpoint
```
POST /contacts/check
```

### Request Body
```json
{
  "phones": [
    "5511999999999",
    "5511888888888",
    "5511777777777"
  ]
}
```

### Response Success (200)
```json
{
  "results": [
    {
      "phone": "5511999999999",
      "exists": true,
      "jid": "5511999999999@s.whatsapp.net",
      "isBusiness": false
    },
    {
      "phone": "5511888888888",
      "exists": true,
      "jid": "5511888888888@s.whatsapp.net",
      "isBusiness": true
    },
    {
      "phone": "5511777777777",
      "exists": false
    }
  ]
}
```

### Implementação no n8n

#### Campos de Entrada
```typescript
[
  {
    displayName: 'Phone Numbers',
    name: 'phones',
    type: 'string',
    typeOptions: {
      multipleValues: true
    },
    required: true,
    placeholder: '5511999999999',
    description: 'Phone numbers to check (without + or spaces)'
  },
  {
    displayName: 'Return Only Valid',
    name: 'returnOnlyValid',
    type: 'boolean',
    default: false,
    description: 'Return only numbers that exist on WhatsApp'
  }
]
```

### Exemplo de Uso

```typescript
// Validar lista de clientes
const phonesToCheck = [
  '5511999999999',
  '5511888888888',
  '5511777777777'
];

const result = await contactAPI.checkWhatsApp(phonesToCheck);

const validContacts = result.results.filter(r => r.exists);
console.log(`${validContacts.length} de ${phonesToCheck.length} estão no WhatsApp`);

// Enviar apenas para válidos
for (const contact of validContacts) {
  await messageAPI.sendText({
    chatId: contact.jid,
    text: 'Olá! Mensagem promocional...'
  });
}
```

---

## 📡 Operação 3: Get Contact Info

### Descrição
Obtém informações detalhadas de um contato específico.

### Endpoint
```
GET /contacts/{contactId}
```

### Response Success (200)
```json
{
  "id": "5511999999999@s.whatsapp.net",
  "name": "João Silva",
  "pushname": "João",
  "phone": "5511999999999",
  "isMyContact": true,
  "isBusiness": false,
  "status": "Disponível para conversas",
  "picture": "https://pps.whatsapp.net/v/...",
  "lastSeen": "2026-01-21T11:30:00Z"
}
```

---

## 📡 Operação 4: Get Picture

### Descrição
Obtém a foto de perfil de um contato.

### Endpoint
```
GET /contacts/{contactId}/picture
```

### Query Parameters
```typescript
{
  type?: 'image' | 'preview';  // Default: 'image'
}
```

### Response Success (200)
- **Content-Type**: `image/jpeg`
- **Body**: Binary image data

### Alternativa com Query Param
```
GET /pic?phone=5511999999999
```

---

## 📡 Operação 5: Block Contact

### Descrição
Bloqueia um contato.

### Endpoint
```
POST /contacts/block
```

### Request Body
```json
{
  "contactId": "5511999999999@s.whatsapp.net"
}
```

### Response Success (200)
```json
{
  "success": true,
  "contactId": "5511999999999@s.whatsapp.net",
  "blocked": true,
  "timestamp": "2026-01-21T12:00:00Z"
}
```

---

## 📡 Operação 6: Unblock Contact

### Descrição
Desbloqueia um contato.

### Endpoint
```
POST /contacts/unblock
```

### Request Body
```json
{
  "contactId": "5511999999999@s.whatsapp.net"
}
```

---

## 🔧 Implementação Técnica

```typescript
export class ContactAPI {
  async checkWhatsApp(phones: string[]): Promise<CheckWhatsAppResponse> {
    const response = await axios.post(
      `${this.baseUrl}/contacts/check`,
      { phones },
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

  async listContacts(): Promise<ContactInfo[]> {
    const response = await axios.get(
      `${this.baseUrl}/contacts`,
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token
        }
      }
    );
    return response.data.contacts;
  }

  async getContactInfo(contactId: string): Promise<ContactInfo> {
    const response = await axios.get(
      `${this.baseUrl}/contacts/${contactId}`,
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token
        }
      }
    );
    return response.data;
  }

  async blockContact(contactId: string): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/contacts/block`,
      { contactId },
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

**Documento criado em:** 21/01/2026  
**Versão:** 1.0  
**Status:** 📋 Especificação Completa
