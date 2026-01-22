# 📦 Guia de Publicação no npm

## 🎯 STATUS ATUAL

✅ Código pronto  
✅ Build compilado  
✅ package.json configurado (v2.0.0)  
✅ LICENSE adicionado  
✅ .npmignore criado  
✅ GitHub atualizado  
⏳ **PRÓXIMO:** Login e publicação npm

---

## 🔐 PASSO 1: Criar Conta npm (se não tiver)

1. Acesse: https://www.npmjs.com/signup
2. Crie uma conta
3. Confirme email

**OU** se já tiver conta, pule para Passo 2.

---

## 🔑 PASSO 2: Login no npm

### Opção A: Via Terminal (Interativo)

```bash
npm login
```

Será pedido:
- **Username:** seu_username_npm
- **Password:** sua_senha
- **Email:** seu_email@example.com
- **OTP (se habilitado):** código 2FA

### Opção B: Via Token (Recomendado para CI/CD)

1. Gere token em: https://www.npmjs.com/settings/[seu-user]/tokens
2. Type: **Automation** ou **Publish**
3. Copie o token
4. Configure:

```bash
# Método 1: Via arquivo .npmrc
echo "//registry.npmjs.org/:_authToken=NPM_TOKEN_AQUI" >> ~/.npmrc

# Método 2: Via variável de ambiente
export NPM_TOKEN=seu_token_aqui
```

---

## 📤 PASSO 3: Publicar Pacote

### Verificar se está logado

```bash
npm whoami
# Deve mostrar seu username
```

### Dry Run (Testar sem publicar)

```bash
npm publish --dry-run
```

Isso vai mostrar:
- O que será incluído no pacote
- Tamanho final
- Arquivos que serão publicados

**Verifique:**
- ✅ Só arquivos `dist/` são incluídos
- ✅ `README.md` incluído
- ✅ `LICENSE` incluído
- ✅ `package.json` incluído
- ❌ Código-fonte (`nodes/`, `utils/`) NÃO incluído
- ❌ Configs (`.eslintrc`, etc.) NÃO incluídos

### Publicar!

```bash
npm publish --access public
```

**Por que `--access public`?**  
Pacotes scoped (@seu-user/pacote) são privados por padrão.  
`--access public` torna o pacote público e gratuito.

---

## ✅ PASSO 4: Verificar Publicação

### Ver no npm Registry

👉 https://www.npmjs.com/package/n8n-nodes-quepasa

### Testar Instalação

```bash
# Em outro diretório
mkdir test-install
cd test-install
npm init -y
npm install n8n-nodes-quepasa
```

Se instalar com sucesso: **🎉 PUBLICADO!**

---

## 🎯 PASSO 5: Usar no n8n

### Via n8n Community Nodes

1. Abra n8n
2. Settings → Community Nodes
3. Instale: `n8n-nodes-quepasa`
4. Restart n8n
5. Procure por "QuePasa" nos nodes!

### Via npm (n8n local)

```bash
# No diretório do n8n
cd ~/.n8n
npm install n8n-nodes-quepasa
n8n start
```

---

## 🔄 ATUALIZAÇÕES FUTURAS

### Publicar Nova Versão

```bash
# 1. Fazer mudanças no código
# ... editar arquivos ...

# 2. Build
npm run build

# 3. Atualizar versão (escolha um)
npm version patch  # 2.0.0 -> 2.0.1 (bugfix)
npm version minor  # 2.0.0 -> 2.1.0 (feature)
npm version major  # 2.0.0 -> 3.0.0 (breaking change)

# 4. Commit e push
git push
git push --tags

# 5. Publicar
npm publish --access public
```

---

## 📊 INFORMAÇÕES DO PACOTE

### Nome
```
n8n-nodes-quepasa
```

### Versão Atual
```
2.0.0
```

### Tamanho Estimado
```
~300 KB (compactado)
~1.5 MB (descompactado)
```

### O que está incluído

