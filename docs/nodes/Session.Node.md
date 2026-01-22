# Session Node - Especificação Completa

## 📋 Visão Geral

O **Session Node** é responsável por todas as operações relacionadas à autenticação, gerenciamento de sessão e informações da conta WhatsApp conectada.

### Propósito
- Gerar QR Code para autenticação
- Verificar status da conexão
- Obter informações da conta conectada
- Desconectar sessões

### Prioridade
⭐⭐⭐⭐⭐ **CRÍTICA** - Sem sessão ativa, nenhuma outra operação funciona.

---

## 🎯 Operações Disponíveis

### Resumo das Operações

| Operação | Prioridade | Complexidade | Status |
|----------|-----------|--------------|--------|
| Get QR Code | ALTA | Média | ✅ Fase 1 |
| Check Status | ALTA | Baixa | ✅ Fase 1 |
| Get Info | ALTA | Baixa | ✅ Fase 1 |
| Disconnect | MÉDIA | Baixa | ✅ Fase 1 |

---

## 📡 Operação 1: Get QR Code

### Descrição
Gera um QR Code para autenticação de uma nova sessão WhatsApp. O usuário deve escanear o QR Code com o aplicativo WhatsApp no celular.

### Endpoint
```
POST /scan
```

### Versões Suportadas
- `/scan` (v4 - Recomendado)
- `/v3/scan` (v3 - Compatibilidade)
- `/v2/scan` (v2 - Legado)

### Headers Obrigatórios
```typescript
{
  'X-QUEPASA-USER': string,      // User ID que gerenciará esta conexão
  'X-QUEPASA-TOKEN': string,      // Token (pode ser vazio para gerar novo)
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
```

### Request Body
```json
{}
```
*Nota: Body vazio, mas necessário para POST*

### Response Success (200)
```json
{
  "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "token": "abc123xyz789",
  "timestamp": "2026-01-21T10:00:00Z",
  "expiresIn": 60
}
```

### Response Fields

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `qrcode` | string | QR Code em formato base64 data URI |
| `token` | string | Token gerado (se foi enviado vazio) |
| `timestamp` | string | Data/hora da geração (ISO 8601) |
| `expiresIn` | number | Tempo de expiração em segundos (opcional) |

### Possíveis Erros

#### 401 Unauthorized
```json
{
  "error": true,
  "message": "Invalid user credentials",
  "code": "UNAUTHORIZED"
}
```

#### 409 Conflict
```json
{
  "error": true,
  "message": "Session already connected",
  "code": "SESSION_ALREADY_ACTIVE"
}
```

#### 500 Internal Server Error
```json
{
  "error": true,
  "message": "Failed to generate QR code",
  "code": "QR_GENERATION_FAILED"
}
```

### Comportamento Esperado

1. **Token Vazio**: Se `X-QUEPASA-TOKEN` estiver vazio, um novo token será gerado
2. **Token Existente**: Se token já existe e está ativo, retorna erro 409
3. **Expiração**: QR Code expira em ~60 segundos, necessário gerar novo
4. **Polling**: Cliente deve verificar status periodicamente após escanear

### Implementação no n8n

#### Parâmetros do Node
```typescript
{
  name: 'Get QR Code',
  value: 'getQrCode',
  description: 'Generate QR Code for WhatsApp authentication',
  action: 'Generate QR Code for authentication'
}
```

#### Campos de Entrada
```typescript
[
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
    required: true,
    description: 'User ID to manage this connection'
  },
  {
    displayName: 'Token',
    name: 'token',
    type: 'string',
    default: '',
    required: false,
    description: 'Leave empty to generate a new token'
  },
  {
    displayName: 'Return QR as Image',
    name: 'returnAsImage',
    type: 'boolean',
    default: true,
    description: 'Return QR Code as binary image data'
  }
]
```

#### Output
```typescript
interface QRCodeOutput {
  qrcode: string;        // Base64 data URI
  qrcodeBinary?: Buffer; // Binary se returnAsImage = true
  token: string;
  timestamp: string;
  expiresIn?: number;
}
```

### Exemplo de Uso

