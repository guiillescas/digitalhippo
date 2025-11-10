# Checklist de Produção - DigitalHippo

## Variáveis de Ambiente Necessárias

Certifique-se de que todas as variáveis de ambiente estão configuradas na sua plataforma de deploy:

### Obrigatórias:
```bash
PAYLOAD_SECRET=your-payload-secret-here
MONGODB_URL=mongodb+srv://your-connection-string
NEXT_PUBLIC_SERVER_URL=https://seu-dominio.com
PAYLOAD_CONFIG_PATH=dist/payload.config.js
NODE_ENV=production
```

### Para funcionalidades específicas:
```bash
RESEND_API_KEY=your-resend-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## Comandos de Build e Deploy

### 1. Build do projeto:
```bash
yarn build
```

### 2. Start em produção:
```bash
yarn start
```

## Problemas Comuns

### Erro: "cannot find Payload config"
**Solução**: Certifique-se de que `PAYLOAD_CONFIG_PATH=dist/payload.config.js` está definido

### Erro 500 em getInfiniteProducts
**Possíveis causas**:
1. `MONGODB_URL` não está configurado
2. `PAYLOAD_SECRET` não está configurado
3. Banco de dados não está acessível
4. Não há produtos com `approvedForSale: 'approved'` no banco

### Erro 404 em /products
**Solução**: A página `/products` agora existe. Rebuild e redeploy.

## Verificação de Deploy

Após o deploy, teste:
1. [ ] Acesso ao admin: `https://seu-dominio.com/sell`
2. [ ] Página inicial: `https://seu-dominio.com/`
3. [ ] Página de produtos: `https://seu-dominio.com/products`
4. [ ] API TRPC: `https://seu-dominio.com/api/trpc/getInfiniteProducts`

