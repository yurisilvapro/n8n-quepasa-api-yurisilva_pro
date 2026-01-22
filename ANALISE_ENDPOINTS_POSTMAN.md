# 🔍 Análise Comparativa: Endpoints Implementados vs Postman Collection

**Data:** 22 de Janeiro de 2026  
**Versão Atual:** v2.2.2  
**Referência:** [QuePasa Postman Collection](https://www.postman.com/sufficit-team/sufficit-public-workspace/collection/d8s5uao/quepasa)

---

## 📊 RESUMO EXECUTIVO

| Categoria | Implementado | Postman | Status |
|-----------|--------------|---------|--------|
| **Session** | 4 ops | ? | ⏳ Verificar |
| **Message** | 7 ops | ? | ⏳ Verificar |
| **Group** | 14 ops | ? | ⏳ Verificar |
| **Contact** | 6 ops | ? | ⏳ Verificar |
| **Media** | 4 ops | ? | ⏳ Verificar |
| **Webhook** | 5 ops | ? | ⏳ Verificar |
| **Chat** | 7 ops | ? | ⏳ Verificar |
| **Status** | 3 ops | ? | ⏳ Verificar |
| **TOTAL** | **50 ops** | **?** | ⏳ |

---

## 🔍 ANÁLISE DETALHADA POR RECURSO

### 1️⃣ SESSION (Sessão)

#### Implementado:

| Operação | Método | Endpoint | Status |
|----------|--------|----------|--------|
| Get QR Code | POST | `/scan` | ✅ |
| Check Status | GET | `/info` | ✅ |
| Get Info | GET | `/info` | ✅ |
| Disconnect | POST | `/logout` | ✅ |

#### Postman Collection:
⏳ **Aguardando análise da collection**

#### ⚠️ Possíveis Problemas Identificados:
1. **Get QR Code** usa headers customizados (`X-QUEPASA-USER`, `X-QUEPASA-TOKEN`)
   - Verificar se está correto na documentação oficial
2. **Check Status** e **Get Info** usam o mesmo endpoint `/info`
   - Pode ser redundante ou intencional

---

### 2️⃣ MESSAGE (Mensagens)

#### Implementado:

| Operação | Método | Endpoint | Body/Params | Status |
|----------|--------|----------|-------------|--------|
| Send Text | POST | `/send` | `{chatId, text, trackId?}` | ✅ |
| Send Media | POST | `/send` | `{chatId, [mediaType]: base64}` | ✅ |
| Send From URL | POST | `/send` | `{chatId, url, caption?, filename?}` | ✅ |
| Revoke Message | DELETE | `/messages/{id}` | - | ✅ |
| React to Message | POST | `/messages/{id}/react` | `{emoji}` | ✅ |
| Forward Message | POST | `/messages/{id}/forward` | `{to}` | ✅ |
| Get History | GET | `/chats/{id}/messages` | `?limit=X` | ✅ |

#### Postman Collection:
⏳ **Aguardando análise da collection**

#### ⚠️ Possíveis Problemas:
1. **Send Media** - Verificar se formato base64 inline está correto
2. **Send From URL** - Confirmar se API suporta download direto de URL
3. **Get History** - Verificar limite máximo (implementado: 100)

---

### 3️⃣ GROUP (Grupos)

#### Implementado:

| Operação | Método | Endpoint | Body/Params | Status |
|----------|--------|----------|-------------|--------|
| List Groups | GET | `/groups` | - | ✅ |
| Get Group Info | GET | `/groups/{id}` | - | ✅ |
| Create Group | POST | `/groups` | `{title, participants, topic?}` | ✅ |
| Update Name | PUT | `/groups/{id}/name` | `{name}` | ✅ |
| Update Description | PUT | `/groups/{id}/description` | `{description}` | ✅ |
| Update Picture | PUT | `/groups/{id}/picture` | `{picture: base64}` | ✅ |
| Remove Picture | DELETE | `/groups/{id}/picture` | - | ✅ |
| Add Participants | POST | `/groups/{id}/participants` | `{participants: []}` | ✅ |
| Remove Participant | DELETE | `/groups/{id}/participants/{phone}` | - | ✅ |
| Promote to Admin | POST | `/groups/{id}/admins` | `{participants: []}` | ✅ |
| Demote from Admin | DELETE | `/groups/{id}/admins/{phone}` | - | ✅ |
| Get Invite Link | GET | `/groups/{id}/invite` | - | ✅ |
| Revoke Invite Link | DELETE | `/groups/{id}/invite` | - | ✅ |
| Join via Invite | POST | `/groups/join` | `{inviteCode}` | ✅ |
| Leave Group | POST | `/groups/{id}/leave` | - | ✅ |

#### Postman Collection:
⏳ **Aguardando análise da collection**

#### ⚠️ Possíveis Problemas:
1. **Update Picture** - Verificar formato base64 aceito
2. **Remove Participant** - Confirmar se usa phone ou participantId
3. **Join via Invite** - Verificar formato do inviteCode

---

### 4️⃣ CONTACT (Contatos)

#### Implementado:

| Operação | Método | Endpoint | Body/Params | Status |
|----------|--------|----------|-------------|--------|
| List Contacts | GET | `/contacts` | - | ✅ |
| Get Contact Info | GET | `/contacts/{phone}` | - | ✅ |
| Check WhatsApp | GET | `/contacts/{phone}/exists` | - | ✅ |
| Get Picture | GET | `/contacts/{phone}/picture` | - | ✅ |
| Block Contact | POST | `/contacts/{phone}/block` | - | ✅ |
| Unblock Contact | DELETE | `/contacts/{phone}/block` | - | ✅ |

#### Postman Collection:
⏳ **Aguardando análise da collection**

---

### 5️⃣ MEDIA (Mídia)

#### Implementado:

| Operação | Método | Endpoint | Body/Params | Status |
|----------|--------|----------|-------------|--------|
| Download Media | GET | `/media/{id}` | - | ✅ |
| Download as Base64 | GET | `/media/{id}/base64` | - | ✅ |
| Get Profile Picture | GET | `/profile/picture` | - | ✅ |
| Get Picture Info | GET | `/profile/picture/info` | - | ✅ |

#### Postman Collection:
⏳ **Aguardando análise da collection**

---

### 6️⃣ WEBHOOK (Webhooks)

#### Implementado:

| Operação | Método | Endpoint | Body/Params | Status |
|----------|--------|----------|-------------|--------|
| Set Webhook | POST | `/webhook` | `{url, events?}` | ✅ |
| Get Webhook | GET | `/webhook` | - | ✅ |
| Update Webhook | PUT | `/webhook` | `{url, events?}` | ✅ |
| Delete Webhook | DELETE | `/webhook` | - | ✅ |
| Set RabbitMQ | POST | `/webhook/rabbitmq` | `{url, queue, exchange?}` | ✅ |

#### Postman Collection:
⏳ **Aguardando análise da collection**

---

### 7️⃣ CHAT (Conversas)

#### Implementado:

| Operação | Método | Endpoint | Body/Params | Status |
|----------|--------|----------|-------------|--------|
| Archive Chat | POST | `/chats/{id}/archive` | - | ✅ |
| Unarchive Chat | DELETE | `/chats/{id}/archive` | - | ✅ |
| Pin Chat | POST | `/chats/{id}/pin` | - | ✅ |
| Unpin Chat | DELETE | `/chats/{id}/pin` | - | ✅ |
| Mute Chat | POST | `/chats/{id}/mute` | `{duration?}` | ✅ |
| Unmute Chat | DELETE | `/chats/{id}/mute` | - | ✅ |
| Mark as Read | POST | `/chats/{id}/read` | - | ✅ |

#### Postman Collection:
⏳ **Aguardando análise da collection**

---

### 8️⃣ STATUS (Status/Presença)

#### Implementado:

| Operação | Método | Endpoint | Body/Params | Status |
|----------|--------|----------|-------------|--------|
| Update Presence | POST | `/presence` | `{state: available/unavailable}` | ✅ |
| Update Status | POST | `/status` | `{text}` | ✅ |
| Get Contact Status | GET | `/contacts/{phone}/status` | - | ✅ |

#### Postman Collection:
⏳ **Aguardando análise da collection**

---

## 🚨 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **Logo não aparece nos nodes**

**Causa:**
- SVG não está sendo copiado para `dist/nodes/QuePasa/`
- Script `copy:assets` copia para `dist/QuePasa/` (errado)

**Solução Implementada:**
```json
"copy:assets": "copyfiles -u 1 \"nodes/**/*.{png,svg,json}\" dist/ && copyfiles -u 1 \"credentials/*.svg\" dist/credentials/ && node -e \"const fs=require('fs');const path=require('path');if(fs.existsSync('dist/QuePasa/quepasa.svg')){fs.mkdirSync('dist/nodes/QuePasa',{recursive:true});fs.copyFileSync('dist/QuePasa/quepasa.svg','dist/nodes/QuePasa/quepasa.svg');}\""
```

**Status:** ✅ Corrigido

---

### 2. **Validação de Credenciais**

**Problema:** Teste passa com token inválido

**Status:** ⚠️ Limitação da API QuePasa (documentado em `NOTA_VALIDACAO_CREDENCIAIS.md`)

---

## 📋 CHECKLIST DE VALIDAÇÃO

### Endpoints a Verificar na Postman Collection:

- [ ] **Session**
  - [ ] `/scan` - método, headers, body
  - [ ] `/info` - resposta esperada
  - [ ] `/logout` - confirmação necessária?

- [ ] **Message**
  - [ ] `/send` - formatos aceitos (text, media, url)
  - [ ] `/messages/{id}` - DELETE funciona?
  - [ ] `/messages/{id}/react` - emojis suportados
  - [ ] `/messages/{id}/forward` - campo `to` correto?
  - [ ] `/chats/{id}/messages` - limite máximo?

- [ ] **Group**
  - [ ] Todos os 14 endpoints
  - [ ] Formato de participants array
  - [ ] Picture upload format

- [ ] **Contact**
  - [ ] `/contacts/{phone}/exists` - endpoint correto?
  - [ ] Block/Unblock - método correto?

- [ ] **Media**
  - [ ] Download endpoints
  - [ ] Base64 encoding

- [ ] **Webhook**
  - [ ] RabbitMQ configuration
  - [ ] Events array format

- [ ] **Chat**
  - [ ] Mute duration format
  - [ ] Archive/Pin endpoints

- [ ] **Status**
  - [ ] Presence states
  - [ ] Status text limits

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Corrigir logo** - FEITO
2. ⏳ **Analisar Postman Collection** - EM ANDAMENTO
3. ⏳ **Comparar cada endpoint**
4. ⏳ **Corrigir discrepâncias**
5. ⏳ **Testar todos os endpoints**
6. ⏳ **Atualizar documentação**
7. ⏳ **Publicar nova versão**

---

## 📞 REFERÊNCIAS

- **Postman Collection:** https://www.postman.com/sufficit-team/sufficit-public-workspace/collection/d8s5uao/quepasa
- **GitHub Repo:** https://github.com/yurisilvapro/n8n-nodes-quepasa-api-yurisilva_pro
- **QuePasa Official:** https://github.com/nocodeleaks/quepasa

---

**Status:** 🔄 **EM ANÁLISE**  
**Próxima Ação:** Verificar Postman Collection e comparar endpoints