#### Request cURL
```bash
curl --location 'https://quepasa.example.com/scan' \
  --header 'Accept: application/json' \
  --header 'X-QUEPASA-USER: admin' \
  --header 'X-QUEPASA-TOKEN: ' \
  --header 'Content-Type: application/json' \
  --data '{}'
```

#### Workflow n8n
```
1. Session Node (Get QR Code)
   └── userId: "admin"
   └── token: "" (empty)
   
2. Send Email Node
   └── attachment: {{ $json.qrcodeBinary }}
   └── subject: "Scan this QR Code"
```

### Validações Necessárias

```typescript
// Validar User ID
function validateUserId(userId: string): boolean {
  if (!userId || userId.trim().length === 0) {
    throw new Error('User ID is required');
  }
  if (userId.length > 50) {
    throw new Error('User ID too long (max 50 characters)');
  }
  return true;
}

// Validar formato de QR Code
function validateQRCode(qrcode: string): boolean {
  return qrcode.startsWith('data:image/png;base64,');
}
```

### Casos de Uso

1. **Nova Conta**: Conectar uma nova conta WhatsApp ao sistema
2. **Reconexão**: Reconectar após desconexão/logout
3. **Automação**: Gerar QR e enviar por email/webhook
4. **Multi-Conta**: Gerar QR para múltiplas contas diferentes

---

## 📡 Operação 2: Check Status

### Descrição
Verifica o status atual da sessão WhatsApp (conectado, desconectado, aguardando QR, etc.)

### Endpoint
```
GET /info
```

### Versões Suportadas
- `/info` (v4 - Recomendado)
- `/v3/info` (v3 - Compatibilidade)
- `/v2/info` (v2 - Legado)

### Headers Obrigatórios
```typescript
{
  'X-QUEPASA-TOKEN': string,     // Token da sessão
  'Accept': 'application/json'
}
```

### Query Parameters
Nenhum

### Response Success (200)
```json
{
  "connected": true,
  "phone": "5511999999999",
  "user": "admin",
  "version": "v4",
  "battery": 85,
  "plugged": true,
  "groups": true,
  "broadcasts": false,
  "timestamp": "2026-01-21T10:30:00Z"
}
```

### Response Fields

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `connected` | boolean | Se está conectado ao WhatsApp |
| `phone` | string | Número do WhatsApp conectado |
| `user` | string | User ID da sessão |
| `version` | string | Versão da API |
| `battery` | number | Nível de bateria do celular (%) |
| `plugged` | boolean | Se está carregando |
| `groups` | boolean | Suporte a grupos habilitado |
| `broadcasts` | boolean | Suporte a broadcasts habilitado |
| `timestamp` | string | Data/hora da verificação |

### Possíveis Erros

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
  "message": "Session not found",
  "code": "SESSION_NOT_FOUND"
}
```

### Implementação no n8n

#### Parâmetros do Node
```typescript
{
  name: 'Check Status',
  value: 'checkStatus',
  description: 'Check WhatsApp session status',
  action: 'Check session status'
}
```

#### Campos de Entrada
```typescript
[
  {
    displayName: 'Include Details',
    name: 'includeDetails',
    type: 'boolean',
    default: true,
    description: 'Include battery and other details'
  }
]
```

#### Output
```typescript
interface StatusOutput {
  connected: boolean;
  phone?: string;
  user: string;
  version: string;
  battery?: number;
  plugged?: boolean;
  groups: boolean;
  broadcasts: boolean;
  timestamp: string;
}
```

### Exemplo de Uso

#### Request cURL
```bash
curl --location 'https://quepasa.example.com/info' \
  --header 'Accept: application/json' \
  --header 'X-QUEPASA-TOKEN: abc123xyz789'
```

#### Workflow n8n
```
1. Schedule Trigger (every 5 minutes)
   
2. Session Node (Check Status)
   
3. IF Node
   └── connected === false
       
4. Session Node (Get QR Code)
   
