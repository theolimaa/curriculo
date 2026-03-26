# 📄 Currículo IA

Gerador de currículos profissionais com IA por R$ 4,90.

## Stack

- **Next.js 14** — frontend + API routes
- **Mercado Pago** — pagamento via Pix
- **Claude (Anthropic)** — geração e melhoria do currículo
- **jsPDF** — geração do PDF no navegador

## Fluxo

```
Usuário preenche formulário
        ↓
App cria cobrança Pix no Mercado Pago
        ↓
Usuário paga
        ↓
Mercado Pago dispara webhook → app confirma pagamento
        ↓
Claude API melhora e profissionaliza os textos
        ↓
Usuário revisa e edita
        ↓
PDF é gerado e baixado no navegador
```

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/curriculo-ia.git
cd curriculo-ia
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` e preencha:

```env
MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
ANTHROPIC_API_KEY=sua_chave_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Onde conseguir os tokens:**
- Mercado Pago: https://www.mercadopago.com.br/developers/panel
- Anthropic: https://console.anthropic.com/

### 4. Rode o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## Webhook local (desenvolvimento)

Para testar o webhook do Mercado Pago localmente, use o [ngrok](https://ngrok.com/):

```bash
ngrok http 3000
```

Copie a URL gerada (ex: `https://abc123.ngrok.io`) e cole em:
- `.env.local` → `NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io`
- No painel do Mercado Pago → Suas aplicações → Webhooks

## Deploy (Vercel)

```bash
npm install -g vercel
vercel
```

Adicione as variáveis de ambiente no painel da Vercel.

## Estrutura do projeto

```
src/
  app/
    page.tsx              # Frontend completo (4 steps)
    layout.tsx            # Layout raiz
    globals.css           # Estilos globais
    api/
      create-payment/     # Cria cobrança Pix
      webhook/            # Recebe confirmação do MP
      check-payment/      # Polling de status
      generate-cv/        # Chama Claude API
  lib/
    types.ts              # Tipos TypeScript
    storage.ts            # Armazena pagamentos em memória
    generatePDF.ts        # Gera o PDF no cliente
```

## Próximos passos

- [ ] Substituir `storage.ts` por Redis ou Supabase (para produção)
- [ ] Upsell de carta de apresentação por R$ 2,90
- [ ] Analytics (quantos iniciaram vs pagaram)
- [ ] Múltiplos templates de currículo
