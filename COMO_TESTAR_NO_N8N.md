# 🧪 Como Testar os Nodes QuePasa no n8n

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ n8n instalado (npm install -g n8n)
- ✅ QuePasa API rodando (http://localhost:31000)
- ✅ Token de acesso da API QuePasa
- ✅ Node.js >= 18
- ✅ Este projeto compilado (`npm run build`)

---

## 🚀 Passo 1: Link do Pacote

### 1.1. Link Global do Pacote

No diretório do projeto:

```bash
cd /c/Users/yuri_/Local\ Projects/n8n/n8n-quepasa-nodes-yurisilva_pro

# Criar link global
npm link
```

**Resultado esperado:**
```
added 1 package, and audited X packages in Xs
found 0 vulnerabilities
```

### 1.2. Link no n8n

```bash
# Ir para o diretório de nodes do n8n
cd ~/.n8n/nodes

# Se o diretório não existir, crie:
mkdir -p ~/.n8n/nodes
cd ~/.n8n/nodes

# Linkar o pacote
npm link n8n-nodes-quepasa
```

**Resultado esperado:**
```
~/.n8n/nodes/node_modules/n8n-nodes-quepasa -> /c/Users/yuri_/Local Projects/n8n/n8n-quepasa-nodes-yurisilva_pro
```

---

## 🔄 Passo 2: Reiniciar n8n

```bash
# Se n8n estiver rodando, pare (Ctrl+C)

# Inicie novamente
n8n start

# Ou em modo desenvolvimento
n8n start --tunnel
```

**O que verificar:**
- ✅ n8n iniciou sem erros
- ✅ Porta 5678 está ativa
- ✅ Console não mostra erros de carregamento de nodes

---

## 🔐 Passo 3: Configurar Credenciais

### 3.1. Abrir n8n

Abra no navegador: http://localhost:5678

### 3.2. Criar Credencial QuePasa API

1. Clique em **Credentials** (menu lateral)
2. Clique em **+ New Credential**
3. Procure por **QuePasa API**
4. Preencha:

```
Server URL: http://localhost:31000
Accounts:
  - Account Name: Main Account
  - Token: seu-token-aqui
  - User ID: admin
  - Phone: 5511999999999
```

5. Clique em **Save**
6. Teste a conexão clicando em **Test**

**Resultado esperado:**
```json
{
  "success": true,
  "status": "connected",
  "phone": "5511999999999"
}
```

---

## 📝 Passo 4: Testar Cada Node

### 4.1. Session Node

#### Teste 1: Get QR Code

1. Crie novo workflow
2. Adicione node **QuePasa**
3. Configure:
   - **Resource:** Session
   - **Operation:** Get QR Code
   - **User ID:** admin
   - **Return QR as Image:** true

4. Execute o node
5. Verifique:
   - ✅ JSON com `qrcode` (base64)
   - ✅ Binary data com imagem PNG

**Resultado esperado:**
```json
{
  "qrcode": "data:image/png;base64,iVBORw0KGg...",
  "pairingcode": "ABC-123-456"
}
```

#### Teste 2: Check Status

1. Adicione node **QuePasa**
2. Configure:
   - **Resource:** Session
   - **Operation:** Check Status

3. Execute
4. Verifique status da conexão

**Resultado esperado:**
```json
{
  "status": "connected",
  "phone": "5511999999999",
  "device": "iPhone 12"
}
```

#### Teste 3: Get Info

1. Configure:
   - **Resource:** Session
   - **Operation:** Get Info

2. Execute
3. Verifique informações da conta

#### Teste 4: Disconnect

1. Configure:
   - **Resource:** Session
   - **Operation:** Disconnect
   - **Confirmation:** true

2. Execute
3. Verifique desconexão

⚠️ **ATENÇÃO:** Isso desconectará sua sessão WhatsApp!

---

### 4.2. Message Node

#### Teste 1: Send Text

1. Adicione node **QuePasa**
2. Configure:
   - **Resource:** Message
   - **Operation:** Send Text
   - **Chat ID:** 5511999999999 (seu número para teste)
   - **Message:** "Teste do n8n-quepasa-nodes!"

3. Execute
4. Verifique mensagem no WhatsApp

**Resultado esperado:**
```json
{
  "id": "msg_123456",
  "timestamp": 1234567890,
  "status": "sent"
}
```

#### Teste 2: Send Media (Imagem)

1. **Passo A:** Adicione node **HTTP Request** ANTES
   - URL: https://picsum.photos/200
   - Response Format: File

2. **Passo B:** Adicione node **QuePasa**
3. Configure:
   - **Resource:** Message
   - **Operation:** Send Media
   - **Chat ID:** 5511999999999
   - **Media Type:** image
   - **Binary Property:** data
   - **Caption:** "Imagem de teste"

4. Execute workflow completo
5. Verifique imagem no WhatsApp

#### Teste 3: Send from URL

1. Configure:
   - **Resource:** Message
   - **Operation:** Send from URL
   - **Chat ID:** 5511999999999
   - **Media URL:** https://picsum.photos/200
   - **Caption:** "Imagem via URL"

2. Execute
3. Verifique imagem

#### Teste 4: Revoke Message

1. **Primeiro:** Envie uma mensagem e anote o ID
2. Configure:
   - **Resource:** Message
   - **Operation:** Revoke Message
   - **Message ID:** (ID da mensagem anterior)

3. Execute
4. Verifique que mensagem foi deletada

---

### 4.3. Group Node

#### Teste 1: List Groups

1. Configure:
   - **Resource:** Group
   - **Operation:** List Groups

2. Execute
3. Verifique lista de grupos

**Resultado esperado:**
```json
[
  {
    "id": "123456789@g.us",
    "name": "Grupo Teste",
    "participants": 5
  }
]
```

#### Teste 2: Create Group

1. Configure:
   - **Resource:** Group
   - **Operation:** Create Group
   - **Group Name:** "Grupo de Teste n8n"
   - **Participants:** 5511999999999, 5511888888888
   - **Description:** "Grupo criado pelo n8n"

2. Execute
3. Verifique grupo criado no WhatsApp

#### Teste 3: Get Group Info

1. Configure:
   - **Resource:** Group
   - **Operation:** Get Group Info
   - **Group ID:** (ID de um grupo existente)

2. Execute
3. Verifique informações

#### Teste 4: Add Participants

1. Configure:
   - **Resource:** Group
   - **Operation:** Add Participants
   - **Group ID:** (ID do grupo teste)
   - **Participants:** 5511777777777

2. Execute
3. Verifique participante adicionado

#### Teste 5: Remove Participant

1. Configure:
   - **Resource:** Group
   - **Operation:** Remove Participant
   - **Group ID:** (ID do grupo)
   - **Participant ID:** 5511777777777@s.whatsapp.net

2. Execute
3. Verifique remoção

#### Teste 6: Update Name

1. Configure:
   - **Resource:** Group
   - **Operation:** Update Name
   - **Group ID:** (ID do grupo)
   - **Group Name:** "Novo Nome do Grupo"

2. Execute
3. Verifique nome alterado

#### Teste 7: Leave Group

1. Configure:
   - **Resource:** Group
   - **Operation:** Leave Group
   - **Group ID:** (ID do grupo teste)

2. Execute
3. Verifique que saiu do grupo

---

### 4.4. Contact Node

#### Teste 1: List Contacts

1. Configure:
   - **Resource:** Contact
   - **Operation:** List Contacts

2. Execute
3. Verifique lista completa

#### Teste 2: Get Contact Info

1. Configure:
   - **Resource:** Contact
   - **Operation:** Get Contact Info
   - **Contact ID:** 5511999999999@s.whatsapp.net

2. Execute
3. Verifique informações

#### Teste 3: Check WhatsApp

1. Configure:
   - **Resource:** Contact
   - **Operation:** Check WhatsApp
   - **Phone Numbers:** 5511999999999, 5511888888888, 5511777777777

2. Execute
3. Verifique quais estão no WhatsApp

**Resultado esperado:**
```json
{
  "valid": [
    "5511999999999@s.whatsapp.net",
    "5511888888888@s.whatsapp.net"
  ],
  "invalid": [
    "5511777777777"
  ]
}
```

---

### 4.5. Media Node

#### Teste 1: Download Media

1. **Passo A:** Envie uma mensagem com mídia e anote o Message ID

2. **Passo B:** Configure node:
   - **Resource:** Media
   - **Operation:** Download Media
   - **Message ID:** (ID da mensagem)
   - **Binary Property Name:** data

3. Execute
4. Verifique Binary Data retornado

5. **Passo C:** Adicione node **Write File** para salvar
   - File Name: downloaded_media.jpg
   - Binary Property: data

---

### 4.6. Webhook Node

#### Teste 1: Set Webhook

1. **Passo A:** Crie um workflow com Webhook Trigger
2. Copie a URL do webhook

3. **Passo B:** Configure node QuePasa:
   - **Resource:** Webhook
   - **Operation:** Set Webhook
   - **Webhook URL:** (URL copiada)
   - **Forward Internal:** true

4. Execute
5. Verifique webhook configurado

#### Teste 2: Get Webhook

1. Configure:
   - **Resource:** Webhook
   - **Operation:** Get Webhook

2. Execute
3. Verifique configuração atual

#### Teste 3: Test Webhook

1. Envie uma mensagem para o número
2. Verifique se webhook recebeu o evento

#### Teste 4: Delete Webhook

1. Configure:
   - **Resource:** Webhook
   - **Operation:** Delete Webhook

2. Execute
3. Verifique remoção

---

### 4.7. Chat Node

#### Teste 1: Mark as Read

1. Configure:
   - **Resource:** Chat
   - **Operation:** Mark as Read
   - **Chat ID:** 5511999999999@s.whatsapp.net

2. Execute
3. Verifique chat marcado como lido

#### Teste 2: Archive Chat

1. Configure:
   - **Resource:** Chat
   - **Operation:** Archive Chat
   - **Chat ID:** 5511999999999@s.whatsapp.net

2. Execute
3. Verifique chat arquivado

---

### 4.8. Status Node

#### Teste 1: Update Presence (Online)

1. Configure:
   - **Resource:** Status
   - **Operation:** Update Presence
   - **Presence:** available

2. Execute
3. Verifique status online

#### Teste 2: Update Presence (Offline)

1. Configure:
   - **Presence:** unavailable

2. Execute
3. Verifique status offline

---

## 🔄 Passo 5: Workflows de Teste Completos

### Workflow 1: Autenticação Completa

```
[Manual Trigger]
    ↓
[QuePasa: Check Status]
    ↓
[IF: Status = connected?]
    ├─ Yes → [QuePasa: Get Info] → [Done]
    └─ No → [QuePasa: Get QR Code] → [Email QR Code]
```

### Workflow 2: Envio em Massa

```
[Schedule Trigger]
    ↓
[Code: Get Contact List]
    ↓
[QuePasa: Check WhatsApp]
    ↓
[Filter: Only Valid]
    ↓
[Loop: For Each Contact]
    ↓
[QuePasa: Send Text]
    ↓
[Wait 1s]
```

### Workflow 3: Webhook com Reply Automático

```
[Webhook Trigger]
    ↓
[QuePasa: Download Media] (se houver)
    ↓
[Code: Process Message]
    ↓
[QuePasa: Send Text] (reply)
    ↓
[QuePasa: Mark as Read]
```

---

## ✅ Checklist de Validação

### Session Node
- [ ] Get QR Code retorna imagem
- [ ] Check Status funciona
- [ ] Get Info retorna dados
- [ ] Disconnect requer confirmação

### Message Node
- [ ] Send Text envia mensagem
- [ ] Send Media envia imagem
- [ ] Send Media envia vídeo
- [ ] Send Media envia documento
- [ ] Send from URL funciona
- [ ] Revoke Message deleta

### Group Node
- [ ] List Groups retorna todos
- [ ] Create Group cria novo
- [ ] Get Group Info retorna detalhes
- [ ] Add Participants adiciona
- [ ] Remove Participant remove
- [ ] Update Name altera nome
- [ ] Leave Group sai do grupo

### Contact Node
- [ ] List Contacts retorna todos
- [ ] Get Contact Info funciona
- [ ] Check WhatsApp valida números

### Media Node
- [ ] Download Media retorna binary

### Webhook Node
- [ ] Set Webhook configura
- [ ] Get Webhook retorna config
- [ ] Delete Webhook remove
- [ ] Webhook recebe eventos

### Chat Node
- [ ] Mark as Read funciona
- [ ] Archive Chat arquiva

### Status Node
- [ ] Update Presence online funciona
- [ ] Update Presence offline funciona

---

## 🐛 Troubleshooting

### Problema: Node não aparece no n8n

**Solução:**
```bash
# Verificar link
ls -la ~/.n8n/nodes/node_modules/

# Re-fazer link
cd ~/.n8n/nodes
npm unlink n8n-nodes-quepasa
npm link n8n-nodes-quepasa

# Reiniciar n8n
n8n start
```

### Problema: Erro "Credential type not found"

**Solução:**
```bash
# Recompilar projeto
cd /c/Users/yuri_/Local\ Projects/n8n/n8n-quepasa-nodes-yurisilva_pro
npm run build

# Re-linkar
npm link
cd ~/.n8n/nodes
npm link n8n-nodes-quepasa

# Reiniciar n8n
```

### Problema: Binary data não funciona

**Causa:** Node anterior não retornou binary  
**Solução:** Use HTTP Request com Response Format: File

### Problema: "Chat ID invalid"

**Causa:** Formato incorreto  
**Solução:** Use formato: `5511999999999@s.whatsapp.net` ou `5511999999999`

### Problema: "Token invalid"

**Solução:**
1. Verifique token na credencial
2. Teste endpoint `/info` manualmente
3. Gere novo token no QuePasa

### Problema: Timeout

**Causa:** QuePasa não está respondendo  
**Solução:**
```bash
# Verificar se QuePasa está rodando
curl http://localhost:31000/info

# Se não, inicie QuePasa
docker start quepasa
# ou
quepasa start
```

---

## 📊 Logs e Debug

### Ver Logs do n8n

```bash
# Iniciar n8n com logs detalhados
N8N_LOG_LEVEL=debug n8n start
```

### Ver Requisições HTTP

1. Adicione node **HTTP Request** com:
   - Response: Include Response Headers
   - Full Response: true

2. Verifique `headers` e `statusCode`

### Debug de Credenciais

1. No node QuePasa, clique em **Settings**
2. Ative **Always Output Data**
3. Execute e veja JSON completo

---

## 🎯 Próximos Passos Após Testes

### Se Tudo Funcionou ✅

1. [ ] Marcar todos os checkboxes acima
2. [ ] Documentar bugs encontrados
3. [ ] Criar workflows reais
4. [ ] Publicar no npm (opcional)
5. [ ] Compartilhar com comunidade

### Se Encontrou Bugs 🐛

1. [ ] Anotar detalhes:
   - Node/Operação
   - Input usado
   - Output esperado vs real
   - Logs de erro

2. [ ] Criar issue no GitHub

3. [ ] Propor fix

4. [ ] Testar novamente

---

## 📞 Suporte

**Problemas?** Consulte:
- [IMPLEMENTACAO_COMPLETA.md](./IMPLEMENTACAO_COMPLETA.md)
- [QUICK_START.md](./QUICK_START.md)
- [docs/README.md](./docs/README.md)

**Bugs?** Reporte:
- GitHub Issues: https://github.com/yurisilva_pro/n8n-quepasa-nodes/issues

---

**🎉 Boa sorte com os testes! 🎉**

**Tempo estimado:** 30-60 minutos para testar tudo