5. Send Alert
```

### Casos de Uso

1. **Monitoramento**: Verificar status periodicamente
2. **Health Check**: Garantir que sessão está ativa
3. **Dashboard**: Exibir status de múltiplas contas
4. **Auto-Reconexão**: Detectar desconexão e gerar novo QR

---

## 📡 Operação 3: Get Info

### Descrição
Obtém informações detalhadas da conta WhatsApp conectada, incluindo perfil e configurações.

### Endpoint
```
GET /info
```

*Nota: Mesmo endpoint do Check Status, mas com interpretação diferente no contexto*

### Headers Obrigatórios
```typescript
{
  'X-QUEPASA-TOKEN': string,
  'Accept': 'application/json'
}
```

### Response Success (200)
```json
{
  "connected": true,
  "phone": "5511999999999",
  "user": "admin",
  "version": "v4",
  "pushname": "João Silva",
  "platform": "android",
  "battery": 85,
  "plugged": true,
  "groups": true,
  "broadcasts": false,
  "readreceipts": true,
  "calls": true,
  "timestamp": "2026-01-21T10:30:00Z"
}
```

### Response Fields Adicionais

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `pushname` | string | Nome de exibição no WhatsApp |
| `platform` | string | Plataforma (android/ios/web) |
| `readreceipts` | boolean | Recibos de leitura habilitados |
| `calls` | boolean | Chamadas habilitadas |

### Implementação no n8n

#### Output Completo
```typescript
interface AccountInfo extends StatusOutput {
  pushname?: string;
  platform?: string;
  readreceipts?: boolean;
  calls?: boolean;
  features?: {
    groups: boolean;
    broadcasts: boolean;
    reactions: boolean;
  };
}
```

---

## 📡 Operação 4: Disconnect

### Descrição
Desconecta a sessão WhatsApp atual, fazendo logout da conta.

### Endpoint
```
POST /logout
```

### Versões Suportadas
- `/logout` (v4 - Recomendado)
- `/v2/logout` (v2 - Legado)

### Headers Obrigatórios
```typescript
{
  'X-QUEPASA-TOKEN': string,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
```

### Request Body
```json
{}
```

### Response Success (200)
```json
{
  "success": true,
  "message": "Session disconnected successfully",
  "timestamp": "2026-01-21T10:45:00Z"
}
```

### Possíveis Erros

#### 401 Unauthorized
```json
{
  "error": true,
  "message": "Invalid token",
  "code": "UNAUTHORIZED"
}
```

#### 404 Not Found
```json
{
  "error": true,
  "message": "Session not found or already disconnected",
  "code": "SESSION_NOT_FOUND"
}
```

### Implementação no n8n

#### Parâmetros do Node
```typescript
{
  name: 'Disconnect',
  value: 'disconnect',
  description: 'Disconnect WhatsApp session',
  action: 'Disconnect session'
}
```

#### Campos de Entrada
```typescript
[
  {
    displayName: 'Confirmation',
    name: 'confirmation',
    type: 'boolean',
    default: false,
    required: true,
    description: 'Confirm you want to disconnect this session'
  }
]
```

### Exemplo de Uso

#### Request cURL
```bash
curl --location --request POST 'https://quepasa.example.com/logout' \
  --header 'Accept: application/json' \
  --header 'X-QUEPASA-TOKEN: abc123xyz789' \
  --header 'Content-Type: application/json' \
  --data '{}'
```

#### Workflow n8n
```
1. HTTP Request Node (Check condition)
   
2. IF Node
   └── shouldDisconnect === true
       
3. Session Node (Disconnect)
   
4. Notification Node
   └── message: "Session disconnected"
```

### Casos de Uso

1. **Manutenção**: Desconectar para manutenção programada
2. **Segurança**: Forçar logout por motivos de segurança
3. **Troca de Conta**: Desconectar para conectar outra conta
4. **Limpeza**: Remover sessões antigas/inativas

---

## 🔧 Implementação Técnica

### Interface TypeScript Completa

```typescript
// Session Node Operations
export enum SessionOperation {
  GET_QR_CODE = 'getQrCode',
  CHECK_STATUS = 'checkStatus',
  GET_INFO = 'getInfo',
  DISCONNECT = 'disconnect'
}

// Request Interfaces
export interface GetQRCodeRequest {
  userId: string;
  token?: string;
}

export interface CheckStatusRequest {
  includeDetails?: boolean;
}

export interface DisconnectRequest {
  confirmation: boolean;
}

// Response Interfaces
export interface QRCodeResponse {
  qrcode: string;
  token: string;
  timestamp: string;
  expiresIn?: number;
}

export interface SessionStatusResponse {
  connected: boolean;
  phone?: string;
  user: string;
  version: string;
  battery?: number;
  plugged?: boolean;
  groups: boolean;
  broadcasts: boolean;
  timestamp: string;
}

export interface AccountInfoResponse extends SessionStatusResponse {
  pushname?: string;
  platform?: string;
  readreceipts?: boolean;
  calls?: boolean;
  features?: {
    groups: boolean;
    broadcasts: boolean;
    reactions: boolean;
  };
}

export interface DisconnectResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

// Error Interface
export interface SessionError {
  error: true;
  message: string;
  code: string;
  details?: Record<string, any>;
}
```

### Funções Auxiliares

```typescript
// Validações
export class SessionValidator {
  static validateUserId(userId: string): void {
    if (!userId || userId.trim().length === 0) {
      throw new Error('User ID is required');
    }
    if (userId.length > 50) {
      throw new Error('User ID too long (max 50 characters)');
    }
  }

  static validateToken(token: string): void {
    if (!token || token.trim().length === 0) {
      throw new Error('Token is required');
    }
  }

  static validateQRCodeFormat(qrcode: string): boolean {
    return qrcode.startsWith('data:image/png;base64,');
  }
}

// Helpers
export class SessionHelper {
  static async waitForConnection(
    token: string,
    maxAttempts: number = 20,
    interval: number = 3000
  ): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.checkStatus(token);
      if (status.connected) {
        return true;
      }
      await this.sleep(interval);
    }
    return false;
  }

  static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static parseQRCodeToImage(qrcode: string): Buffer {
    const base64Data = qrcode.replace(/^data:image\/png;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  }
}
```

### API Request Builder

```typescript
export class SessionAPI {
  constructor(
    private baseUrl: string,
    private token?: string
  ) {}