```
n8n-nodes-quepasa/
├── dist/
│   ├── credentials/
│   │   └── QuePasaApi.credentials.js
│   ├── nodes/
│   │   └── QuePasa/
│   │       ├── QuePasa.node.js
│   │       ├── quepasa.svg
│   │       └── descriptions/
│   │           ├── SessionDescription.js
│   │           ├── MessageDescription.js
│   │           ├── GroupDescription.js
│   │           ├── ContactDescription.js
│   │           ├── MediaDescription.js
│   │           ├── WebhookDescription.js
│   │           ├── ChatDescription.js
│   │           └── StatusDescription.js
│   └── utils/
│       ├── GenericFunctions.js
│       └── Validators.js
├── README.md
├── LICENSE
└── package.json
```

---

## 🔍 TROUBLESHOOTING

### Erro: "You must be logged in"

```bash
npm login
# ou
npm adduser
```

### Erro: "Package name too similar"

Alguém já tem um pacote com nome parecido.  
**Solução:** Nosso nome `n8n-nodes-quepasa` é único, não deve dar esse erro.

### Erro: "You do not have permission"

Você não é owner do pacote.  
**Solução:** É a primeira publicação, não deve dar esse erro.

### Erro: "Version already exists"

Versão 2.0.0 já foi publicada.  
**Solução:**

```bash
npm version patch  # vai para 2.0.1
npm publish --access public
```

### Erro: "402 Payment Required"

Tentando publicar pacote privado sem plano pago.  
**Solução:** Use `--access public`

---

## 📈 APÓS PUBLICAÇÃO

### 1. Adicionar Badge ao README

```markdown
[![npm version](https://badge.fury.io/js/n8n-nodes-quepasa.svg)](https://www.npmjs.com/package/n8n-nodes-quepasa)
[![Downloads](https://img.shields.io/npm/dm/n8n-nodes-quepasa.svg)](https://www.npmjs.com/package/n8n-nodes-quepasa)
```

### 2. Atualizar Tag Git

```bash
# Criar nova tag v2.0.0 com informação npm
git tag -a v2.0.0-npm -m "Release v2.0.0 - Published on npm"
git push origin v2.0.0-npm
```

### 3. Anunciar!

- ✅ n8n Community: https://community.n8n.io/
- ✅ Twitter/X com hashtag #n8n
- ✅ LinkedIn
- ✅ Reddit r/n8n

### 4. Monitorar

- 📊 Downloads: https://www.npmjs.com/package/n8n-nodes-quepasa
- 🐛 Issues: https://github.com/yurisilvapro/n8n-quepasa-api-yurisilva_pro/issues
- ⭐ Stars: https://github.com/yurisilvapro/n8n-quepasa-api-yurisilva_pro

---

## 🎊 CHECKLIST FINAL

Antes de publicar:

- [x] ✅ Build compilado (`npm run build`)
- [x] ✅ Testes passando (`npm test`)
- [x] ✅ Versão correta no package.json (2.0.0)
- [x] ✅ LICENSE presente
- [x] ✅ README.md atualizado
- [x] ✅ .npmignore configurado
- [x] ✅ Repository URLs corretos
- [x] ✅ Keywords otimizados
- [ ] ⏳ Login no npm (`npm login`)
- [ ] ⏳ Dry run ok (`npm publish --dry-run`)
- [ ] ⏳ Publicado! (`npm publish --access public`)

---

## 📞 SUPORTE

**Dúvidas npm?** https://docs.npmjs.com/  
**Dúvidas n8n?** https://docs.n8n.io/integrations/community-nodes/  
**Issues?** https://github.com/yurisilvapro/n8n-quepasa-api-yurisilva_pro/issues

---

## 🚀 COMANDO RÁPIDO

```bash
# Tudo em um comando (se já estiver logado)
npm run build && npm publish --access public
```

---

**🎯 Pronto para publicar? Execute os comandos acima! 🎯**

**Data:** 22 de Janeiro de 2026  
**Status:** ⏳ Aguardando login npm