  async getQRCode(userId: string, token?: string): Promise<QRCodeResponse> {
    const response = await axios.post(
      `${this.baseUrl}/scan`,
      {},
      {
        headers: {
          'X-QUEPASA-USER': userId,
          'X-QUEPASA-TOKEN': token || '',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

  async checkStatus(): Promise<SessionStatusResponse> {
    SessionValidator.validateToken(this.token!);
    
    const response = await axios.get(
      `${this.baseUrl}/info`,
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  }

  async getInfo(): Promise<AccountInfoResponse> {
    return this.checkStatus() as Promise<AccountInfoResponse>;
  }

  async disconnect(): Promise<DisconnectResponse> {
    SessionValidator.validateToken(this.token!);
    
    const response = await axios.post(
      `${this.baseUrl}/logout`,
      {},
      {
        headers: {
          'X-QUEPASA-TOKEN': this.token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }
}
```

---

## 🧪 Testes

### Casos de Teste

```typescript
describe('Session Node', () => {
  describe('Get QR Code', () => {
    it('should generate QR code with empty token', async () => {
      const result = await sessionAPI.getQRCode('admin', '');
      expect(result.qrcode).toMatch(/^data:image\/png;base64,/);
      expect(result.token).toBeDefined();
    });

    it('should throw error with invalid user ID', async () => {
      await expect(
        sessionAPI.getQRCode('', '')
      ).rejects.toThrow('User ID is required');
    });

    it('should return 409 if session already active', async () => {
      // First connection
      await sessionAPI.getQRCode('admin', 'token1');
      
      // Try again with same token
      await expect(
        sessionAPI.getQRCode('admin', 'token1')
      ).rejects.toMatchObject({
        response: { status: 409 }
      });
    });
  });

  describe('Check Status', () => {
    it('should return connection status', async () => {
      const result = await sessionAPI.checkStatus();
      expect(result).toHaveProperty('connected');
      expect(result).toHaveProperty('user');
    });

    it('should throw error with invalid token', async () => {
      const invalidAPI = new SessionAPI('http://localhost', 'invalid');
      await expect(
        invalidAPI.checkStatus()
      ).rejects.toMatchObject({
        response: { status: 401 }
      });
    });
  });

  describe('Disconnect', () => {
    it('should disconnect active session', async () => {
      const result = await sessionAPI.disconnect();
      expect(result.success).toBe(true);
    });

    it('should return 404 for non-existent session', async () => {
      await expect(
        sessionAPI.disconnect()
      ).rejects.toMatchObject({
        response: { status: 404 }
      });
    });
  });
});
```

---

## 📚 Exemplos Práticos

### Exemplo 1: Conectar Nova Conta

```typescript
// 1. Gerar QR Code
const qrResult = await sessionNode.execute({
  operation: 'getQrCode',
  userId: 'suporte',
  token: ''
});

console.log('Token gerado:', qrResult.token);
console.log('QR Code:', qrResult.qrcode);

// 2. Aguardar conexão
const helper = new SessionHelper();
const connected = await helper.waitForConnection(qrResult.token);

if (connected) {
  console.log('✅ Conectado com sucesso!');
  
  // 3. Obter informações da conta
  const info = await sessionNode.execute({
    operation: 'getInfo'
  });
  
  console.log('Número:', info.phone);
  console.log('Nome:', info.pushname);
}
```

### Exemplo 2: Monitoramento de Sessões

```typescript
// Workflow: Monitorar múltiplas contas
const accounts = [
  { name: 'Suporte', token: 'token1' },
  { name: 'Vendas', token: 'token2' },
  { name: 'Marketing', token: 'token3' }
];

for (const account of accounts) {
  try {
    const status = await sessionNode.execute({
      operation: 'checkStatus'
    });
    
    if (!status.connected) {
      // Enviar alerta
      await sendAlert({
        title: `Conta ${account.name} desconectada`,
        message: 'Por favor, reconectar a conta'
      });
    }
  } catch (error) {
    console.error(`Erro ao verificar ${account.name}:`, error);
  }
}
```

### Exemplo 3: Auto-Reconexão

```typescript
// Workflow com auto-reconexão
async function ensureConnection(userId: string, token: string) {
  try {
    const status = await sessionAPI.checkStatus();
    
    if (status.connected) {
      return { success: true, token };
    }
  } catch (error) {
    console.log('Sessão não conectada, gerando novo QR...');
  }
  
  // Gerar novo QR
  const qrResult = await sessionAPI.getQRCode(userId, '');
  
  // Enviar QR por email/webhook
  await sendQRCodeEmail(qrResult.qrcode);
  
  // Aguardar conexão
  const helper = new SessionHelper();
  const connected = await helper.waitForConnection(qrResult.token, 40, 3000);
  
  if (connected) {
    return { success: true, token: qrResult.token };
  } else {
    throw new Error('Timeout waiting for connection');
  }
}
```

---

## ⚠️ Considerações Importantes

### Segurança

1. **Tokens**: Armazenar tokens de forma segura (criptografados)
2. **User ID**: Validar e sanitizar user IDs
3. **Rate Limiting**: Limitar geração de QR Codes (máx 5/minuto)
4. **Expiração**: QR Codes expiram rapidamente (~60s)

### Performance

1. **Polling**: Não fazer polling muito frequente (mín 3s de intervalo)
2. **Cache**: Cachear status por alguns segundos
3. **Timeout**: Definir timeouts adequados (30-60s)

### Boas Práticas

1. **Validação**: Sempre validar inputs antes de fazer requisições
2. **Error Handling**: Tratar todos os possíveis erros
3. **Logging**: Registrar operações de sessão para auditoria
4. **Notificações**: Alertar usuários sobre desconexões

---

## 📊 Prioridade de Implementação

1. **Sprint 1** (Semana 1):
   - ✅ Get QR Code (CRÍTICO)
   - ✅ Check Status (CRÍTICO)

2. **Sprint 1** (Semana 2):
   - ✅ Get Info (ALTA)
   - ✅ Disconnect (MÉDIA)

---

**Documento criado em:** 21/01/2026  
**Versão:** 1.0  
**Status:** 📋 Especificação Completa  
**Próximo:** Message Node
